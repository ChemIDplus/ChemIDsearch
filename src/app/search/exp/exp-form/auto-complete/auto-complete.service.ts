import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AutoCompleteResult } from './../../../../domain/auto-complete-result';
import { DataCount, DataCountGroup } from './../../../../domain/data-count';
import { ExpressionMut } from './../../../../domain/expression';
import { Fld } from './../../../../domain/field';
import { Search, SearchMut } from './../../../../domain/search';
import { SearchTotals } from './../../../../domain/search-totals';
import { Totals } from './../../../../domain/totals';
import { SearchValueCounts, ValueCountsResult } from './../../../../domain/value-counts-result';

import { AppService } from './../../../../core/app.service';
import { LocalStorageService, Expires } from './../../../../core/local-storage.service';
import { SearchService } from './../../../../core/search.service';

import { Logger } from './../../../../core/logger';

interface CountKeyValues{
	count :number;
	key :string;
	dcArray :DataCount[];
}

@Injectable()
export class AutoCompleteService {

	private static filterVC(vcr :ValueCountsResult, value :string) :ValueCountsResult {
		const valueUpper :string = value.toUpperCase();
		let resultsSize :number = vcr.results ? vcr.results.length : 0,
			results :DataCount[];
		Logger.trace('AutoCompleteService.filterVC valueUpper=' + valueUpper + ' vcr.expression.value.toUpperCase()=' + vcr.expression.value.toUpperCase());
		if(valueUpper !== vcr.expression.value.toUpperCase()){
			Logger.trace('AutoCompleteService.filterVC: ' + resultsSize + ' for ' + vcr.expression.value);
			if(resultsSize > 0){
				results = [];
				vcr.results.forEach( (dc :DataCount) => {
					if(dc.data.toUpperCase().startsWith(valueUpper)){
						results.push(dc);
					}
				});
				resultsSize = results.length;
				Logger.trace('AutoCompleteService.filterVC: ' + resultsSize + ' for ' + value);
				if(resultsSize === 0){
					return undefined;
				}
				vcr.totals = new Totals(-1, results.length);
				vcr.results = results;
				vcr.expression.value = value;
			}
		}
		return vcr;
	}


	private currentExp :ExpressionMut;
	private acExp :ExpressionMut;


	private readonly acStream :Subject<AutoCompleteResult> = new Subject<AutoCompleteResult>();

	constructor(readonly app :AppService, readonly searchService :SearchService){}

	get ACRs() :Observable<AutoCompleteResult>{
		Logger.trace('AutoCompleteService.ACRs');
		return this.acStream.asObservable();
	}
	set acrNext(acr :AutoCompleteResult) {
		Logger.log('AutoCompleteService.acrNext', acr);
		this.acStream.next(acr);
	}

	newAutoComplete(exp :ExpressionMut) :void {
		if(!exp.usesAC){
			return;
		}
		this.currentExp = exp;
		const search :SearchMut = new SearchMut([exp]);
		this.acExp = search.acExp;
		Logger.log('AutoCompleteService.newAutoComplete acExp =', this.acExp, ' from current exp =', exp);
		const acr :AutoCompleteResult = this.cachedACR;
		if(acr){
			if(!acr.expression){
				acr.expression = this.acExp;
			}
			this.acrNext = acr;
			return;
		}

		const acExpValue :string = this.acExp.value;
		let vcr :ValueCountsResult,
			length :number = acExpValue.length;
		while(length >= 3){
			vcr = SearchService.getCachedVCR(search, length);
			if(vcr){
				Logger.log('AutoCompleteService.newAutoComplete found vcr in storage' + ( vcr.expression ? ' vcr.expression=' + vcr.expression.url : ''));
				if(this.testVCtoAC({'search':search, 'vcr':vcr}, acExpValue.substr(0, length))){
					return;
				}else{
					break;
				}
			}
			--length;
		}
		Logger.log('AutoCompleteService.newAutoComplete -> searchService.nextValueCountsSearch=' + search.acURL);
		this.searchService.nextValueCountsSearch = search;
	}
	fetchTotals(exp :ExpressionMut) :void {
		Logger.log('AutoCompleteService.fetchTotals for ', exp);
		if(!exp.usesAC){
			Logger.trace('AutoCompleteService.fetchTotals exit 1 !exp.usesAC');
			return;
		}
		Logger.trace('AutoCompleteService.fetchTotals calling immutable()');
		this.searchService.nextTotalsSearch = new Search([this.acExp.immutable()]);
	}

