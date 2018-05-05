import { DM } from './data-mode';
import { Fmt } from './format';
import { RM } from './result-mode';
import { Srt } from './sort';

export interface PreferencesMinJSON {
	/** Result Mode - HTML / API */
	m ? :RM;
	/** autocomplete rows */
	a ? :number;
	/** field operator abbr */
	f ? :number;
	/** results per page */
	r ? :number;
	s ? :Srt;
	/** similarity percent */
	p ? :number;
	/** view no structures */
	v ? :number;
	/** Data Parameter - Totals / Summary / etc */
	d ? :DM;
	/** API Format - json / xml / tsv */
	fm ? :Fmt;
}
export class Preferences {

	// Default boolean values should be false for simpler handling where false = undefined = no user preference

	private static readonly DEFAULT_RM :RM = RM.html;
	private static readonly DEFAULT_MAX_AC_ROWS :number = 20;
	private static readonly DEFAULT_MAX_RP_ROWS :number = 5;
	private static readonly DEFAULT_SRT :Srt = Srt.citations;
	private static readonly DEFAULT_SIM_PERCENT :number = 80;
	private static readonly DEFAULT_DM :DM = DM.summary;
	private static readonly DEFAULT_FMT :Fmt = Fmt.json;

	private static readonly NON_DEFAULT_BOOLEAN :number = 1;

	private _rm :RM;
	private _maxAutoCompleteRows :number;
	private _useFieldOperatorAbbreviations :boolean;
	private _maxResultPageRows :number;
	private _srt :Srt;
	private _simPercent :number;
	private _viewNoStructures :boolean;
	private _dm :DM;
	private _fmt :Fmt;

	constructor(rm ? :RM, maxAutoCompleteRows ? :number, useFieldOperatorAbbreviations ? :boolean, maxResultPageRows ? :number, srt ? :Srt, simPercent ? :number, viewStructures ? :boolean, dm ? :DM, fmt ? :Fmt){
		this.rm = rm;
		this.maxAutoCompleteRows = maxAutoCompleteRows;
		this.useFieldOperatorAbbreviations = useFieldOperatorAbbreviations;
		this.maxResultPageRows = maxResultPageRows;
		this.srt = srt;
		this.simPercent = simPercent;
		if(viewStructures !== undefined){
			this.viewStructures = viewStructures;
		}
		this.dm = dm;
		this.fmt = fmt;
	}

	set rm(r :RM){
		this._rm = r;
	}
	get rm() :RM {
		return this._rm === undefined ? Preferences.DEFAULT_RM : this._rm;
	}

	set maxAutoCompleteRows(n :number){
		this._maxAutoCompleteRows = n;
	}
	get maxAutoCompleteRows() :number {
		return this._maxAutoCompleteRows === undefined ? Preferences.DEFAULT_MAX_AC_ROWS : this._maxAutoCompleteRows;
	}

	set useFieldOperatorAbbreviations(b :boolean){
		this._useFieldOperatorAbbreviations = b;
	}
	get useFieldOperatorAbbreviations() :boolean {
		return !!this._useFieldOperatorAbbreviations;
	}

	set maxResultPageRows(n :number){
		this._maxResultPageRows = n;
	}
	get maxResultPageRows() :number {
		return this._maxResultPageRows === undefined ? Preferences.DEFAULT_MAX_RP_ROWS : this._maxResultPageRows;
	}

	set srt(srt :Srt){
		this._srt = srt;
	}
	get srt() :Srt{
		return this._srt === undefined ? Preferences.DEFAULT_SRT : this._srt;
	}

	set simPercent(n :number){
		this._simPercent = n;
	}
	get simPercent() :number{
		return this._simPercent === undefined ? Preferences.DEFAULT_SIM_PERCENT : this._simPercent;
	}

	set viewStructures(viewStructures :boolean){
		// Opposite so default _viewNoStructures can be false
		this._viewNoStructures = !viewStructures;
	}
	get viewStructures() :boolean{
		// Opposite so default _viewNoStructures can be false
		return !this._viewNoStructures;
	}

	set dm(dm :DM){
		this._dm = dm;
	}
	get dm() :DM{
		return this._dm === undefined ? Preferences.DEFAULT_DM : this._dm;
	}

	set fmt(fmt :Fmt){
		this._fmt = fmt;
	}
	get fmt() :Fmt{
		return this._fmt === undefined ? Preferences.DEFAULT_FMT : this._fmt;
	}

	serialize() :PreferencesMinJSON {
		let mj :PreferencesMinJSON;
		if(this.rm !== Preferences.DEFAULT_RM){
			mj = mj || {};
			mj.m = this._rm;
		}
		if(this.maxAutoCompleteRows !== Preferences.DEFAULT_MAX_AC_ROWS){
			mj = mj || {};
			mj.a = this._maxAutoCompleteRows;
		}
		if(this._useFieldOperatorAbbreviations){
			mj = mj || {};
			mj.f = Preferences.NON_DEFAULT_BOOLEAN;
		}
		if(this.maxResultPageRows !== Preferences.DEFAULT_MAX_RP_ROWS){
			mj = mj || {};
			mj.r = this._maxResultPageRows;
		}
		if(this.srt !== Preferences.DEFAULT_SRT){
			mj = mj || {};
			mj.s = this._srt;
		}
		if(this.simPercent !== Preferences.DEFAULT_SIM_PERCENT){
			mj = mj || {};
			mj.p = this._simPercent;
		}
		if(this._viewNoStructures){
			mj = mj || {};
			mj.v = Preferences.NON_DEFAULT_BOOLEAN;
		}
		if(this.dm !== Preferences.DEFAULT_DM){
			mj = mj || {};
			mj.d = this._dm;
		}
		if(this.fmt !== Preferences.DEFAULT_FMT){
			mj = mj || {};
			mj.fm = this._fmt;
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :PreferencesMinJSON) :Preferences {
		if(mj){
			const p :Preferences = new Preferences();
			p._rm = mj.m;
			p._maxAutoCompleteRows = mj.a;
			p._useFieldOperatorAbbreviations = mj.f === Preferences.NON_DEFAULT_BOOLEAN;
			p._maxResultPageRows = mj.r;
			p._srt = mj.s;
			p._simPercent = mj.p;
			p._viewNoStructures = mj.v === Preferences.NON_DEFAULT_BOOLEAN;
			p._dm = mj.d;
			p._fmt = mj.fm;
			return p;
		}
	}

}

/** Immutable */
export class ImmutablePreferences{

	readonly rm :RM;
	readonly maxAutoCompleteRows :number;
	readonly useFieldOperatorAbbreviations :boolean;
	readonly maxResultPageRows :number;
	readonly srt :Srt;
	readonly simPercent :number;
	readonly viewStructures :boolean;
	readonly dm :DM;
	readonly fmt :Fmt;

	constructor(preferences :Preferences){
		this.rm = preferences.rm;
		this.maxAutoCompleteRows = preferences.maxAutoCompleteRows;
		this.useFieldOperatorAbbreviations = preferences.useFieldOperatorAbbreviations;
		this.maxResultPageRows = preferences.maxResultPageRows;
		this.srt = preferences.srt;
		this.simPercent = preferences.simPercent;
		this.viewStructures = preferences.viewStructures;
		this.dm = preferences.dm;
		this.fmt = preferences.fmt;
	}
}
