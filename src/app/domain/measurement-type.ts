import { EnumEx } from '../util/enum-ex';

export enum Mt{
	either,
	experimental,
	estimated
}

/** Immutable */
export class MeasurementType{


// Static
	private static mts :Mt[] = EnumEx.getValues(Mt);

	private static measurementtypes :MeasurementType[];

	// Static Constructor IIFE: see https://github.com/Microsoft/TypeScript/issues/265
	/* tslint:disable-next-line */
	private static _constructor = (() :void => {
		let a :MeasurementType[];
		a = MeasurementType.measurementtypes = [];
		a[Mt.either] = new MeasurementType('either', '', '');
		a[Mt.experimental] = new MeasurementType('exp', 'Experimental', 'Exp.');
		a[Mt.estimated] = new MeasurementType('est', 'Estimated', 'Est.');
	})();

	static getMts() :Mt[] {
		return MeasurementType.mts;
	}
	static getAbbr(mt :Mt) :string {
		return MeasurementType.getMeasurementType(mt).abbr;
	}
	/* tslint:disable-next-line:variable-name */
	static getMt(name_or_abbr :string) :Mt {
		return Mt[name_or_abbr] || MeasurementType.mts.find( (mt :Mt) => MeasurementType.measurementtypes[mt].abbr === name_or_abbr);
	}
	static getDisplay(mt :Mt) :string {
		return MeasurementType.getMeasurementType(mt).display;
	}
	static getDisplayAbbr(mt :Mt) :string {
		return MeasurementType.getMeasurementType(mt).displayAbbr;
	}

	private static getMeasurementType(mt :Mt) :MeasurementType {
		return MeasurementType.measurementtypes[mt];
	}




// Instance
	constructor(
		readonly abbr :string,
		readonly display :string,
		readonly displayAbbr :string
	){}
}
