import { AutoCompleteResult } from './auto-complete-result';
import { Fld, Field } from './field';
import { Op, Operator } from './operator';
import { PPF, PPField } from './pp-field';
import { PPMT, PPMeasurementType } from './pp-measurement-type';
import { ToxT, ToxicityTest } from './toxicity-test';
import { ToxS, ToxicitySpecies } from './toxicity-species';
import { ToxR, ToxicityRoute} from './toxicity-route';
import { ToxE, ToxicityEffect} from './toxicity-effect';

import { Logger } from './../core/logger';

export interface ExpressionMinJSON{
	f :number;
	o :number;
	v :string;
	n ? :boolean;
	s ? :number;
	p ? :number;
	m ? :number;
	tt ? :number;
	ts ? :number;
	tr ? :number;
	te ? :number;
}


/** Immutable */
export class Expression {

// Static:
	static readonly DEFAULT_SIM_PERCENT :number = 80;

	static trimAndCase(fld :Fld, value :string, skipTrim :boolean = false) :string {
		if(!skipTrim){
			value = value.trim();
		}
		if(!Field.caseSensitive(fld)){
			value = value.toLowerCase();
		}
		return value;
	}

	static compare(a :Expression, b :Expression) :number {
		if(a.fld !== b.fld){
			return a.fld - b.fld;
		}
		if(a.op !== b.op){
			return a.op - b.op;
		}
		if(a.value !== b.value){
			return a.value < b.value ? -1 : 1;
		}
		if(a.not !== b.not){
			return a.not === undefined || b.not === true ? -1 : 1;
		}
		if(a.simPercent !== b.simPercent){
			return (a.simPercent !== undefined && b.simPercent !== undefined) ? a.simPercent - b.simPercent : ( a.simPercent === undefined ? -1 : 1 );
		}
		if(a.ppf !== b.ppf){
			return (a.ppf !== undefined && b.ppf !== undefined) ? a.ppf - b.ppf : ( a.ppf === undefined ? -1 : 1 );
		}
		if(a.ppmt !== b.ppmt){
			return (a.ppmt !== undefined && b.ppmt !== undefined) ? a.ppmt - b.ppmt : ( a.ppmt === undefined ? -1 : 1 );
		}
		if(a.toxT !== b.toxT){
			return (a.toxT !== undefined && b.toxT !== undefined) ? a.toxT - b.toxT : ( a.toxT === undefined ? -1 : 1 );
		}
		if(a.toxS !== b.toxS){
			return (a.toxS !== undefined && b.toxS !== undefined) ? a.toxS - b.toxS : ( a.toxS === undefined ? -1 : 1 );
		}
		if(a.toxR !== b.toxR){
			return (a.toxR !== undefined && b.toxR !== undefined) ? a.toxR - b.toxR : ( a.toxR === undefined ? -1 : 1 );
		}
		if(a.toxE !== b.toxE){
			return (a.toxE !== undefined && b.toxE !== undefined) ? a.toxE - b.toxE : ( a.toxE === undefined ? -1 : 1 );
		}
		return 0;
	}


// Instance:
	readonly url :string;
	readonly display :string;

	/*tslint:disable:variable-name */
	private _routerLinkParams :ReadonlyArray<string>;
	private _urlNoAbbr :string;
	private _routerLinkParamsNoAbbr :ReadonlyArray<string>;
	private _urlUnencoded :string;
	private _urlNoAbbrUnencoded :string;
	/*tslint:enable:variable-name */

	constructor(
		readonly fld :Fld,
		readonly op :Op,
		readonly value :string,
		readonly not ? :boolean,
		readonly simPercent ? :number,
		readonly ppf ? :PPF,
		readonly ppmt ? :PPMT,
		readonly toxT ? :ToxT,
		readonly toxS ? :ToxS,
		readonly toxR ? :ToxR,
		readonly toxE ? :ToxE
	){
		this.url = this.generateURL(true);
		this.display = (this.not ? 'NOT ' : '')
			+ (this.fld === Fld.physicalproperty ? PPField.getDisplayAbbr(this.ppf) : Field.getDisplayAbbr(this.fld))
			+ (this.simPercent ? ' ' + this.simPercent + '%' : '')
			+ (this.value ? ' ' + Operator.getDisplayAbbr(this.op) + ' ' + (Field.caseSensitive(this.fld) ? this.value : this.value.toUpperCase()) : '')
			+ (this.ppmt ? ' ' + PPMeasurementType.getDisplayAbbr(this.ppmt) : '')
			+ (this.toxT ? ' ' + ToxicityTest.getDisplayAbbr(this.toxT) : '')
			+ (this.toxS ? ' ' + ToxicitySpecies.getDisplayAbbr(this.toxS) : '')
			+ (this.toxR ? ' ' + ToxicityRoute.getDisplayAbbr(this.toxR) : '')
			+ (this.toxE ? ' ' + ToxicityEffect.getDisplayAbbr(this.toxE) : '');
		Logger.debug('GENERATED IMMUTABLE Expression', this );
	}

