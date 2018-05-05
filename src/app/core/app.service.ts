import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { DM } from './../domain/data-mode';
import { Expression } from './../domain/expression';
import { Fmt } from './../domain/format';
import { Paging } from './../domain/paging';
import { Preferences, PreferencesMinJSON } from './../domain/preferences';
import { RM } from './../domain/result-mode';
import { Search } from './../domain/search';
import { SearchEvent } from './../domain/search-event';
import { SearchTotals } from './../domain/search-totals';
import { Srt, OrderBy } from './../domain/sort';
import { Source } from './../domain/source';
import { Totals } from './../domain/totals';
import { Type } from './../domain/type';

import { LocalStorageService, Expires } from './local-storage.service';
import { SearchService } from './search.service';

import { Logger } from './logger';

@Injectable()
export class AppService {
	routingSessionSearch :boolean;
	routingSubstanceInSearch :boolean;
	substanceInResults :boolean;

	readonly currentSearchTotalsStream :BehaviorSubject<SearchTotals> = new BehaviorSubject( new SearchTotals(Search.EMPTY_SEARCH) );

	private readonly searchTotalsMap :Map<string, SearchTotals> = new Map();

	private preferences :Preferences = this.cachedPreferences || new Preferences();

	private _search :Search;
	private _searchForEdit :Search;
	private _expressionForEdit :Expression;
	private _sessionSearch :Search;
	private _orderBy :OrderBy;
	private _paging :Paging;
	private _searchHistory :SearchEvent[];

	constructor(readonly router :Router, readonly searchService :SearchService){
		Logger.debug('AppService.constructor');
		this.search = this.currentSearchTotalsStream.value.search;
		this.searchService.oSearchTotals.subscribe( (searchTotals :SearchTotals) => this.setSearchTotals(searchTotals));
	}

	set search(search :Search) {
		Logger.trace('AppService.search setter'/*, search*/);
		if(!search || search === Search.EMPTY_SEARCH){
			Logger.log('AppService.search setter !search');
			this._search = search;
		}else{
			Logger.log('AppService.search setter'/*, search*/);
			const searchTotals :SearchTotals = this.getSearchTotals(search.url);
			this._search = (searchTotals && searchTotals.search) || search;
			this.afterSearchSet(this._search);
		}
	}
	get search() :Search {
		Logger.trace('AppService.search');
		return this._search;
	}
	set sessionSearch(search :Search) {
		Logger.log('AppService.sessionSearch setter', search);
		this._sessionSearch = search;
		this._orderBy = new OrderBy(search.hasOneSimilarity ? Srt.similarity : this.srt);
		this.setDefaultPaging();
	}
	get sessionSearch() :Search {
		Logger.trace('AppService.sessionSearch');
		return this._sessionSearch;
	}
	set orderBy(orderBy :OrderBy){
		Logger.log('AppService.orderBy setter', orderBy);
		this._orderBy = orderBy;
	}
	get orderBy() :OrderBy {
		Logger.trace('AppService.orderBy');
		return this._orderBy;
	}
	set paging(paging :Paging){
		Logger.log('AppService.paging setter', paging);
		this._paging = paging;
	}
	get paging() :Paging {
		Logger.trace('AppService.paging');
		return this._paging;
	}
	get searchHistory() :ReadonlyArray<SearchEvent> {
		Logger.trace('AppService.searchHistory');
		return this.privateSearchHistory;
	}
	private get privateSearchHistory() :SearchEvent[] {
		Logger.trace('AppService.privateSearchHistory');
		if(!this._searchHistory){
			this.setSearchHistory();
		}
		return this._searchHistory;
	}

	set searchForEdit(searchForEdit :Search) {
		Logger.debug('AppService.searchForEdit setter', searchForEdit);
		const searchTotals :SearchTotals = searchForEdit && this.getSearchTotals(searchForEdit.url);
		this._searchForEdit = (searchTotals && searchTotals.search) || searchForEdit;
		if(searchForEdit){
			this.afterSearchSet(this._searchForEdit);
		}
	}
	get searchForEdit() :Search {
		Logger.trace('AppService.searchForEdit');
		if(!this._searchForEdit){
			this.searchForEdit = this._sessionSearch || Search.EMPTY_SEARCH;
		}
		return this._searchForEdit;
	}

