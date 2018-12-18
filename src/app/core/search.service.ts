import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, mergeMap, share } from 'rxjs/operators';

// import * as _ from 'lodash';

import { DM } from './../domain/data-mode';
import { IDInchikey } from './../domain/id-inchikey';
import { IDSimilarity } from './../domain/id-similarity';
import { IDStructure } from './../domain/id-structure';
import { PagedSearch, PagedSearchSubstancesResult } from './../domain/paging';
import { Search, SearchMut } from './../domain/search';
import { SearchEvent } from './../domain/search-event';
import { SearchTotals } from './../domain/search-totals';
import { ServerJSON, TypeServerJSON, SourceServerJSON, TotalsServerJSON, SubstancesResultServerJSON, ValueCountsResultServerJSON } from './../domain/server-json';
import { Source } from './../domain/source';
import { Structure } from './../domain/structure';
import { Substance } from './../domain/substance';
import { SubstancesResult } from './../domain/substances-result';
import { Totals } from './../domain/totals';
import { Type } from './../domain/type';
import { ValueCountsResult, SearchValueCounts } from './../domain/value-counts-result';

import { EnvService } from './env.service';
import { LocalStorageService, Expires } from './local-storage.service';

import { Logger } from './logger';

/* tslint:disable:member-ordering */

@Injectable()
export class SearchService {

	private static readonly DEBOUNCE_TIME :number = 400;
	private static readonly STATUS_404 :number = 404;

	private readonly httpSearchForTotalsStream :Subject<Search> = new Subject<Search>();
	private readonly httpPagedSearchForSummariesStream :Subject<PagedSearch> = new Subject<PagedSearch>();
	private readonly httpIDIKForStructuresStream :Subject<IDInchikey[]> = new Subject<IDInchikey[]>();
	private readonly httpSearchForValueCountsStream :Subject<SearchMut> = new Subject<SearchMut>();

	private readonly searchTotalsStream :Subject<SearchTotals> = new Subject<SearchTotals>();
	private readonly pagedSearchSubstancesResultStream :Subject<PagedSearchSubstancesResult> = new Subject<PagedSearchSubstancesResult>();
	private readonly idikStructuresStream :Subject<ReadonlyArray<IDStructure>> = new Subject<ReadonlyArray<IDStructure>>();
	private readonly searchValueCountsStream :Subject<SearchValueCounts> = new Subject<SearchValueCounts>();

	constructor(readonly httpClient :HttpClient, readonly env :EnvService) {

		Logger.debug('SearchService.constructor');

		this.httpSearchForTotalsStream.pipe(
			debounceTime( SearchService.DEBOUNCE_TIME ),
			distinctUntilChanged( (search1 :Search, search2 :Search) => search1.url === search2.url),
			// Using mergeMap (i.e. flatMap) not switchMap as we want to save all the HTTP fetched results into local storage and not cancel earlier requests
			mergeMap( (search :Search) => {
				Logger.trace('SearchService.httpSearchForTotalsStream.mergeMap', search);
				return this.httpSearchGetTotals(search);
			}),
			share()
		).subscribe( (searchTotals :SearchTotals) => {
			Logger.trace('SearchService.httpSearchForTotalsStream.subscribe -> searchTotalsStream.next', searchTotals);
			this.searchTotalsStream.next(searchTotals);
		});
		this.httpPagedSearchForSummariesStream.pipe(
			debounceTime ( SearchService.DEBOUNCE_TIME ),
			distinctUntilChanged( (pagedSearch1 :PagedSearch, pagedSearch2 :PagedSearch) => pagedSearch1.summariesURL === pagedSearch2.summariesURL),
			// Using mergeMap (i.e. flatMap) not switchMap as we want to save all the HTTP fetched results into local storage and not cancel earlier requests
			mergeMap( (pagedSearch :PagedSearch) => {
				Logger.trace('SearchService.httpPagedSearchForSummariesStream.mergeMap', pagedSearch);
				return this.httpSearchGetSummaries(pagedSearch);
			}),
			share()
		).subscribe( (pssr :PagedSearchSubstancesResult) => {
			Logger.trace('SearchService.httpPagedSearchForSummariesStream.subscribe', pssr);
			this.finishSummariesResults(pssr);
		});
		this.httpIDIKForStructuresStream.pipe(
			mergeMap( (idiks :IDInchikey[]) => {
				Logger.trace('SearchService.httpIDIKForStructuresStream.mergeMap', idiks);
				return this.httpIDIKsGetStructures(idiks);
			}),
			share()
		).subscribe( (sa :ReadonlyArray<IDStructure>) => {
			Logger.trace('SearchService.httpIDIKForStructuresStream.subscribe -> idikStructuresStream.next', sa);
			this.idikStructuresStream.next(sa);
		});
		this.httpSearchForValueCountsStream.pipe(
			debounceTime( SearchService.DEBOUNCE_TIME ),
					// SearchMut is mutable and the new search is likely the same object as last time but with new Expressions. distinctUntilChanged won't see a difference.
					// .distinctUntilChanged( (search1 :Search, search2 :Search) => search1.url === search2.url)
			mergeMap( (searchMut :SearchMut) => {
				Logger.trace('SearchService.httpSearchForValueCountsStream.mergeMap', searchMut);
				return this.httpSearchGetValueCounts(searchMut);
			}),
			share()
		).subscribe( (svc :SearchValueCounts) => {
			Logger.trace('SearchService.httpSearchForValueCountsStream.subscribe -> searchValueCountsStream.next', svc);
			this.searchValueCountsStream.next(svc);
		});
	}