	mutable() :ExpressionMut {
		Logger.trace('Expression.mutable');
		return new ExpressionMut(this.fld, this.not, this.op, this.simPercent, this.value, this.ppf, this.ppmt, this.toxT, this.toxS, this.toxR, this.toxE);
	}
	toggleNot() :Expression {
		Logger.trace('Expression.toggleNot');
		return new Expression(this.fld, this.op, this.value, !this.not, this.simPercent, this.ppf, this.ppmt, this.toxT, this.toxS, this.toxR, this.toxE);
	}

	get routerLinkParams() :ReadonlyArray<string> {
		if(!this._routerLinkParams){
			this._routerLinkParams = this.urlUnencoded.replace(/\(/g, '%28').replace(/\)/g, '%29').split('/');
		}
		return this._routerLinkParams;
	}
	get urlNoAbbr() :string {
		if(!this._urlNoAbbr){
			this._urlNoAbbr = this.generateURL(false);
		}
		return this._urlNoAbbr;
	}
	get routerLinkParamsNoAbbr() :ReadonlyArray<string> {
		if(!this._routerLinkParamsNoAbbr){
			this._routerLinkParamsNoAbbr = this.urlNoAbbrUnencoded.replace(/\(/g, '%28').replace(/\)/g, '%29').split('/');
		}
		return this._routerLinkParamsNoAbbr;
	}
	get urlUnencoded() :string {
		if(!this._urlUnencoded){
			this._urlUnencoded = this.generateURL(true, true);
		}
		return this._urlUnencoded;
	}
	get urlNoAbbrUnencoded() :string {
		if(!this._urlNoAbbrUnencoded){
			this._urlNoAbbrUnencoded = this.generateURL(false, true);
		}
		return this._urlNoAbbrUnencoded;
	}

	/** True if the operator is similarity and not a NOT */
	isSimilarity() :boolean {
		return this.op === Op.similarity && !this.not;
	}


	getRouterLinkParams(useAbbr :boolean) :ReadonlyArray<string> {
		return useAbbr ? this.routerLinkParams : this.routerLinkParamsNoAbbr;
	}