	set expressionForEdit(expressionForEdit :Expression) {
		Logger.log('AppService.expressionForEdit setter');
		this._expressionForEdit = expressionForEdit;
	}
	get expressionForEdit() :Expression {
		Logger.trace('AppService.expressionForEdit');
		return this._expressionForEdit;
	}

	get oCurrentSearchTotals() :Observable<SearchTotals> {
		Logger.trace('AppService.oCurrentSearchTotals');
		return this.currentSearchTotalsStream.asObservable();
	}

	setPreferences(preferences :Preferences) :void {
		Logger.log('AppService.setPreferences');
		this.preferences = preferences || new Preferences();
		this.setDefaultPaging();
		this.cachePreferences();
	}
	set maxResultPageRows(n :number){
		Logger.log('AppService.maxResultPageRows setter');
		this.preferences.maxResultPageRows = n;
		this.setDefaultPaging();
		this.cachePreferences();
	}
	get maxResultPageRows() :number {
		Logger.trace('AppService.maxResultPageRows');
		return this.preferences.maxResultPageRows;
	}

	set maxAutoCompleteRows(n :number){
		Logger.log('AppService.maxAutoCompleteRows setter');
		this.preferences.maxAutoCompleteRows = n;
		this.cachePreferences();
	}
	get maxAutoCompleteRows() :number {
		Logger.trace('AppService.maxAutoCompleteRows');
		return this.preferences.maxAutoCompleteRows;
	}

	set useFieldOperatorAbbreviations(b :boolean){
		Logger.log('AppService.useFieldOperatorAbbreviations setter');
		this.preferences.useFieldOperatorAbbreviations = b;
		this.cachePreferences();
	}
	get useFieldOperatorAbbreviations() :boolean {
		Logger.trace('AppService.useFieldOperatorAbbreviations');
		return this.preferences.useFieldOperatorAbbreviations;
	}

	set rm(r :RM){
		Logger.log('AppService.rm setter');
		this.preferences.rm = r;
		this.cachePreferences();
	}
	get rm() :RM {
		Logger.trace('AppService.rm');
		return this.preferences.rm;
	}

	set simPercent(simPercent :number){
		Logger.log('AppService.simPercent setter');
		this.preferences.simPercent = simPercent;
		this.cachePreferences();
	}
	get simPercent() :number {
		Logger.trace('AppService.simPercent');
		return this.preferences.simPercent;
	}
	set viewStructures(viewStructures :boolean){
		Logger.log('AppService.viewStructures setter');
		this.preferences.viewStructures = viewStructures;
		this.cachePreferences();
	}
	get viewStructures() :boolean {
		Logger.trace('AppService.viewStructures');
		return this.preferences.viewStructures;
	}
	set srt(srt :Srt){
		Logger.log('AppService.srt setter');
		this.preferences.srt = srt;
		this.cachePreferences();
	}
	get srt() :Srt {
		Logger.trace('AppService.srt');
		return this.preferences.srt;
	}
	set dm(dm :DM){
		Logger.log('AppService.dm setter');
		this.preferences.dm = dm;
		this.cachePreferences();
	}
	get dm() :DM {
		Logger.trace('AppService.dm');
		return this.preferences.dm;
	}
	set fmt(fmt :Fmt){
		Logger.log('AppService.fmt setter');
		this.preferences.fmt = fmt;
		this.cachePreferences();
	}
	get fmt() :Fmt {
		Logger.trace('AppService.fmt');
		return this.preferences.fmt;
	}