	get oSearchTotals() :Observable<SearchTotals> {
		Logger.trace('SearchService.oSearchTotals');
		return this.searchTotalsStream.asObservable();
	}
	set nextTotalsSearch(search :Search) {
		Logger.trace('SearchService.nextTotalsSearch', search);
		const totals :Totals = SearchService.getCachedTotals(search);
		if(totals){
			Logger.log('SearchService.nextTotalsSearch found cached -> searchTotalsStream.next'/*, totals, 'FOR', search.url*/);
			this.searchTotalsStream.next( new SearchTotals(search, totals) );
		}else{
			Logger.log('SearchService.nextTotalsSearch -> httpSearchForTotalsStream.next', search.url);
			this.httpSearchForTotalsStream.next(search);
		}
	}
	get oPagedSearchSubstancesResult() :Observable<PagedSearchSubstancesResult> {
		Logger.trace('SearchService.oPagedSearchSubstancesResult');
		return this.pagedSearchSubstancesResultStream.asObservable();
	}
	set nextSummariesSearch(pagedSearch :PagedSearch){
		Logger.trace('SearchService.nextSummariesSearch', pagedSearch);
		const sr :SubstancesResult = SearchService.getCachedSubstancesResult(pagedSearch);
		if(sr){
			Logger.trace('SearchService.nextSummariesSearch found ' + (sr.total === 1 ? ('substance ' + sr.substances[0].rn_id) : (sr.substances.length + ' substances')), sr.substances );
			Logger.log('SearchService.nextSummariesSearch found cached -> searchSubstancesResultStream.next');
			this.pagedSearchSubstancesResultStream.next( {'pagedSearch':pagedSearch, 'substancesResult':sr} );
		}else{
			Logger.log('SearchService.nextSummariesSearch -> httpSearchForSummariesStream.next');
			this.httpPagedSearchForSummariesStream.next(pagedSearch);
		}
	}
	set nextSummariesSearchIgnoreCached(pagedSearch :PagedSearch){
		Logger.log('SearchService.nextSummariesSearchIgnoreCached -> httpSearchForSummariesStream.next');
		this.httpPagedSearchForSummariesStream.next(pagedSearch);
	}
	get oSearchValueCounts() :Observable<SearchValueCounts> {
		Logger.trace('SearchService.oSearchValueCounts');
		return this.searchValueCountsStream.asObservable();
	}
	set nextValueCountsSearch(search :SearchMut) {
		Logger.log('SearchService.nextValueCountsSearch -> httpSearchForValueCountsStream.next');
		this.httpSearchForValueCountsStream.next(search);
	}

