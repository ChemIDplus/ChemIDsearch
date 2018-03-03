import { EnumEx } from './../util/enum-ex';

export enum PPF{
	meltingpoint,
	boilingpoint,
	watersolubility,
	logp,
	henryslawconstant,
	atmosphericohrateconstant,
	pkadissociationconstant,
	vaporpressure
}

/** Immutable */
export class PPField{

// Static
	static readonly ppfs :ReadonlyArray<PPF> = EnumEx.getValues(PPF);

	private static ppFields :PPField[];

	static _constructor() :void {
		let a :PPField[];
		a = PPField.ppFields = [];
		a[PPF.meltingpoint] = new PPField('mp', 'Melting Point', 'MP');
		a[PPF.boilingpoint] = new PPField('bp', 'Boiling Point', 'BP');
		a[PPF.watersolubility] = new PPField('ws', 'Water Solubility', 'Sol.');
		a[PPF.logp] = new PPField('logp', 'Log P', 'Log P');
		a[PPF.henryslawconstant] = new PPField('hlc', 'Henry\'s Law Constant', 'HLC');
		a[PPF.atmosphericohrateconstant] = new PPField('aoh', 'Atmospheric OH Rate Constant', 'AOH');
		a[PPF.pkadissociationconstant] = new PPField('pka', 'pKa Dissociation Constant', 'pKa');
		a[PPF.vaporpressure] = new PPField('vp', 'Vapor Pressure', 'VP');
	}

	static getAbbr(ppf :PPF) :string {
		return PPField.getPPField(ppf).abbr;
	}
	static getPPF(name_or_abbr :string) :PPF {
		return PPF[name_or_abbr] || PPField.ppfs.find( (ppf :PPF) => PPField.ppFields[ppf].abbr === name_or_abbr);
	}
	static getDisplay(ppf :PPF) :string {
		return PPField.getPPField(ppf).display;
	}
	static getDisplayAbbr(ppf :PPF) :string {
		return PPField.getPPField(ppf).displayAbbr;
	}

	private static getPPField(ppf :PPF) :PPField {
		return PPField.ppFields[ppf];
	}


// Instance
	constructor(
		readonly abbr :string,
		readonly display :string,
		readonly displayAbbr :string
	){}

}

PPField._constructor();
