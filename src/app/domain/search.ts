import { Params } from '@angular/router';

import { DM, DataMode } from './data-mode';
import { Expression, ExpressionMut, ExpressionMinJSON } from './expression';
import { Fld } from './field';
import { Op } from './operator';
import { Totals } from './totals';

import { environment } from '../../environments/environment';

import { Logger } from './../core/logger';

export interface SearchMinJSON {
	e :ExpressionMinJSON[];
}

interface Multi {
	url :string;
	params :Params;
}

/** Immutable */
export class Search {

// Static
	static readonly EMPTY_SEARCH :Search = new Search([]);

	static readonly DATA_PREFIX :string = 'data/';
	static readonly DATA_PARAM :string = '?data=';
	static readonly DATA_MULTI_PREFIX :string = Search.DATA_PREFIX + 'search' + Search.DATA_PARAM;
	static readonly RESULTS_MULTI_PREFIX :string = 'results' + Search.DATA_PARAM;
	static readonly MULTI_SEPARATOR :string = '&exp=';

	/*tslint:disable:no-string-literal */
	static parseParams(params :Params) :Search {
		Logger.log('Search.parseParams', params);
		const fld :string = params['fld'],
			op :string = params['op'],
			ppf :string = params['ppf'],
			tox1 :string = params['tox1'],
			exp1 :string = params['exp1'];
		if(ppf){
			const ppmt :string = params['ppmt'];
			return Search.deserializeURL('pp/' + ppf + (ppmt ? '/' + ppmt : '' ) + '/' + op + '/' + params['value']);
		}else if(tox1){
			const tox2 :string = params['tox2'],
				tox3 :string = params['tox3'],
				tox4 :string = params['tox4'],
				tox5 :string = params['tox5'],
				tox6 :string = params['tox6'];
			return Search.deserializeURL('tox/' + tox1 + (tox2 ? '/' + tox2 + (tox3 ? '/' + tox3 + (tox4 ? '/' + tox4 + (tox5 ? '/' + tox5 + (tox6 ? '/' + tox6 : '' ) : '' ) : '' ) : '' ) : '' ));
		}else if(fld && op){
			return Search.deserializeURL(fld + '/' + op + '/' + params['value'].replace(/%28/, '(').replace(/%29/, ')'));
		}else if(exp1){
			const expUrls :string[] = [];
			let i :number = 1,
				expI :string = exp1;
			while(expI){
				expUrls.push(expI);
				++i;
				expI = params['exp' + i];
			}
			return new Search(expUrls.map( (expURL :string) => Expression.deserializeURL(decodeURIComponent(expURL).replace(/%28/, '(').replace(/%29/, ')'), true)));
		}else{
			return Search.EMPTY_SEARCH;
		}
	}
	/*tslint:enable:no-string-literal */


// Instance
	readonly exps :ReadonlyArray<Expression>;
	readonly exp :Expression;
	readonly url :string;
	readonly routerQueryParams :Params;
	readonly display :string;
	readonly hasNonNot :boolean;
	readonly hasOneSimilarity :boolean;

	/*tslint:disable:variable-name */
	private _urlNoAbbr :string;
	private _routerQueryParamsNoAbbr :Params;
	private _totalsURL :string;
	private _totalsURLNoAbbr :string;
	private _summariesURL :string;
	private _summariesURLNoAbbr :string;
	private _structuresURL :string;
	/*tslint:enable:variable-name */


	constructor(exps :Expression[]){
		this.exps = exps.sort(Expression.compare);
		if(this.exps.length === 1){
			this.exp = this.exps[0];
			this.url = this.exp.url;
		}else if(this.exps.length > 1){
			const multi :Multi = this.getMulti(true);
			this.url = multi.url;
			this.routerQueryParams = multi.params;
		}else{
			this.url = 'EMPTY_SEARCH';
		}

		let display :string = '';
		this.exps.forEach( (exp :Expression) => display += (exp.display + ' & '));
		this.display = display.replace(/ & $/, '');

		/** True if search has at least one expression that is not a NOT */
		this.hasNonNot = !!this.exps.find( (exp :Expression) => !exp.not );

		/** True if search has one and only one expression where the operator is similarity and not a NOT */
		this.hasOneSimilarity = this.exps.filter( (exp :Expression) => exp.isSimilarity() ).length === 1;

		Logger.debug('GENERATED IMMUTABLE SEARCH ' + this.url);
	}