	get oStructuresFromIDIKs() :Observable<ReadonlyArray<IDStructure>> {
		Logger.trace('SearchService.oStructuresFromIDIKs');
		return this.idikStructuresStream.asObservable();
	}
	set nextStructuresFromIDIKs(idiks :IDInchikey[]) {
		Logger.trace('SearchService.nextStructuresFromIDIKs for ' + idiks.length + ': ' + idiks.map( (idik :IDInchikey) => idik.id));
		const cached :IDStructure[] = [],
			nonCached :IDInchikey[] = [];
		idiks.forEach( (idik :IDInchikey) => {
			const structure :Structure = SearchService.getCachedStructure(idik);
			if(structure){
				cached.push(new IDStructure(idik.id, structure));
			}else{
				nonCached.push(idik);
			}
		});
		if(cached.length){
			Logger.log('SearchService.nextStructuresFromIDIKs found', cached.length, 'cached -> idikStructuresStream.next');
			this.idikStructuresStream.next( cached );
		}
		if(nonCached.length){
			Logger.log('SearchService.nextStructuresFromIDIKs needs', nonCached.length, '-> httpIDIKForStructuresStream.next');
			this.httpIDIKForStructuresStream.next( nonCached );
		}
	}


	static getMatchesValuesInSubstances(totals :Totals, expressionCount :number) :string {
		Logger.trace('SearchService.getMatchesValuesInSubstances', totals);
		return totals ? totals.getMatchesValuesInSubstances(expressionCount) : '';
	}


// HTTP Observables and ServerJSON Extraction
	get oTypes() :Observable<Type[]> {
		Logger.trace('SearchService.oTypes');
		const types :Type[] = SearchService.getCachedTypes();
		if(types){
			return of(types);
		}else{
			return this.httpClientGet<TypeServerJSON[]>('data/meta/types').pipe(
				map( (sja :TypeServerJSON[]) => SearchService.extractTypes(sja) )
			);
		}
	}
	get oSources() :Observable<Source[]> {
		Logger.trace('SearchService.oSources');
		const sources :Source[] = SearchService.getCachedSources();
		if(sources){
			return of(sources);
		}else{
			return this.httpClientGet<SourceServerJSON[]>('data/meta/sources').pipe(
				map( (sja :SourceServerJSON[]) => SearchService.extractSources(sja) )
			);
		}
	}

	private httpSearchGetTotals(search :Search) :Observable<SearchTotals> {
		Logger.trace('SearchService.httpSearchGetTotals');
		return this.httpClientGet<TotalsServerJSON>(search.totalsURL).pipe(
			map( (sj :TotalsServerJSON) => SearchService.extractTotals(search, sj) ),
			catchError( (errRes :HttpErrorResponse, caught :Observable<SearchTotals>) => SearchService.extractTotalsOrError(search, errRes, caught) )
		);
	}
	private static extractTotalsOrError(search :Search, errRes :HttpErrorResponse, _caught :Observable<SearchTotals> ) :Observable<SearchTotals> {
		if ( errRes.status === SearchService.STATUS_404 ){
			Logger.warn('Search NOT FOUND for ' + search.totalsURL);
			return of(SearchService.extractTotals(search, errRes.error));
		}
		Logger.error('ERROR - extractTotalsOrError ' + search.totalsURL);
		SearchService.throwError(errRes);
	}
	private static extractTotals(search :Search, sj :TotalsServerJSON) :SearchTotals {
		Logger.trace('SearchService.extractTotals ' + search.totalsURL);
		try{
			const totals :Totals = ServerJSON.totals(sj);
			SearchService.cacheTotals(search, totals);
			Logger.info('SearchService.extractTotals ' + search.totalsURL, totals);
			return new SearchTotals(search, totals);
		}catch (e){
			Logger.error('SearchService.extractTotals ', e, sj);
			SearchService.throwError(e);
		}
	}