	afterSearchSet(search :Search) :void {
		const searchTotals :SearchTotals = search && this.getSearchTotals(search.url);
		if(searchTotals){
			Logger.log('AppService.afterSearchSet FOUND searchTotals for', search, ' -> currentSearchTotalsStream.next');
			this.currentSearchTotalsStream.next(searchTotals);
		}else{
			Logger.log('AppService.afterSearchSet -> currentSearchTotalsStream.next without totals'/*, search*/);
			this.currentSearchTotalsStream.next(new SearchTotals(search));
			if(search && search.hasNonNot){
				Logger.log('AppService.afterSearchSet -> searchService.nextTotalsSearch');
				this.searchService.nextTotalsSearch = search;
				// On completion, this will call setSearchTotals below where !oldSearchTotals
			}
		}
	}
	/* tslint:disable-next-line:cyclomatic-complexity */
	setSearchTotals(searchTotals :SearchTotals) :void {
		Logger.trace2('AppService.setSearchTotals');
		const searchURL :string = searchTotals.search.url;
		Logger.trace('AppService.setSearchTotals', searchURL);
		const newTotals :Totals = searchTotals.totals,
			oldSearchTotals :SearchTotals = this.getSearchTotals(searchURL),
			oldTotals :Totals = oldSearchTotals && oldSearchTotals.totals;
		Logger.log('AppService.setSearchTotals', searchURL, searchTotals, newTotals, oldSearchTotals, oldTotals);
		if(oldTotals && oldTotals.substances === newTotals.substances && oldTotals.values === newTotals.values){
			Logger.log('AppService.setSearchTotals ALREADY set', searchURL, newTotals);
		}else{
			if(!oldSearchTotals){
				Logger.log('AppService.setSearchTotals no old to merge', searchURL, newTotals);
			}else{
				const newSubstances :number = newTotals.substances,
					newValues :number = newTotals.values,
					mergedTotals :Totals = new Totals(newSubstances === undefined || newSubstances === -1 ? oldTotals.substances : newSubstances, newValues === undefined || newValues === -1 ? oldTotals.values : newValues);
				Logger.log('AppService.setSearchTotals MERGING', oldTotals, 'WITH', newTotals, 'INTO', mergedTotals);
				/* tslint:disable-next-line:no-parameter-reassignment */
				searchTotals = new SearchTotals(oldSearchTotals.search, mergedTotals);
			}
			Logger.log('AppService.setSearchTotals setting', searchURL, searchTotals);
			this.searchTotalsMap.set(searchURL, searchTotals);
			const isSearchForEdit :boolean = this._searchForEdit && this._searchForEdit.url === searchURL,
				isSearch :boolean = this._search && this._search.url === searchURL,
				isSessionSearch :boolean = this._sessionSearch && this._sessionSearch.url === searchURL;
			Logger.trace('AppService.setSearchTotals isSearch*', this._searchForEdit, isSearchForEdit, isSearch, isSessionSearch);
			if(isSearchForEdit && this._searchForEdit !== searchTotals.search){
				Logger.debug('AppService.setSearchTotals RESET this._searchForEdit');
				this.searchForEdit = searchTotals.search;
			}
			if(isSearch && this._search !== searchTotals.search){
				Logger.debug('AppService.setSearchTotals RESET this._search');
				this.search = searchTotals.search;
			}
			if(isSessionSearch && this._sessionSearch !== searchTotals.search){
				Logger.debug('AppService.setSearchTotals RESET this._sessionSearch');
				this.sessionSearch = searchTotals.search;
			}
			if(isSearchForEdit || (!this._searchForEdit && (isSearch || isSessionSearch))){
				Logger.log('AppService.setSearchTotals -> currentSearchTotalsStream.next');
				this.currentSearchTotalsStream.next(searchTotals);
			}
		}
		if(searchURL === (this._sessionSearch && this._sessionSearch.url) && searchTotals.valid){
			Logger.log('AppService.onNewSearchTotals for sessionSearch -> searchService.addSearchEvent');
			this.updateHistory(searchTotals);
		}
	}
	getSearchTotals(searchURL :string) :SearchTotals {
		Logger.trace('AppService.getSearchTotals for', searchURL);
		return this.searchTotalsMap.get(searchURL);
	}
	setAsSessionSearch_UpdateHistory() :void {
		Logger.debug('AppService.setAsSessionSearch_UpdateHistory', this.search);
		this.sessionSearch = this.search;
		const searchTotals :SearchTotals = this.currentSearchTotalsStream.value;
		if(searchTotals.valid && searchTotals.search.url === this._sessionSearch.url){
			Logger.log('AppService.setAsSessionSearch_UpdateHistory for sessionSearch -> searchService.addSearchEvent');
			this.updateHistory(searchTotals);
		}
	}
	updateHistory(searchTotals :SearchTotals) :void {
		Logger.trace('AppService.updateHistory');
		let newSE :SearchEvent = new SearchEvent(this._sessionSearch, searchTotals.totals, Date.now());
		const searchHistory :SearchEvent[] = this.privateSearchHistory,
			iOldSE :number = searchHistory && searchHistory.findIndex( (se :SearchEvent) => se.search.url === newSE.search.url && se.totals.substances === newSE.totals.substances ),
			oldSE :SearchEvent = iOldSE >= 0 && searchHistory[iOldSE];
		if(oldSE){
			Logger.debug('AppService.updateHistory merging', oldSE, newSE);
			newSE = new SearchEvent(oldSE.search, oldSE.totals, oldSE.millisSinceFirstRun, newSE.millisSinceFirstRun);
			searchHistory.splice(iOldSE, 1);
		}
		searchHistory.unshift(newSE);
		// ToDo - auto remove older than X days (local storage setting) searches.
		SearchService.cacheSearchEvents(searchHistory);
	}
	deleteFromHistory(deleteSE :SearchEvent) :ReadonlyArray<SearchEvent> {
		Logger.debug('AppService.deleteFromHistory', deleteSE);
		const searchHistory :SearchEvent[] = this.privateSearchHistory,
			iOldSE :number = searchHistory && searchHistory.findIndex( (se :SearchEvent) => se.search.url === deleteSE.search.url && se.totals.substances === deleteSE.totals.substances );
		if(iOldSE >= 0){
			searchHistory.splice(iOldSE, 1);
		}
		SearchService.cacheSearchEvents(searchHistory);
		return searchHistory;
	}