	onNewSearchTotals(searchTotals :SearchTotals) :void {
		Logger.log('AutoCompleteService.onNewSearchTotals', searchTotals);
		const searchMut :SearchMut = searchTotals.search.mutable();
		if(!searchMut.acURL){
			Logger.log('AutoCompleteService.onNewSearchTotals new search does not allow autocomplete');
			return;
		}
		if(this.totalsComplete){
			Logger.trace('AutoCompleteService.onNewSearchTotals totalsComplete, ignoring new searchTotals');
			return;
		}
		if(!this.testSearchedCurrentAcValue(searchMut)){
			return;
		}
		const acr :AutoCompleteResult = this.currentExp.ac;
		if(acr){
			acr.totals = searchTotals.totals;
			this.cacheACR(acr);
		}
	}
	onNewSVC(svc :SearchValueCounts) :void {
		Logger.trace('AutoCompleteService.onNewSVC');
		if(this.totalsComplete){
			Logger.trace('AutoCompleteService.onNewSVC totalsComplete, ignoring new vcr');
			return;
		}
		if(!this.testSearchedCurrentAcValue(svc.search)){
			return;
		}
		this.testVCtoAC(svc, svc.search.acExp.value);
	}

	private get totalsComplete() :boolean {
		Logger.trace('AutoCompleteService.totalsComplete');
		return this.currentExp.ac && this.currentExp.ac.totalsComplete;
	}

	private testSearchedCurrentAcValue(search :SearchMut) :boolean {
		if(this.currentExp.ac && this.acExp.value.length !== search.acExp.value.length){
			Logger.trace('AutoCompleteService.testSearchedCurrentAcValue incomplete ac already exists, ignoring new search results');
			return undefined;
		}
		Logger.log('AutoCompleteService.testSearchedCurrentAcValue search.acExp.value=' + search.acExp.value + ' this.acExp.value=' + this.acExp.value);
		return true;
	}
	private testVCtoAC(svc :SearchValueCounts, testValue :string) :boolean {
		let vcr :ValueCountsResult = svc.vcr,
			acr :AutoCompleteResult;
		Logger.trace('AutoCompleteService.testVCtoAC svc.search.acURL=' + svc.search.acURL + ' testValue=' + testValue);
		if(!this.acExp.value || !this.acExp.value.startsWith(testValue)){
			Logger.log('AutoCompleteService.testVCtoAC current expression ac value does not start with test value. Ignoring');
			return false;
		}
		if(!vcr.expression){
			vcr.expression = svc.search.acExp.clone;
			vcr.expression.value = testValue;
		}
		if(testValue.length < this.acExp.value.length && vcr.results){
			Logger.log('AutoCompleteService.testVCtoAC filtering value from ' + testValue + ' to ' + this.acExp.value);
			vcr = AutoCompleteService.filterVC(vcr, this.acExp.value);
		}
		if(vcr){
			acr = this.mergeVCtoAC(vcr);
		}
		if(!acr){
			Logger.trace('AutoCompleteService.testVCtoAC stored value did not find a result.');
			if(this.currentExp.fld !== Fld.auto && this.currentExp.fld !== Fld.name){
				Logger.trace('AutoCompleteService.testVCtoAC Not a spellcheck, return empty ac');
				acr = new AutoCompleteResult(new Totals(0, 0), this.currentExp, undefined, undefined);
			}else{
				return false;
			}
		}
		Logger.debug('AutoCompleteService.testVCtoAC -> acStream.next: acr.totals =', acr.totals);
		this.acrNext = acr;
		return true;
	}