	private httpSearchGetSummaries(pagedSearch :PagedSearch) :Observable<PagedSearchSubstancesResult> {
		const url :string = pagedSearch.summariesURL;
		Logger.trace('SearchService.httpSearchGetSummaries ' + url);
		return this.httpClientGet<SubstancesResultServerJSON>(url).pipe(
			map( (sj :SubstancesResultServerJSON) => SearchService.extractSubstancesResult(pagedSearch, sj) ),
			catchError( (errRes :HttpErrorResponse, caught :Observable<PagedSearchSubstancesResult>) => SearchService.extractSubstancesResultOrError(pagedSearch, errRes, caught) )
		);
	}
	private static extractSubstancesResultOrError(pagedSearch :PagedSearch, errRes :HttpErrorResponse, _caught :Observable<PagedSearchSubstancesResult> ) :Observable<PagedSearchSubstancesResult> {
		if ( errRes.status === SearchService.STATUS_404 ){
			Logger.warn('Search NOT FOUND for ' + pagedSearch.summariesURL);
			return of(SearchService.extractSubstancesResult(pagedSearch, errRes.error));
		}
		Logger.error('ERROR - extractSubstancesResultOrError ' + pagedSearch.summariesURL);
		SearchService.throwError(errRes);
	}
	private static extractSubstancesResult(pagedSearch :PagedSearch, sj :SubstancesResultServerJSON) :PagedSearchSubstancesResult {
		Logger.trace('SearchService.extractSubstancesResult ' + pagedSearch.summariesURL);
		try{
			const pssr :PagedSearchSubstancesResult = new PagedSearchSubstancesResult(pagedSearch, ServerJSON.substancesResult(sj)),
				sr :SubstancesResult = pssr.substancesResult;
			Logger.info('SearchService.extractSubstancesResult ' + pagedSearch.summariesURL + (sr.end ? ' ' + sr.start + '-' + sr.end : ''), pssr.substancesResult.total);
			return SearchService.mergeAndCacheSubstancesResult(pssr);
		}catch (e){
			Logger.error('SearchService.extractSubstancesResult ', e, sj);
			SearchService.throwError(e);
		}
	}
	private finishSummariesResults(pssr :PagedSearchSubstancesResult) :void {
			LocalStorageService.setObject(SearchService.getUrlKey(pssr.pagedSearch.summariesURL), pssr.substancesResult.serialize(), Expires.SHORT);
			Logger.debug('SearchService.finishSummariesResults -> searchSubstancesResultStream.next', pssr);
			this.pagedSearchSubstancesResultStream.next(pssr);
	}

	private httpIDIKsGetStructures(idiks :IDInchikey[]) :Observable<ReadonlyArray<IDStructure>> {
		Logger.trace('SearchService.httpIDIKsGetStructures idiks=' + idiks.map( (idik :IDInchikey) => idik.id));
		const nonCached :IDInchikey[] = idiks.filter( (idik :IDInchikey) => !SearchService.getCachedStructure(idik)),
			numbers :string[] = nonCached.map( (idik :IDInchikey) => idik.id),
			url :string = 'data/nu/in/' + numbers.join('%7C') + '?data=' + DM[DM.structure];

		return this.httpClientGet<SubstancesResultServerJSON>(url).pipe(
			map( (sj :SubstancesResultServerJSON) => SearchService.extractStructuresFromIDIKs(nonCached, sj) ),
			catchError( (errRes :HttpErrorResponse, caught :Observable<ReadonlyArray<IDStructure>>) => SearchService.extractStructuresFromIDIKsOrError(nonCached, errRes, caught) )
		);
	}
	private static extractStructuresFromIDIKsOrError(idiks :IDInchikey[], errRes :HttpErrorResponse, _caught :Observable<ReadonlyArray<IDStructure>> ) :Observable<ReadonlyArray<IDStructure>> {
		if ( errRes.status === SearchService.STATUS_404 ){
			Logger.warn('Search NOT FOUND for idiks=' + idiks.map( (idik :IDInchikey) => idik.id));
			return of(SearchService.extractStructuresFromIDIKs(idiks, errRes.error));
		}
		Logger.error('ERROR - extractStructuresFromIDIKsOrError idiks=' + idiks.map( (idik :IDInchikey) => idik.id));
		SearchService.throwError(errRes);
	}
	private static extractStructuresFromIDIKs(idiks :IDInchikey[], sj :SubstancesResultServerJSON) :ReadonlyArray<IDStructure> {
		Logger.debug('SearchService.extractStructuresFromIDIKs ' + idiks.map( (idik :IDInchikey) => idik.id));
		try{
			const sr :SubstancesResult = ServerJSON.substancesResult(sj),
				idStructures :IDStructure[] = [];
			sr.substances.forEach( (s :Substance, index :number) => {
				SearchService.cacheStructure(s.idik, s.structure);
				idStructures[index] = new IDStructure(s.id, s.structure);
			});
			Logger.info('SearchService.extractStructuresFromIDIKs', idStructures.length);
			return idStructures;
		}catch (e){
			Logger.error('SearchService.extractStructuresFromIDIKs ', e, sj);
			SearchService.throwError(e);
		}
	}