	initTypes() :void {
		Logger.trace('AppService.initTypes');
		if(!Type.initialized){
			this.searchService.oTypes.subscribe( (types :Type[]) => Logger.trace('AppService.initTypes fetched ' + types.length));
		}
	}
	initSources() :void {
		Logger.trace('AppService.initSources');
		if(!Source.initialized){
			this.searchService.oSources.subscribe( (sources :Source[]) => Logger.trace('AppService.initSources fetched ' + sources.length));
		}

	}

	navToResults(search ? :Search) :void {
		Logger.log('AppService.navToResults', search);
		if(search || this.currentSearchTotalsStream.value.valid){
			this.routingSessionSearch = true;
			if(search){
				this.search = search;
				this.setAsSessionSearch_UpdateHistory();
			}else if(this._searchForEdit){
				this.search = this._searchForEdit;
				this.searchForEdit = undefined;
				this.setAsSessionSearch_UpdateHistory();
			}else{
				this.search = this._sessionSearch;
			}
			if(this.search.exp){
				const routerLinkParams :ReadonlyArray<string> = this.useFieldOperatorAbbreviations ? this.search.routerLinkParams : this.search.routerLinkParamsNoAbbr,
					linkParamArray :string[] = ['/results', ...routerLinkParams];
				Logger.info('AppService.navToResults linkParamArray=', linkParamArray);
				this.router.navigate(linkParamArray);
			}else{
				const routerQueryParams :Params = this.useFieldOperatorAbbreviations ? this.search.routerQueryParams : this.search.routerQueryParamsNoAbbr;
				Logger.info('AppService.navToResults routerQueryParams=', routerQueryParams);
				this.router.navigate(['/results', routerQueryParams]);
			}
		}
	}

	private setDefaultPaging() :void {
		this._paging = new Paging(1, this.maxResultPageRows);
	}

	private setSearchHistory() :void {
		Logger.debug('AppService.setSearchHistory');
		this._searchHistory = SearchService.getCachedSearchEvents() || [];
	}

	private cachePreferences() :void {
		Logger.log('AppService.cachePreferences');
		const pmj :PreferencesMinJSON = this.preferences.serialize();
		if(pmj){
			LocalStorageService.setObject('preferences', pmj, Expires.YEARS);
		}else{
			LocalStorageService.removeItem('preferences');
		}
	}
	private get cachedPreferences() :Preferences {
		Logger.trace('AppService.cachedPreferences');
		return Preferences.deserialize(LocalStorageService.getObject('preferences'));
	}

}
