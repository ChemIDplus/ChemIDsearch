import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';

import * as _ from 'lodash';

import { DM } from './../domain/data-mode';
import { IDInchikey } from './../domain/id-inchikey';
import { IDSimilarity } from './../domain/id-similarity';
import { IDStructure } from './../domain/id-structure';
import { PagedSearch, PagedSearchSubstancesResult } from './../domain/paging';
import { Search } from './../domain/search';
import { SearchEvent } from './../domain/search-event';
import { SearchMut } from './../domain/search';
import { SearchTotals } from './../domain/search-totals';
import { ServerJSON } from './../domain/server-json';
import { Source } from './../domain/source';
import { Structure } from './../domain/structure';
import { Substance } from './../domain/substance';
import { SubstancesResult, SearchSubstancesResult } from './../domain/substances-result';
import { Totals } from './../domain/totals';
import { Type } from './../domain/type';
import { ValueCountsResult, SearchValueCounts } from './../domain/value-counts-result';

import { LocalStorageService } from './local-storage.service';
import { EnvService } from './env.service';

import { Logger } from './logger';


@Injectable()
export class SearchService {

	private httpSearchForTotalsStream :Subject<Search> = new Subject<Search>();
	private httpPagedSearchForSummariesStream :Subject<PagedSearch> = new Subject<PagedSearch>();
	private httpIDIKForStructuresStream :Subject<IDInchikey[]> = new Subject<IDInchikey[]>();
	private httpSearchForValueCountsStream :Subject<SearchMut> = new Subject<SearchMut>();

	private searchTotalsStream :Subject<SearchTotals> = new Subject<SearchTotals>();
	private pagedSearchSubstancesResultStream :Subject<PagedSearchSubstancesResult> = new Subject<PagedSearchSubstancesResult>();
	private idikStructuresStream :Subject<ReadonlyArray<IDStructure>> = new Subject<ReadonlyArray<IDStructure>>();
	private searchValueCountsStream :Subject<SearchValueCounts> = new Subject<SearchValueCounts>();