	private httpSearchGetValueCounts(searchMut :SearchMut) :Observable<SearchValueCounts> {
		Logger.trace('SearchService.httpSearchGetValueCounts', searchMut);
		return this.httpClientGet<ValueCountsResultServerJSON>(searchMut.acURL).pipe(
			map( (sj :ValueCountsResultServerJSON) => SearchService.extractSearchValueCounts(searchMut, sj) ),
			catchError( (errRes :HttpErrorResponse, caught :Observable<SearchValueCounts>) => SearchService.extractSearchValueCountsOrError(searchMut, errRes, caught) )
		);
	}
	private static extractSearchValueCountsOrError(searchMut :SearchMut, errRes :HttpErrorResponse, _caught :Observable<SearchValueCounts> ) :Observable<SearchValueCounts> {
		if ( errRes.status === SearchService.STATUS_404 ){
			Logger.warn('Search NOT FOUND for ' + searchMut.acURL);
			return of(SearchService.extractSearchValueCounts(searchMut, errRes.error));
		}
		Logger.error('ERROR - extractSearchValueCountsOrError ' + searchMut.acURL);
		SearchService.throwError(errRes);
	}
	private static extractSearchValueCounts(searchMut :SearchMut, sj :ValueCountsResultServerJSON) :SearchValueCounts {
		Logger.trace('SearchService.extractSearchValueCounts ' + searchMut.acURL);
		try{
			const vcr :ValueCountsResult = ServerJSON.valueCountsResult(sj),
				svc :SearchValueCounts = {'search':searchMut, 'vcr':vcr};
			if(vcr.totals.foundMatch){
				SearchService.cacheVCR(svc);
			}
			Logger.info('SearchService.extractSearchValueCounts ' + searchMut.acURL, vcr.totals);
			return svc;
		}catch (e){
			Logger.error('SearchService.extractSearchValueCounts ', e, sj);
			SearchService.throwError(e);
		}
	}

	private static extractTypes(sja :TypeServerJSON[]) :Type[] {
		Logger.trace('SearchService.extractTypes');
		const types :Type[] = ServerJSON.types(sja);
		SearchService.cacheTypes(types);
		Logger.info('SearchService.extractTypes', types.length);
		return types;
	}
	private static extractSources(sja :SourceServerJSON[]) :Source[] {
		Logger.trace('SearchService.extractSources');
		const sources :Source[] = ServerJSON.sources(sja);
		SearchService.cacheSources(sources);
		Logger.info('SearchService.extractSources', sources.length);
		return sources;
	}

	private httpClientGet<T>(url :string) :Observable<T> {
		Logger.trace('HTTP getting ' + url);
		return this.httpClient.get<T>(this.env.apiURL + url);
	}
	private static throwError(errRes :HttpErrorResponse | Error) :void {
		try{
			throw new Error ('ERROR: ' + errRes.message);
		}catch(e){
			throw new Error ('ERROR: ' + errRes);
		}
	}


// Caching
	static getCachedSearchEvents() :SearchEvent[] {
		Logger.trace('SearchService.getCachedSearchEvents');
		return SearchEvent.deserializeArray(LocalStorageService.getObject('h'));
	}
	static cacheSearchEvents(searchEvents :ReadonlyArray<SearchEvent>) :void {
		Logger.trace('SearchService.cacheSearchEvents');
		LocalStorageService.setObject('h', SearchEvent.serializeArray(searchEvents), Expires.YEARS);
	}
	static getCachedTotals(search :Search) :Totals {
		Logger.trace('SearchService.getCachedTotals');
		return Totals.deserialize(LocalStorageService.getObject(SearchService.getUrlKey(search.totalsURL)));
	}
	private static cacheTotals(search :Search, totals :Totals) :void {
		Logger.trace('SearchService.cacheTotals');
		LocalStorageService.setObject(SearchService.getUrlKey(search.totalsURL), totals.serialize(), Expires.DAY);
	}