	private mergeVCtoAC(vcr :ValueCountsResult) :AutoCompleteResult {
		Logger.trace('AutoCompleteService.mergeVCtoAC');
		const acr :AutoCompleteResult = new AutoCompleteResult(vcr.totals, vcr.expression, vcr.results, vcr.alternatives);
		let resultsSize :number = acr.results ? acr.results.length : 0,
			resultsToProcess :DataCount[];
		Logger.log('AutoCompleteService.mergeVCtoAC: ' + resultsSize + ' for ' + acr.expression.value);
		if(resultsSize > 0){
			resultsToProcess = acr.results.slice();
		}
		if(resultsSize > this.app.maxAutoCompleteRows){
			const value :string = acr.expression.value,
				singleResults :DataCount[] = [];
			let map1 :{ [key :string] :DataCount[]},
				map1Length :number,
				map :{ [key :string] :DataCount[]},
				subLength :number = value.length,
				key :string,
				foundAbbreviatedKey :boolean,
				subs :DataCount[];
			do{
				map1 = {};
				singleResults.forEach( (dc :DataCount) => {
					map1[dc.data] = [dc];
				} );
				map1Length = singleResults.length;
				++subLength;
				foundAbbreviatedKey = false;
				/* tslint:disable-next-line:prefer-const */
				for(let dc of resultsToProcess){
					const dcd :string = dc.data;
					key = dcd.substring(0, Math.min(dcd.length, subLength)).toUpperCase();
					foundAbbreviatedKey = foundAbbreviatedKey || dcd.length > subLength;
					Logger.trace2('AutoCompleteService.mergeVCtoAC subLength=' + subLength + ' key=' + key + ' dcd=' + dcd);
					subs = map1[key];
					if(subs === undefined){
						subs = [];
						map1[key] = subs;
						++map1Length;
						Logger.trace2('AutoCompleteService.mergeVCtoAC map1Length=' + map1Length + '; key=' + key);
					}
					subs.push(dc);
					Logger.trace2('AutoCompleteService.mergeVCtoAC ' + key + ' has ' + subs.length);
				}
				if(map1Length <= this.app.maxAutoCompleteRows){
					if(map1Length > 1){
						Logger.trace('AutoCompleteService.mergeVCtoAC setting map: subLength=' + subLength + ' map1Length=' + map1Length);
						map = map1;
					}
				}else if(map === undefined){
					// This will go over the limit, but there is nothing less with any variety
					Logger.trace('AutoCompleteService.mergeVCtoAC setting map due to initial over limit. subLength=' + subLength + ' map1Length=' + map1Length);
					map = map1;
				}else{
					Logger.log('AutoCompleteService.mergeVCtoAC NOT setting map: subLength=' + subLength + ' map1Length=' + map1Length);
					break;
				}
				if(map !== undefined){
					Object.keys(map).forEach( (key2 :string) => {
						Logger.trace2('AutoCompleteService.mergeVCtoAC key2=' + key2 + ' map[key2].length=' + map[key2].length);
						if(map[key2].length === 1){
							const dc :DataCount = map[key2][0],
								i :number = resultsToProcess.indexOf(dc);
							if(i >= 0){
								resultsToProcess.splice(i, 1);
								singleResults.push(dc);
								Logger.trace('AutoCompleteService.mergeVCtoAC no longer processing ' + dc.data);
								/* tslint:disable-next-line:no-dynamic-delete */
								delete map[key2];
								map[dc.data] = [dc];
							}
						}
					} );
				}
			}while(foundAbbreviatedKey);
			resultsSize = Object.keys(map).length;
			Logger.log('AutoCompleteService.mergeVCtoAC COMPLETED LOOP 1, resultsSize=' + resultsSize);
			const countKeyValuesArray :CountKeyValues[] = [];
			let dcArray :DataCount[];
			/* tslint:disable-next-line:prefer-const */
			for(let k in map){
				if(map.hasOwnProperty(k)){
					dcArray = map[k];
					countKeyValuesArray.push({'count':dcArray.length, 'dcArray':dcArray, 'key':k});
				}
			}
			countKeyValuesArray.sort((a :CountKeyValues, b :CountKeyValues) => a.count - b.count);
			countKeyValuesArray.forEach((ckv :CountKeyValues, index :number) => Logger.trace2(index, ckv));

			const results2 :DataCount[] = [];
			let withListValues :number;
			countKeyValuesArray.forEach( (ckv :CountKeyValues) => {
				withListValues = resultsSize - 1 + ckv.count;
				if(withListValues <= this.app.maxAutoCompleteRows){
					ckv.dcArray.forEach( (ds :DataCount) => {
						results2.push(ds);
					});
					resultsSize = withListValues;
				}else{
					results2.push(new DataCountGroup(ckv.key, ckv.dcArray.length));
				}
			});

			results2.sort( (a :DataCount, b :DataCount) => {
				if(a.data.toUpperCase() > b.data.toUpperCase()){
					return 1;
				}else if(a.data.toUpperCase() < b.data.toUpperCase()){
					return -1;
				}else{
					return 0;
				}
			});
			acr.results = results2;
		}
		if(!acr.totalsComplete){
			Logger.trace('AutoCompleteService.mergeVCtoAC !acr.totalsComplete calling immutable()');
			const totals :Totals = SearchService.getCachedTotals(new Search([acr.expression.autocomplete.immutable()]));
			if(totals){
				Logger.trace('AutoCompleteService.mergeVCtoAC found totals in storage');
				acr.totals = totals;
			}else{
				Logger.trace('AutoCompleteService.mergeVCtoAC !ac.areTotalsComplete()');
			}
		}
		this.cacheACR(acr);
		return acr;
	}

	private cacheACR(acr :AutoCompleteResult) :void {
		Logger.log('AutoCompleteService.cacheACR');
		LocalStorageService.setObject(this.acKey, acr.serialize(this.acExp.url !== acr.expression.url), Expires.SHORT);
	}
	private get cachedACR() :AutoCompleteResult {
		Logger.trace('AutoCompleteService.cachedACR');
		return AutoCompleteResult.deserialize(LocalStorageService.getObject(this.acKey));
	}
	private get acKey() :string {
		Logger.trace('AutoCompleteService.acKey');
		return 'ac' + this.app.maxAutoCompleteRows + '/' + SearchService.getUrlKey(this.acExp.url);
	}

}
