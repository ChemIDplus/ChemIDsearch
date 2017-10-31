import { EnumEx } from '../util/enum-ex';

export enum PPMT{
	either,
	experimental,
	estimated
}

/** Immutable */
export class PPMeasurementType{


// Static
	/* tslint:disable-next-line:variable-name */
	static readonly PPMTs :ReadonlyArray<PPMT> = EnumEx.getValues(PPMT);

	private static ppMeasurementTypes :PPMeasurementType[];

	// Static Constructor IIFE: see https://github.com/Microsoft/TypeScript/issues/265
	/* tslint:disable-next-line */
	private static _constructor = (() :void => {
		let a :PPMeasurementType[];
		a = PPMeasurementType.ppMeasurementTypes = [];
		a[PPMT.either] = new PPMeasurementType('either', '', '');
		a[PPMT.experimental] = new PPMeasurementType('exp', 'Experimental', 'Exp.');
		a[PPMT.estimated] = new PPMeasurementType('est', 'Estimated', 'Est.');
	})();

	static getAbbr(ppmt :PPMT) :string {
		return PPMeasurementType.getPPMeasurementType(ppmt).abbr;
	}
	/* tslint:disable-next-line:variable-name */
	static getPPMT(name_or_abbr :string) :PPMT {
		return PPMT[name_or_abbr] || PPMeasurementType.PPMTs.find( (ppmt :PPMT) => PPMeasurementType.ppMeasurementTypes[ppmt].abbr === name_or_abbr);
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