	private static getCachedSubstancesResult(pagedSearch :PagedSearch) :SubstancesResult {
		Logger.trace('SearchService.getCachedSubstancesResult', pagedSearch);
		const sr :SubstancesResult = SubstancesResult.deserialize(LocalStorageService.getObject(SearchService.getUrlKey(pagedSearch.summariesURL)));
		let substances :Substance[];
		if(sr && sr.idSimilarities){
			Logger.log('SearchService.getCachedSubstancesResult sr=', sr);
			substances = [];
			sr.idSimilarities.forEach( (ids :IDSimilarity, index :number) => {
				const substance :Substance = SearchService.getCachedSubstance(ids.id);
				if(substance){
					substances[index] = substance;
				}else{
					Logger.error('ERROR - the substance ' + ids.id + ' at index=', index, ' with start=', sr.start, 'was not in local storage');
				}
			});
			return new SubstancesResult(sr.total, sr.idSimilarities, sr.start, sr.end, substances);
		}
	}
	private static mergeAndCacheSubstancesResult(pssr :PagedSearchSubstancesResult) :PagedSearchSubstancesResult {
		const sr :SubstancesResult = pssr.substancesResult;
		if(sr){
			Logger.trace('SearchService.mergeAndCacheSubstancesResult', sr.total, sr.start, sr.idSimilarities && sr.idSimilarities.length, sr.substances && sr.substances.length);
			let substances :Substance[];
			if(sr.substances){
				substances = [];
				sr.substances.forEach( (substance :Substance, index :number) => substances[index] = SearchService.mergeAndRecacheSubstance(substance) );
			}
			return { pagedSearch:pssr.pagedSearch, substancesResult:new SubstancesResult(sr.total, sr.idSimilarities, sr.start, sr.end, substances) };
		}
	}

	private static mergeAndRecacheSubstance(substance :Substance) :Substance {
		if(substance){
			Logger.trace('SearchService.mergeAndRecacheSubstance');
			const substance2 :Substance = substance.mergeMissing(SearchService.getCachedSubstance(substance.id));
			SearchService.cacheSubstance(substance2);
			return substance2;
		}
	}
	private static getCachedSubstance(id :string) :Substance {
		const substance :Substance = Substance.deserialize(LocalStorageService.getObject(SearchService.substanceKey(id)));
/*		if(substance){
			return substance.mergeMissingStructure(this.getCachedStructure(substance.idik));
		}
*/
		return substance;
	}
	private static cacheSubstance(substance :Substance) :void {
		if(substance){
			LocalStorageService.setObject(SearchService.substanceKey(substance.id), substance.serialize(), Expires.DAY);
/*			this.cacheStructure(substance.idik, substance.structure);	*/
		}
	}
	private static getCachedStructure(idik :IDInchikey) :Structure {
		return Structure.deserialize(LocalStorageService.getObject(SearchService.structureKey(idik)));
	}
	private static cacheStructure(idik :IDInchikey, structure :Structure) :void {
		if(structure){
			LocalStorageService.setObject(SearchService.structureKey(idik), structure.serialize(), idik.inchikey ? Expires.MONTH : Expires.DAY);
		}
	}

	static getCachedVCR(search :SearchMut, length :number) :ValueCountsResult {
		return ValueCountsResult.deserialize(LocalStorageService.getObject(SearchService.getUrlKey(search.acURL, length)));
	}
	private static cacheVCR(svc :SearchValueCounts) :void {
		LocalStorageService.setObject(SearchService.getUrlKey(svc.search.acURL), svc.vcr.serialize(svc.vcr.expression && (svc.search.acURL !== svc.vcr.expression.url)), Expires.DAY);
	}

	private static getCachedTypes() :Type[] {
		return Type.deserializeArray(LocalStorageService.getObject('types'));
	}
	private static cacheTypes(types :Type[]) :void {
		LocalStorageService.setObject('types', Type.serializeArray(types), Expires.DAY);
	}

	private static getCachedSources() :Source[] {
		return Source.deserializeArray(LocalStorageService.getObject('sources'));
	}
	private static cacheSources(sources :Source[]) :void {
		LocalStorageService.setObject('sources', Source.serializeArray(sources), Expires.DAY);
	}

	static getUrlKey(url :string, length ? :number) :string {
		let url2 :string = decodeURI(url).replace(/data\//, '').replace(/&singleSummaryToDetails=[^&]+/, '').replace(/&testFirst=.+$/, '').toLowerCase();
		if(length){
			const match :RegExpMatchArray = url2.match('(.*/[^/]{' + length + '})[^/]+(\\?.*)');
			if(match){
				url2 = match[1] + match[2];
			}
		}
		return url2.replace(/%2f/g, '/').replace(/%5c/g, '\\').replace(/%2b/g, '+');
	}
	private static substanceKey(id :string) :string {
		return 'sub' + id;
	}
	private static structureKey(idik :IDInchikey) :string {
		return 'str' + (idik.inchikey || idik.id);
	}
}
