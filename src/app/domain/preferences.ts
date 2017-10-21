import { RM } from './result-mode';

export interface PreferencesMinJSON {
	p ? :number;
	r ? :number;
	a ? :boolean;
	rm ? :RM;
}
export class Preferences {

	static readonly DEFAULT_MAX_RP_ROWS :number = 5;
	static readonly DEFAULT_MAX_AC_ROWS :number = 20;
	static readonly DEFAULT_USE_ABBR :boolean = false;
	static readonly DEFAULT_RM :RM = RM.html;

	/* tslint:disable:variable-name */
	private _maxResultPageRows :number;
	private _maxAutoCompleteRows :number;
	private _useFieldOperatorAbbreviations :boolean;
	private _rm :RM;

	constructor(maxResultPageRows ? :number, maxAutoCompleteRows ? :number, useFieldOperatorAbbreviations ? :boolean, rm ? :RM){
		this.maxResultPageRows = maxResultPageRows;
		this.maxAutoCompleteRows = maxAutoCompleteRows;
		this.useFieldOperatorAbbreviations = useFieldOperatorAbbreviations;
		this.rm = rm;
	}

	get maxResultPageRows() :number {
		return this._maxResultPageRows === undefined ? Preferences.DEFAULT_MAX_RP_ROWS : this._maxResultPageRows;
	}

	get maxAutoCompleteRows() :number {
		return this._maxAutoCompleteRows === undefined ? Preferences.DEFAULT_MAX_AC_ROWS : this._maxAutoCompleteRows;
	}
	get useFieldOperatorAbbreviations() :boolean {
		return this._useFieldOperatorAbbreviations === undefined ? Preferences.DEFAULT_USE_ABBR : this._useFieldOperatorAbbreviations;
	}
	get rm() :RM {
		return this._rm === undefined ? Preferences.DEFAULT_RM : this._rm;
	}

	set maxResultPageRows(n :number){
		this._maxResultPageRows = n;
	}
	set maxAutoCompleteRows(n :number){
		this._maxAutoCompleteRows = n;
	}
	set useFieldOperatorAbbreviations(b :boolean){
		this._useFieldOperatorAbbreviations = b;
	}
	set rm(r :RM){
		this._rm = r;
	}

	serialize() :PreferencesMinJSON {
		let mj :PreferencesMinJSON = undefined;
		if(this.maxResultPageRows && this.maxResultPageRows !== Preferences.DEFAULT_MAX_RP_ROWS){
			mj = {};
			mj.p = this.maxResultPageRows;
		}
		if(this.maxAutoCompleteRows && this.maxAutoCompleteRows !== Preferences.DEFAULT_MAX_AC_ROWS){
			mj = mj || {};
			mj.r = this.maxAutoCompleteRows;
		}
		if(this.useFieldOperatorAbbreviations && this.useFieldOperatorAbbreviations !== Preferences.DEFAULT_USE_ABBR){
			mj = mj || {};
			mj.a = this.useFieldOperatorAbbreviations;
		}
		if(this.rm && this.rm !== Preferences.DEFAULT_RM){
			mj = mj || {};
			mj.rm = this.rm;
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :PreferencesMinJSON) :Preferences {
		if(mj){
			const p :Preferences = new Preferences();
			p.maxResultPageRows = mj.p;
			p.maxAutoCompleteRows = mj.r;
			p.useFieldOperatorAbbreviations = mj.a;
			p.rm = mj.rm;
			return p;
		}
	}

}

/** Immutable */
export class ImmutablePreferences{

	readonly maxResultPageRows :number;
	readonly maxAutoCompleteRows :number;
	readonly useFieldOperatorAbbreviations :boolean;
	readonly rm :RM;

	constructor(preferences :Preferences){
		this.maxResultPageRows = preferences.maxResultPageRows;
		this.maxAutoCompleteRows = preferences.maxAutoCompleteRows;
		this.useFieldOperatorAbbreviations = preferences.useFieldOperatorAbbreviations;
		this.rm = preferences.rm;
	}
}