	get urlNoAbbr() :string {
		if(!this._urlNoAbbr){
			if(this.exp){
				this._urlNoAbbr = this.exp.urlNoAbbr;
			}else if(this.exps.length > 1){
				this.setMultiNoAbbr();
			}
		}
		return this._urlNoAbbr;
	}
	get routerQueryParamsNoAbbr() :Params {
		if(this.exps.length > 1){
			if(!this._routerQueryParamsNoAbbr){
				this.setMultiNoAbbr();
			}
			return this._routerQueryParamsNoAbbr;
		}
	}
	get routerLinkParams() :ReadonlyArray<string> {
		if(this.exp){
			return this.exp.routerLinkParams;
		}
	}
	get routerLinkParamsNoAbbr() :ReadonlyArray<string> {
		if(this.exp){
			return this.exp.routerLinkParamsNoAbbr;
		}
	}

	get summariesURL() :string {
		if(!this._summariesURL){
			this._summariesURL = this.getURL(DM.summary, true, true);
		}
		return this._summariesURL;
	}
	get summariesURLNoAbbr() :string {
		if(!this._summariesURLNoAbbr){
			this._summariesURLNoAbbr = this.getURL(DM.summary, false, true);
		}
		return this._summariesURL;
	}
	get structuresURL() :string {
		if(!this._structuresURL){
			this._structuresURL = this.getURL(DM.structure);
		}
		return this._structuresURL;
	}

	get totalsURL() :string {
		if(!this._totalsURL){
			this._totalsURL = this.getURL(DM.totals, true);
		}
		return this._totalsURL;
	}
	get totalsURLNoAbbr() :string {
		if(!this._totalsURLNoAbbr){
			this._totalsURLNoAbbr = this.getURL(DM.totals, false);
		}
		return this._totalsURLNoAbbr;
	}

	mutable() :SearchMut {
		return new SearchMut(this.exps.map( (exp :Expression) => exp.mutable() ));
	}


	plusExpression(exp :Expression) :Search {
		return new Search([...this.exps, exp]);
	}
	minusExpression(exp :Expression) :Search {
		if(this.exp === exp){
			return Search.EMPTY_SEARCH;
		}else{
			return new Search(this.exps.filter( (exp1 :Expression) => exp1 !== exp));
		}
	}


	getURL(dm :DM, useAbbr :boolean = false, singleSummaryToDetails ? :boolean) :string {
		let url :string;
		if(this.exp){
			url = Search.DATA_PREFIX + (useAbbr ? this.url : this.urlNoAbbr) + Search.DATA_PARAM + DM[dm];
		}else{
			url = Search.DATA_MULTI_PREFIX + DM[dm === DM.valueCounts ? DM.details : dm] + (useAbbr ? this.url : this.urlNoAbbr);
		}
		if(singleSummaryToDetails && dm === DM.summary){
			url += '&singleSummaryToDetails=true';

			// Perhaps we should add more parameter logic and not slip this in here? For now, this is when we use this.
			if(this.hasOneSimilarity){
				url += '&fetchSimilarity=true';
			}
		}
		Logger.log('Search.getURL=' + url);
		return url;
	}
	getBatchApiURLs(dm :DM, total :number, useAbbr :boolean = false) :string[] {
		const dataMode :DataMode = DataMode.getDataMode(dm),
			maxSubstancesPerBatch :number = dataMode.maxSubstancesPerBatch,
			apiUrl :string = environment.apiUrl,
			urls :string[] = [];
		urls.push(apiUrl + this.getURL(dm, useAbbr));
		for(let i :number = maxSubstancesPerBatch + 1; i <= total; i += maxSubstancesPerBatch){
			urls.push(apiUrl + this.getURL(dm, useAbbr, false) + '&batchStart=' + i);
		}
		return urls;
	}

