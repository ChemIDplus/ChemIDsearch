import { EnumEx } from './../util/enum-ex';

export enum PPMT{
	either,
	experimental,
	estimated
}

/** Immutable */
export class PPMeasurementType{


// Static
	static readonly ppmts :ReadonlyArray<PPMT> = EnumEx.getValues(PPMT);

	private static ppMeasurementTypes :PPMeasurementType[];

	static _constructor() :void {
		let a :PPMeasurementType[];
		a = PPMeasurementType.ppMeasurementTypes = [];
		a[PPMT.either] = new PPMeasurementType('either', '', '');
		a[PPMT.experimental] = new PPMeasurementType('exp', 'Experimental', 'Exp.');
		a[PPMT.estimated] = new PPMeasurementType('est', 'Estimated', 'Est.');
	}

	static getAbbr(ppmt :PPMT) :string {
		return PPMeasurementType.getPPMeasurementType(ppmt).abbr;
	}
	static getPPMT(name_or_abbr :string) :PPMT {
		return PPMT[name_or_abbr] || PPMeasurementType.ppmts.find( (ppmt :PPMT) => PPMeasurementType.ppMeasurementTypes[ppmt].abbr === name_or_abbr);
	}
	static getDisplay(ppmt :PPMT) :string {
		return PPMeasurementType.getPPMeasurementType(ppmt).display;
	}
	static getDisplayAbbr(ppmt :PPMT) :string {
		return PPMeasurementType.getPPMeasurementType(ppmt).displayAbbr;
	}

	private static getPPMeasurementType(ppmt :PPMT) :PPMeasurementType {
		return PPMeasurementType.ppMeasurementTypes[ppmt];
	}


// Instance
	constructor(
		readonly abbr :string,
		readonly display :string,
		readonly displayAbbr :string
	){}
}

PPMeasurementType._constructor();