	constructor (readonly http :Http, readonly env :EnvService) {

		Logger.debug('SearchService.constructor');

		this.httpSearchForTotalsStream
			.debounceTime( 400 )
			.distinctUntilChanged( (search1 :Search, search2 :Search) => search1.url === search2.url)
			// Using mergeMap (i.e. flatMap) not switchMap as we want to save all the HTTP fetched results into local storage and not cancel earlier requests
			.mergeMap( (search :Search) => {
				Logger.trace('SearchService.httpSearchForTotalsStream.mergeMap', search);
				return this.httpSearchGetTotals(search);
			})
			.share()
			.subscribe( (searchTotals :SearchTotals) => {
				Logger.trace('SearchService.httpSearchForTotalsStream.subscribe -> searchTotalsStream.next', searchTotals);
				this.searchTotalsStream.next(searchTotals);
			});
		this.httpPagedSearchForSummariesStream
			.debounceTime ( 400 )
			.distinctUntilChanged( (pagedSearch1 :PagedSearch, pagedSearch2 :PagedSearch) => pagedSearch1.summariesURL === pagedSearch2.summariesURL)
			// Using mergeMap (i.e. flatMap) not switchMap as we want to save all the HTTP fetched results into local storage and not cancel earlier requests
			.mergeMap( (pagedSearch :PagedSearch) => {
				Logger.trace('SearchService.httpPagedSearchForSummariesStream.mergeMap', pagedSearch);
				return this.httpSearchGetSummaries(pagedSearch);
			})
			.share()
			.subscribe( (pssr :PagedSearchSubstancesResult) => {
				Logger.trace('SearchService.httpPagedSearchForSummariesStream.subscribe', pssr);
				this.finishSummariesResults(pssr);
			});
		this.httpIDIKForStructuresStream
			.mergeMap( (idiks :IDInchikey[]) => {
				Logger.trace('SearchService.httpIDIKForStructuresStream.mergeMap', idiks);
				return this.httpIDIKsGetStructures(idiks);
			})
			.share()
			.subscribe( (sa :ReadonlyArray<IDStructure>) => {
				Logger.trace('SearchService.httpIDIKForStructuresStream.subscribe -> idikStructuresStream.next', sa);
				this.idikStructuresStream.next(sa);
			});
		this.httpSearchForValueCountsStream
			.debounceTime( 400 )
					// SearchMut is mutable and the new search is likely the same object as last time but with new Expressions. distinctUntilChanged won't see a difference.
					// .distinctUntilChanged( (search1 :Search, search2 :Search) => search1.url === search2.url)
			.mergeMap( (searchMut :SearchMut) => {
				Logger.trace('SearchService.httpSearchForValueCountsStream.mergeMap', searchMut);
				return this.httpSearchGetValueCounts(searchMut);
			})
			.share()
			.subscribe( (svc :SearchValueCounts) => {
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
		const totals :Totals = this.getCachedTotals(search);
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
		const sr :SubstancesResult = this.getCachedSubstancesResult(pagedSearch);
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
			const structure :Structure = this.getCachedStructure(idik);
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


	getMatchesValuesInSubstances(totals :Totals, expressionCount :number) :string {
		Logger.trace('SearchService.getMatchesValuesInSubstances', totals);
		return totals ? totals.getMatchesValuesInSubstances(expressionCount) : '';
	}


// HTTP Observables and ServerJSON Extraction
	get oTypes() :Observable<Type[]> {
		Logger.trace('SearchService.oTypes');
		const types :Type[] = this.getCachedTypes();
		if(types){
			return Observable.of(types);
		}else{
			return this.httpGetData('data/meta/types')
					.map( (res :Response) => this.extractTypes(res) );
		}
	}
	get oSources() :Observable<Source[]> {
		Logger.trace('SearchService.oSources');
		const sources :Source[] = this.getCachedSources();
		if(sources){
			return Observable.of(sources);
		}else{
			return this.httpGetData('data/meta/sources')
					.map( (res :Response) => this.extractSources(res) );
		}
	}

	private httpSearchGetTotals(search :Search) :Observable<SearchTotals> {
		Logger.trace('SearchService.httpSearchGetTotals');
		return this.httpGetData(search.totalsURL)
				.map( (res :Response) => this.extractTotals(search, res) )
				.catch( (err :Response, caught :Observable<SearchTotals>) => this.extractTotalsOrError(search, err, caught) );
	}
	private extractTotalsOrError(search :Search, res :Response, caught :Observable<SearchTotals> ) :Observable<SearchTotals> {
		if ( res.status === 404 ){
			Logger.warn('Search NOT FOUND for ' + search.totalsURL);
			return Observable.of(this.extractTotals(search, res));
		}
		Logger.error('ERROR - extractTotalsOrError ' + search.totalsURL);
		this.throwError(res);
	}
	private extractTotals(search :Search, res :Response) :SearchTotals {
		if (res.status !== 200 && res.status !== 404) {
			throw new Error('Bad response status: ' + res.status);
		}
		Logger.trace('SearchService.extractTotals ' + search.totalsURL);
		try{
			const totals :Totals = ServerJSON.totals(res.json());
			this.cacheTotals(search, totals);
			Logger.info('SearchService.extractTotals ' + search.totalsURL, totals);
			return new SearchTotals(search, totals);
		}catch (err){
			Logger.error('SearchService.extractTotals ', err, res.text());
			this.throwError(res);
		}
	}

	private httpSearchGetSummaries(pagedSearch :PagedSearch) :Observable<PagedSearchSubstancesResult> {
		const search :Search = pagedSearch.search,
			url :string = pagedSearch.summariesURL;
		Logger.trace('SearchService.httpSearchGetSummaries ' + url);
		return this.httpGetData(url)
				.map( (res :Response) => this.extractSubstancesResult(pagedSearch, res) )
				.catch( (err :Response, caught :Observable<PagedSearchSubstancesResult>) => this.extractSubstancesResultOrError(pagedSearch, err, caught) );
	}
	private extractSubstancesResultOrError(pagedSearch :PagedSearch, res :Response, caught :Observable<PagedSearchSubstancesResult> ) :Observable<PagedSearchSubstancesResult> {
		if ( res.status === 404 ){
			Logger.warn('Search NOT FOUND for ' + pagedSearch.summariesURL);
			return Observable.of(this.extractSubstancesResult(pagedSearch, res));
		}
		Logger.error('ERROR - extractSubstancesResultOrError ' + pagedSearch.summariesURL);
		this.throwError(res);
	}
	private extractSubstancesResult(pagedSearch :PagedSearch, res :Response) :PagedSearchSubstancesResult {
		if (res.status !== 200 && res.status !== 404) {
			throw new Error('Bad response status: ' + res.status);
		}
		Logger.trace('SearchService.extractSubstancesResult ' + pagedSearch.summariesURL);
		try{
			const pssr :PagedSearchSubstancesResult = new PagedSearchSubstancesResult(pagedSearch, ServerJSON.substancesResult(res.json())),
				sr :SubstancesResult = pssr.substancesResult;
			Logger.info('SearchService.extractSubstancesResult ' + pagedSearch.summariesURL + (sr.end ? ' ' + sr.start + '-' + sr.end : ''), pssr.substancesResult.total);
			return this.mergeAndCacheSubstancesResult(pssr);
		}catch (err){
			Logger.error('SearchService.extractSubstancesResult ', err, res.text());
			this.throwError(res);
		}
	}
	private finishSummariesResults(pssr :PagedSearchSubstancesResult) :void {
			LocalStorageService.setObject(this.getUrlKey(pssr.pagedSearch.summariesURL), pssr.substancesResult.serialize(), 20 * 60); // cache for 20 min
			Logger.debug('SearchService.finishSummariesResults -> searchSubstancesResultStream.next', pssr);
			this.pagedSearchSubstancesResultStream.next(pssr);
	}

	private httpIDIKsGetStructures(idiks :IDInchikey[]) :Observable<ReadonlyArray<IDStructure>> {
		Logger.trace('SearchService.httpIDIKsGetStructures idiks=' + idiks.map( (idik :IDInchikey) => idik.id));
		const nonCached :IDInchikey[] = idiks.filter( (idik :IDInchikey) => !this.getCachedStructure(idik)),
			numbers :string[] = nonCached.map( (idik :IDInchikey) => idik.id),
			url :string = 'data/nu/in/' + numbers.join('%7C') + '?data=' + DM[DM.structure];

		return this.httpGetData(url)
				.map( (res :Response) => this.extractStructuresFromIDIKs(nonCached, res) )
				.catch( (err :Response, caught :Observable<ReadonlyArray<IDStructure>>) => this.extractStructuresFromIDIKsOrError(nonCached, err, caught) );
	}
	private extractStructuresFromIDIKsOrError(idiks :IDInchikey[], res :Response, caught :Observable<ReadonlyArray<IDStructure>> ) :Observable<ReadonlyArray<IDStructure>> {
		if ( res.status === 404 ){
			Logger.warn('Search NOT FOUND for idiks=' + idiks.map( (idik :IDInchikey) => idik.id));
			return Observable.of(this.extractStructuresFromIDIKs(idiks, res));
		}
		Logger.error('ERROR - extractStructuresFromIDIKsOrError idiks=' + idiks.map( (idik :IDInchikey) => idik.id));
		this.throwError(res);
	}
	private extractStructuresFromIDIKs(idiks :IDInchikey[], res :Response) :ReadonlyArray<IDStructure> {
		if (res.status !== 200 && res.status !== 404) {
			throw new Error('Bad response status: ' + res.status);
		}
		Logger.debug('SearchService.extractStructuresFromIDIKs ' + idiks.map( (idik :IDInchikey) => idik.id));
		try{
			const sr :SubstancesResult = ServerJSON.substancesResult(res.json()),
				idStructures :IDStructure[] = [];
			sr.substances.forEach( (s :Substance, index :number) => {
				this.cacheStructure(s.idik, s.structure);
				idStructures[index] = new IDStructure(s.id, s.structure);
			});
			Logger.info('SearchService.extractStructuresFromIDIKs', idStructures.length);
			return idStructures;
		}catch (err){
			Logger.error('SearchService.extractStructuresFromIDIKs ', err, res.text());
			this.throwError(res);
		}
	}


	private httpSearchGetValueCounts(searchMut :SearchMut) :Observable<SearchValueCounts> {
		Logger.trace('SearchService.httpSearchGetValueCounts', searchMut);
		return this.httpGetData(searchMut.acURL)
				.map( (res :Response) => this.extractSearchValueCounts(searchMut, res) )
				.catch( (err :Response, caught :Observable<SearchValueCounts>) => this.extractSearchValueCountsOrError(searchMut, err, caught) );
	}
	private extractSearchValueCountsOrError(searchMut :SearchMut, res :Response, caught :Observable<SearchValueCounts> ) :Observable<SearchValueCounts> {
		if ( res.status === 404 ){
			Logger.warn('Search NOT FOUND for ' + searchMut.acURL);
			return Observable.of(this.extractSearchValueCounts(searchMut, res));
		}
		Logger.error('ERROR - extractSearchValueCountsOrError ' + searchMut.acURL);
		this.throwError(res);
	}
	private extractSearchValueCounts(searchMut :SearchMut, res :Response) :SearchValueCounts {
		if (res.status !== 200 && res.status !== 404) {
			throw new Error('Bad response status: ' + res.status);
		}
		Logger.trace('SearchService.extractSearchValueCounts ' + searchMut.acURL);
		try{
			const vcr :ValueCountsResult = ServerJSON.valueCountsResult(res.json()),
				svc :SearchValueCounts = {'search':searchMut, 'vcr':vcr};
			if(vcr.totals.foundMatch){
				this.cacheVCR(svc);
			}
			Logger.info('SearchService.extractSearchValueCounts ' + searchMut.acURL, vcr.totals);
			return svc;
		}catch (err){
			Logger.error('SearchService.extractSearchValueCounts ', err, res.text());
			this.throwError(res);
		}
	}

	private extractTypes(res :Response) :Type[] {
		if (res.status !== 200) {
			throw new Error('Bad response status: ' + res.status);
		}
		Logger.trace('SearchService.extractTypes');
		const types :Type[] = ServerJSON.types(res.json());
		this.cacheTypes(types);
		Logger.info('SearchService.extractTypes', types.length);
		return types;
	}
	private extractSources(res :Response) :Source[] {
		if (res.status !== 200) {
			throw new Error('Bad response status: ' + res.status);
		}
		Logger.trace('SearchService.extractSources');
		const sources :Source[] = ServerJSON.sources(res.json());
		this.cacheSources(sources);
		Logger.info('SearchService.extractSources', sources.length);
		return sources;
	}

	private httpGetData(url :string) :Observable<Response> {
		Logger.trace('HTTP getting ' + url);
		return this.http.get(this.env.apiURL + url);
	}
	private throwError(res :Response) :void {
		try{
			throw new Error ('ERROR: ' + res.text());
		}catch(e){
			throw new Error ('ERROR: ' + res);
		}
	}


// Caching
	/* tslint:disable:member-ordering */

	getCachedSearchEvents() :SearchEvent[] {
		Logger.trace('SearchService.getCachedSearchEvents');
		return SearchEvent.deserializeArray(LocalStorageService.getObject('h'));
	}
	cacheSearchEvents(searchEvents :ReadonlyArray<SearchEvent>) :void {
		Logger.trace('SearchService.cacheSearchEvents');
		LocalStorageService.setObject('h', SearchEvent.serializeArray(searchEvents));
	}
	getCachedTotals(search :Search) :Totals {
		Logger.trace('SearchService.getCachedTotals');
		return Totals.deserialize(LocalStorageService.getObject(this.getUrlKey(search.totalsURL)));
	}
	private cacheTotals(search :Search, totals :Totals) :void {
		Logger.trace('SearchService.cacheTotals');
		LocalStorageService.setObject(this.getUrlKey(search.totalsURL), totals.serialize(), 24 * 60 * 60); // cache for a day
	}

	private getCachedSubstancesResult(pagedSearch :PagedSearch) :SubstancesResult {
		Logger.trace('SearchService.getCachedSubstancesResult', pagedSearch);
		const sr :SubstancesResult = SubstancesResult.deserialize(LocalStorageService.getObject(this.getUrlKey(pagedSearch.summariesURL)));
		let substances :Substance[];
		if(sr && sr.idSimilarities){
			Logger.log('SearchService.getCachedSubstancesResult sr=', sr);
			substances = [];
			sr.idSimilarities.forEach( (ids :IDSimilarity, index :number) => {
				const substance :Substance = this.getCachedSubstance(ids.id);
				if(substance){
					substances[index] = substance;
				}else{
					Logger.error('ERROR - the substance ' + ids.id + ' at index=', index, ' with start=', sr.start, 'was not in local storage');
				}
			});
			return new SubstancesResult(sr.total, sr.idSimilarities, sr.start, sr.end, substances);
		}
	}
	private mergeAndCacheSubstancesResult(pssr :PagedSearchSubstancesResult) :PagedSearchSubstancesResult {
		const sr :SubstancesResult = pssr.substancesResult;
		if(sr){
			Logger.trace('SearchService.mergeAndCacheSubstancesResult', sr.total, sr.start, sr.idSimilarities && sr.idSimilarities.length, sr.substances && sr.substances.length);
			let substances :Substance[];
			if(sr.substances){
				substances = [];
				sr.substances.forEach( (substance :Substance, index :number) => substances[index] = this.mergeAndRecacheSubstance(substance) );
			}
			return { pagedSearch:pssr.pagedSearch, substancesResult:new SubstancesResult(sr.total, sr.idSimilarities, sr.start, sr.end, substances) };
		}
	}

	private mergeAndRecacheSubstance(substance :Substance) :Substance {
		if(substance){
			Logger.trace('SearchService.mergeAndRecacheSubstance');
			substance = substance.mergeMissing(this.getCachedSubstance(substance.id));
			this.cacheSubstance(substance);
			return substance;
		}
	}
	private getCachedSubstance(id :string) :Substance {
		const substance :Substance = Substance.deserialize(LocalStorageService.getObject(this.substanceKey(id)));
/*		if(substance){
			return substance.mergeMissingStructure(this.getCachedStructure(substance.idik));
		}
*/
		return substance;
	}
	private cacheSubstance(substance :Substance) :void {
		if(substance){
			LocalStorageService.setObject(this.substanceKey(substance.id), substance.serialize(), 24 * 60 * 60); // cache for a day
/*			this.cacheStructure(substance.idik, substance.structure);	*/
		}
	}
	private getCachedStructure(idik :IDInchikey) :Structure {
		return Structure.deserialize(LocalStorageService.getObject(this.structureKey(idik)));
	}
	private cacheStructure(idik :IDInchikey, structure :Structure) :void {
		if(structure){
			LocalStorageService.setObject(this.structureKey(idik), structure.serialize(), this.structureExpiresSeconds(idik));
		}
	}

	getCachedVCR(search :SearchMut, length :number) :ValueCountsResult {
		return ValueCountsResult.deserialize(LocalStorageService.getObject(this.getUrlKey(search.acURL, length)));
	}
	private cacheVCR(svc :SearchValueCounts) :void {
		LocalStorageService.setObject(this.getUrlKey(svc.search.acURL), svc.vcr.serialize(svc.vcr.expression && (svc.search.acURL !== svc.vcr.expression.url)), 24 * 60 * 60); // cache for a day
	}

	private getCachedTypes() :Type[] {
		return Type.deserializeArray(LocalStorageService.getObject('types'));
	}
	private cacheTypes(types :Type[]) :void {
		LocalStorageService.setObject('types', Type.serializeArray(types), 24 * 60 * 60); // cache for a day
	}

	private getCachedSources() :Source[] {
		return Source.deserializeArray(LocalStorageService.getObject('sources'));
	}
	private cacheSources(sources :Source[]) :void {
		LocalStorageService.setObject('sources', Source.serializeArray(sources), 24 * 60 * 60); // cache for a day
	}

	getUrlKey(url :string, length ? :number) :string {
		url = decodeURI(url).replace(/data\//, '').replace(/&singleSummaryToDetails=[^&]+/, '').replace(/&testFirst=.+$/, '').toLowerCase();
		if(length){
			const match :RegExpMatchArray = url.match('(.*/[^/]{' + length + '})[^/]+(\\?.*)');
			if(match){
				url = match[1] + match[2];
			}
		}
		return url.replace(/%2f/g, '/').replace(/%5c/g, '\\').replace(/%2b/g, '+');
	}
	private substanceKey(id :string) :string {
		return 'sub' + id;
	}
	private structureKey(idik :IDInchikey) :string {
		return 'str' + (idik.inchikey || idik.id);
	}
	private structureExpiresSeconds(idik :IDInchikey) :number {
		let expiresSeconds :number = 24 * 60 * 60;
		if(idik.inchikey){
			expiresSeconds *= 30;
		}
		return expiresSeconds;
	}
	/*tslint:enable:member-ordering */

}