	private setMultiNoAbbr() :void {
		const multi :Multi = this.getMulti(false);
		this._urlNoAbbr = multi.url;
		this._routerQueryParamsNoAbbr = multi.params;
	}
	private getMulti(useAbbr :boolean) :Multi {
		const params :Params = {};
		let url :string = '',
			i :number = 0;
		this.exps.forEach( (exp :Expression) => {
			const uriUnencoded :string = useAbbr ? exp.urlUnencoded : exp.urlNoAbbrUnencoded;
			url += Search.MULTI_SEPARATOR + encodeURIComponent(uriUnencoded);
			++i;
			params['exp' + i] = uriUnencoded.replace(/\//g, '%2F').replace(/\(/g, '%28').replace(/\)/g, '%29');
		});
		return {url:url, params:params};
	}


	/*tslint:disable-next-line:member-ordering */
	static deserializeURL(url :string) :Search {
		Logger.trace('Search.deserializeURL', url);
		const exps :Expression[] = [];
		if(!url.startsWith(Search.MULTI_SEPARATOR) && !url.startsWith(Search.DATA_MULTI_PREFIX)){
			exps[0] = Expression.deserializeURL(url);
		}else{
			url.split(Search.MULTI_SEPARATOR)
				.slice(1)
				.forEach( (expURL :string) => exps.push(Expression.deserializeURL(decodeURIComponent(expURL).replace(/%28/g, '(').replace(/%29/g, ')'), true)));
		}
		return new Search(exps);
	}
}


export class SearchMut {
	/*tslint:disable:variable-name */
	private _acExp :ExpressionMut;
	private _acURL :string;
	private _forEdit :ExpressionMut;
	/*tslint:enable:variable-name */

	constructor(private exps :ExpressionMut[]){
		this.setGenerated();
	}

	immutable() :Search {
		return new Search(this.exps.map( (exp :ExpressionMut) => exp.immutable() ));
	}

	get expsDoNotModify() :ReadonlyArray<ExpressionMut> {
		return this.exps;
	}
	get expCount() :number {
		return this.exps.length;
	}
	get hasNonNot() :boolean {
		return !!this.exps.find( (exp :ExpressionMut) => !exp.not );
	}
	get acExp() :ExpressionMut {
		return this._acExp;
	}
	get acURL() :string {
		return this._acURL;
	}
	get clone() :SearchMut {
		return new SearchMut(this.exps && this.exps.slice());
	}
	get singleExpNonInlistAcTotals() :Totals {
		Logger.log('SearchMut.singleExpNonInlistAcTotals this.exps.length=' + this.exps.length);
		if(this.exps.length === 1){
			const exp :ExpressionMut = this.exps[0];
			if(exp.ac && exp.op !== Op.inlist){
				return exp.ac.totals;
			}
		}
	}
	get forEdit() :ExpressionMut {
		return this._forEdit;
	}

	equals(search :SearchMut) :boolean {
		return this.exps.length === search.exps.length && !this.exps.find( (exp :ExpressionMut, index :number) => !exp.equals(search.exps[index]) );
	}

	addExpression(exp :ExpressionMut) :void {
		Logger.log('SearchMut.addExpression exp=' + exp.url);
		if(exp.value.endsWith('|')){
			exp.value = exp.value.replace(/\|$/, '');
			Logger.log('SearchMut.addExpression removed final pipe, exp=' + exp.url);
		}
		this.exps.push(exp);
		this.setGenerated();
	}

	setForEdit(exp :ExpressionMut) :void {
		Logger.log('SearchMut.setForEdit exp.ac=' + exp.ac);
		this._forEdit = exp;
	}
	deleteForEdit() :void {
		if(this._forEdit){
			Logger.log('SearchMut.deleteForEdit this.forEdit=' + this._forEdit.url);
			this.exps.splice(this.exps.indexOf(this._forEdit), 1);
			this.setGenerated();
		}
		this.clearForEdit();
	}
	clearForEdit() :void {
		this._forEdit = undefined;
	}
	deleteExp(exp :ExpressionMut) :ExpressionMut {
		let e :ExpressionMut;
		for(let i :number = 0; i < this.exps.length; ++i){
			e = this.exps[i];
			if(e ===  exp){
				e = this.exps.splice(i, 1)[0];
				this.setGenerated();
				return e;
			}
		}
	}

	private setGenerated() :void {
		this._acExp = undefined;
		this._acURL = undefined;
		if(this.exps){
			if(this.exps.length === 1){
				const exp :ExpressionMut = this.exps[0];
				if(exp.usesAC){
					this._acExp = exp.autocomplete;
					this._acURL = 'data/' + this._acExp.url + '?data=' + DM[DM.valueCounts] + (exp.fld === Fld.auto && exp.testFirst !== undefined ? '&testFirst=' + Fld[exp.testFirst] : '');
				}
			}
		}
	}

}
