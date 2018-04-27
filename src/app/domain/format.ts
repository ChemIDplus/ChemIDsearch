import { EnumEx } from './../util/enum-ex';

export enum Fmt {
	json,
	xml,
	tsv
}

/** Immutable */
export class Format{

	// Static:
	static readonly fmts :ReadonlyArray<Fmt> = EnumEx.getValues(Fmt);

	private static _formats :ReadonlyArray<Format>;

	static _constructor() :void {
		const a :Format[] = [];
		a[Fmt.json] = new Format(Fmt.json, 'JSON');
		a[Fmt.xml] = new Format(Fmt.xml, 'XML');
		a[Fmt.tsv] = new Format(Fmt.tsv, 'TSV (tabbed CSV)', 'TSV');
		Format._formats = a;
	}

	static get formats() :ReadonlyArray<Format> {
		return Format._formats;
	}

	static getFormat(fmt :Fmt) :Format {
		return Format._formats[fmt];
	}

	static getDisplay(fmt :Fmt) :String {
		return Format.getFormat(fmt).display;
	}


// Instance:
	constructor(
		readonly fmt :Fmt,
		readonly display :string,
		readonly displayAbbr :string = display
	){}

}
Format._constructor();