	private generateURL(useAbbr :boolean, skipEncodeValue :boolean = false) :string {
		// Double escape all / in the value
		const v :string = (this.value ? Expression.trimAndCase(this.fld, this.value).replace(/\\/g, '%5C').replace(/\//g, '%2F') : undefined);
		return (useAbbr ? Field.getAbbr(this.fld) : Fld[this.fld])
			+ (this.fld === Fld.physicalproperty ? '/' + (useAbbr ? PPField.getAbbr(this.ppf) : PPF[this.ppf]) : '')
			+ (this.ppmt ? '/' + (useAbbr ? PPMeasurementType.getAbbr(this.ppmt) : PPMT[this.ppmt]) : '')
			+ (this.toxT ? '/' + (useAbbr ? ToxicityTest.getAbbr(this.toxT) : ToxT[this.toxT]) : '')
			+ (this.toxS ? '/' + (useAbbr ? ToxicitySpecies.getAbbr(this.toxS) : ToxS[this.toxS]) : '')
			+ (this.toxR ? '/' + (useAbbr ? ToxicityRoute.getAbbr(this.toxR) : ToxR[this.toxR]) : '')
			+ (this.toxE ? '/' + (useAbbr ? ToxicityEffect.getAbbr(this.toxE) : ToxE[this.toxE]) : '')
			+ (v
				?	'/' + (this.not ? 'not' : '')
					+ (useAbbr ? Operator.getAbbr(this.op) : Op[this.op])
					+ (Operator.usesPercent(this.op) && this.simPercent && this.simPercent !== Expression.DEFAULT_SIM_PERCENT ? this.simPercent : '')
					+ '/' + (!skipEncodeValue ? encodeURIComponent(v) : v)
				: ''
			);
	}


	/*tslint:disable:member-ordering */
	serialize() :ExpressionMinJSON {
		const e :ExpressionMinJSON = {f:this.fld, o:this.op, v:this.value};
		if(this.not !== undefined){
			e.n = this.not;
		}
		if(this.simPercent !== undefined){
			e.s = this.simPercent;
		}
		if(this.ppf !== undefined){
			e.p = this.ppf;
		}
		if(this.ppmt !== undefined){
			e.m = this.ppmt;
		}
		if(this.toxT !== undefined){
			e.tt = this.toxT;
		}
		if(this.toxS !== undefined){
			e.ts = this.toxS;
		}
		if(this.toxR !== undefined){
			e.tr = this.toxR;
		}
		if(this.toxE !== undefined){
			e.te = this.toxE;
		}
		return e;
	}
	static deserialize(e :ExpressionMinJSON) :Expression {
		if(e){
			return new Expression(e.f, e.o, e.v, e.n, e.s, e.p, e.m, e.tt, e.ts, e.tr, e.te);
		}
	}
	static deserializeURL(url :string, skipDecodeValue :boolean = false) :Expression {
		let expTermsIndex :number = 0,
			ppf :PPF,
			ppmt :PPMT,
			toxT :ToxT,
			toxS :ToxS,
			toxR :ToxR,
			toxE :ToxE,
			not :boolean,
			op :Op,
			simPercent :number,
			value :string;

		const expTerms :string[] = url.replace(/%2528/g, '(').replace(/%2529/g, ')').split('/'),
			fld :Fld = Field.getFld(expTerms[expTermsIndex]);

		++expTermsIndex;

		if(fld === Fld.physicalproperty){
			ppf = PPField.getPPF(expTerms[expTermsIndex]);
			++expTermsIndex;
			ppmt = PPMeasurementType.getPPMT(expTerms[expTermsIndex]);
			if(ppmt !== undefined){
				++expTermsIndex;
			}
		}else if(fld === Fld.toxicity){
			toxT = ToxicityTest.getToxT(expTerms[expTermsIndex]);
			if(toxT !== undefined){
				++expTermsIndex;
			}
			toxS = ToxicitySpecies.getToxS(expTerms[expTermsIndex]);
			if(toxS !== undefined){
				++expTermsIndex;
			}
			toxR = ToxicityRoute.getToxR(expTerms[expTermsIndex]);
			if(toxR !== undefined){
				++expTermsIndex;
			}
			toxE = ToxicityEffect.getToxE(expTerms[expTermsIndex]);
			if(toxE !== undefined){
				++expTermsIndex;
			}
		}

		if (expTerms[expTermsIndex]){
			const opTerms :RegExpMatchArray = expTerms[expTermsIndex].match(/^(not)?([A-Za-z]+)([0-9]*)$/);
			not = opTerms[1] === 'not';
			op  = Operator.getOp(opTerms[2]);
			simPercent = (opTerms[3] ? +opTerms[3] : undefined);

			++expTermsIndex;
			const val :string = (expTerms.length > (expTermsIndex + 1)) ? expTerms.slice(expTermsIndex).join('/') : expTerms[expTermsIndex];

			value = (!skipDecodeValue ? decodeURIComponent(val) : val).replace(/%5C/g, '\\').replace(/%2F/g, '/');
		}

		return new Expression(fld, op, value, not, simPercent, ppf, ppmt, toxT, toxS, toxR, toxE);
	}

}

/* tslint:disable:variable-name */

export class ExpressionMut{

	private _usesAC :boolean;
	private _acValue :string;
	private _url :string;

	constructor(
		private _fld :Fld,
		private _not :boolean,
		private _op :Op,
		private _simPercent :number,
		private _value :string,
		private _ppf :PPF,
		private _ppmt :PPMT,
		private _toxT :ToxT,
		private _toxS :ToxS,
		private _toxR :ToxR,
		private _toxE :ToxE,

		public ac ? :AutoCompleteResult,
		public testFirst ? :Fld
	){
		this.onChange(!!ac);
	}

	immutable() :Expression {
		return new Expression(this._fld, this._op, this._value, this._not, this._simPercent, this._ppf, this._ppmt, this._toxT, this._toxS, this._toxR, this._toxE);
	}

	set fld(fld :Fld) {
		const changed :boolean = (this._fld !== fld);
		this._fld = fld;
		if(changed){
			this.onChange();
		}
	}
	set not(not :boolean) {
		const changed :boolean = (this._not !== not);
		this._not = not;
		if(changed){
			this.onChange();
		}
	}
	set op(op :Op) {
		const changed :boolean = (this._op !== op);
		this._op = op;
		if(changed){
			this.onChange();
		}
	}
	set simPercent( simPercent :number) {
		if(simPercent === Expression.DEFAULT_SIM_PERCENT){
			simPercent = undefined;
		}
		const changed :boolean = (this._simPercent !== simPercent);
		this._simPercent = simPercent;
		if(changed){
			this.onChange();
		}
	}
	set value(value :string) {
		const changed :boolean = (this._value !== value);
		this._value = value;
		if(changed){
			this.onChange();
		}
	}
	set ppf(ppf :PPF) {
		const changed :boolean = (this._ppf !== ppf);
		this._ppf = ppf;
		if(changed){
			this.onChange();
		}
	}
	set ppmt(ppmt :PPMT) {
		if(ppmt === PPMT.either){
			ppmt = undefined;
		}
		const changed :boolean = (this._ppmt !== ppmt);
		this._ppmt = ppmt;
		if(changed){
			this.onChange();
		}
	}
	set toxT(toxT :ToxT) {
		if(toxT === ToxT.any){
			toxT = undefined;
		}
		const changed :boolean = (this._toxT !== toxT);
		this._toxT = toxT;
		if(changed){
			this.onChange();
		}
	}
	set toxS(toxS :ToxS) {
		if(toxS === ToxS.any){
			toxS = undefined;
		}
		const changed :boolean = (this._toxS !== toxS);
		this._toxS = toxS;
		if(changed){
			this.onChange();
		}
	}
	set toxR(toxR :ToxR) {
		if(toxR === ToxR.any){
			toxR = undefined;
		}
		const changed :boolean = (this._toxR !== toxR);
		this._toxR = toxR;
		if(changed){
			this.onChange();
		}
	}
	set toxE(toxE :ToxE) {
		if(toxE === ToxE.any){
			toxE = undefined;
		}
		const changed :boolean = (this._toxE !== toxE);
		this._toxE = toxE;
		if(changed){
			this.onChange();
		}
	}

	get fld() :Fld { return this._fld; }
	get not() :boolean { return this._not; }
	get op() :Op { return this._op; }
	get simPercent() :number { return this._simPercent; }
	get value() :string { return this._value; }
	get ppf() :PPF { return this._ppf; }
	get ppmt() :PPMT { return this._ppmt; }
	get toxT() :ToxT { return this._toxT; }
	get toxS() :ToxS { return this._toxS; }
	get toxR() :ToxR { return this._toxR; }
	get toxE() :ToxE { return this._toxE; }

	get usesAC() :boolean { return this._usesAC; }
	get acValue() :string { return this._acValue; }

	get display() :string {
		return (this._not ? 'NOT ' : '')
			+ (this._fld === Fld.physicalproperty ? PPField.getDisplay(this._ppf) : Field.getDisplay(this._fld))
			+ (this._simPercent ? ' ' + this.simPercent + '%' : '')
			+ ' ' + Operator.getDisplay(this._op) + ' ' + (this._value ? (Field.caseSensitive(this._fld) ? this._value : this._value.toUpperCase()) : '""')
			+ (this._ppmt ? ' ' + PPMeasurementType.getDisplay(this._ppmt) : '')
			+ (this._toxT ? ' ' + ToxicityTest.getDisplay(this._toxT) : '')
			+ (this._toxS ? ' ' + ToxicitySpecies.getDisplay(this._toxS) : '')
			+ (this._toxR ? ' ' + ToxicityRoute.getDisplay(this._toxR) : '')
			+ (this._toxE ? ' ' + ToxicityEffect.getDisplay(this._toxE) : '');
	}

	get clone() :ExpressionMut {
		return new ExpressionMut(this._fld, this._not, this._op, this._simPercent, this._value, this._ppf, this._ppmt, this._toxT, this._toxS, this._toxR, this._toxE, this.ac, this.testFirst);
	}
	get autocomplete() :ExpressionMut {
		return new ExpressionMut(this._fld, this._not, Op.startswith, undefined, this._acValue, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.testFirst);
	}
	get canonical() :boolean {
		return (this._fld === Fld.rn || this._fld === Fld.id) && this._op === Op.equals;
	}
	get url() :string {
		// default version !skipEncodeValue
		if(!this._url){
			// Double escape all / in the value
			const v :string = Expression.trimAndCase(this._fld, this._value).replace(/\//g, '%2F');
			this._url = Field.getAbbr(this._fld)
				+ (this._fld === Fld.physicalproperty ? '/' + PPField.getAbbr(this._ppf) : '')
				+ (this._ppmt ? '/' + PPMeasurementType.getAbbr(this._ppmt) : '')
				+ (this._toxT ? '/' + ToxicityTest.getAbbr(this._toxT) : '')
				+ (this._toxS ? '/' + ToxicitySpecies.getAbbr(this._toxS) : '')
				+ (this._toxR ? '/' + ToxicityRoute.getAbbr(this._toxR) : '')
				+ (this._toxE ? '/' + ToxicityEffect.getAbbr(this._toxE) : '')
				+ '/' + (this._not ? 'not' : '')
				+ Operator.getAbbr(this._op)
				+ (Operator.usesPercent(this._op) && this._simPercent && this._simPercent !== Expression.DEFAULT_SIM_PERCENT ? this._simPercent : '')
				+ '/' + encodeURIComponent(v)
			;
		}
		return this._url;
	}

	equals(exp :ExpressionMut) :boolean {
		return this._fld === exp._fld && this._not === exp._not && this._op === exp._op && this._simPercent === exp._simPercent && this._value === exp._value
			&& this._ppf === exp._ppf && this._ppmt === exp._ppmt && this._toxT === exp._toxT && this._toxS === exp._toxS && this._toxR === exp._toxR && this._toxE === exp._toxE;
	}

	serialize() :ExpressionMinJSON {
		const e :ExpressionMinJSON = {f:this._fld, o:this._op, v:this._value};
		if(this._not){
			e.n = this._not;
		}
		if(this._simPercent){
			e.s = this._simPercent;
		}
		if(this._ppf){
			e.p = this._ppf;
		}
		if(this._ppmt){
			e.m = this._ppmt;
		}
		if(this._toxT){
			e.tt = this._toxT;
		}
		if(this._toxS){
			e.ts = this._toxS;
		}
		if(this._toxR){
			e.tr = this._toxR;
		}
		if(this._toxE){
			e.te = this._toxE;
		}
		return e;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(e :ExpressionMinJSON) :ExpressionMut {
		if(e){
			return new ExpressionMut(e.f, e.n, e.o, e.s, e.v, e.p, e.m, e.tt, e.ts, e.tr, e.te);
		}
	}

	setData(exp :ExpressionMut) :void {
		const changed :boolean = !this.equals(exp);
		this._fld = exp._fld;
		this._op = exp._op;
		this._value = exp._value;
		this._not = exp._not;
		this._simPercent = exp._simPercent;
		this._ppf = exp._ppf;
		this._ppmt = exp._ppmt;
		this._toxT = exp._toxT;
		this._toxS = exp._toxS;
		this._toxR = exp._toxR;
		this._toxE = exp._toxE;
		if(changed){
			this.onChange();
		}
	}

	private onChange(keepAC :boolean = false) :void {
		if(!keepAC){
			this.ac = undefined;
		}
		if(!Field.allowsAutocomplete(this._fld) || this._op === Op.endswith || this._op === Op.contains || this._op === Op.regex){
			this._usesAC = false;
			this._acValue = undefined;
		}else{
			let val :string = this._value;
			if(this._op === Op.inlist){
				val = val.replace(/\|$/, '').replace(/^.*\|/, '');
			}
			if(val){
				val = Expression.trimAndCase(this._fld, val);
				this._usesAC = val.length >= 3;
				this._acValue = this._usesAC ? val : undefined;
			}
		}
		this._url = undefined;
	}

}
