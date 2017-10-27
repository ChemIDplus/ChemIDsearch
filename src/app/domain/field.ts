import { EnumEx } from '../util/enum-ex';

export enum Fld{
	auto,
	name,
	number,
	rn,
	id,
	unii,
	formula,
	category,
	inchikey,
	locator,
	lastmod,
	weight,
	structure,
	has2d,
	has3d,
	toxicity,
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
export class Field{

// Static
	private static flds :Fld[] = EnumEx.getValues(Fld);

	private static fields :Field[];

	// Static Constructor IIFE: see https://github.com/Microsoft/TypeScript/issues/265
	/* tslint:disable-next-line */
	private static _constructor = (() :void => {
		let a :Field[];
		a = Field.fields = [];
		a[Fld.auto] = new Field('auto', '(automatic)', 'Auto', true);
		a[Fld.name] = new Field('na', 'Name/Synonym', 'Name', true);
		a[Fld.number] = new Field('nu', 'ID/Code/Number', 'Num.', true);
		a[Fld.rn] = new Field('rn', 'Registry Number', 'RN', true);
		a[Fld.id] = new Field('id', 'System ID', 'ID', true);
		a[Fld.unii] = new Field('un', 'FDA UNII', 'UNII', true);
		a[Fld.formula] = new Field('fo', 'Formula', 'Form.', true);
		a[Fld.category] = new Field('ca', 'Category', 'Cat.', true);
		a[Fld.inchikey] = new Field('ik', 'InChIKey', 'IKey', true);
		a[Fld.locator] = new Field('lo', 'Locator', 'Loc.', true);
		a[Fld.lastmod] = new Field('lm', 'Last Modified', 'LastMod');
		a[Fld.weight] = new Field('mw', 'Molecular Weight', 'Weight');
		a[Fld.structure] = new Field('st', 'Structure', 'Struc.', false, false, false, true);
		a[Fld.has2d] = new Field('2d', 'Has 2D', '2D', false, true, true);
		a[Fld.has3d] = new Field('3d', 'Has 3D', '3D', false, true, true);
		a[Fld.toxicity] = new Field('tox', 'Toxicity', 'Tox.');
		a[Fld.meltingpoint] = new Field('mp', 'Melting Point', 'MP', false, false, false, false, true);
		a[Fld.boilingpoint] = new Field('bp', 'Boiling Point', 'BP', false, false, false, false, true);
		a[Fld.watersolubility] = new Field('sol', 'Water Solubility', 'Sol.', false, false, false, false, true);
		a[Fld.logp] = new Field('logp', 'Log P', 'Log P', false, false, false, false, true);
		a[Fld.henryslawconstant] = new Field('hlc', 'Henry\'s Law Constant', 'HLC', false, false, false, false, true);
		a[Fld.atmosphericohrateconstant] = new Field('aoh', 'Atmospheric OH Rate Constant', 'AOH', false, false, false, false, true);
		a[Fld.pkadissociationconstant] = new Field('pka', 'pKa Dissociation Constant', 'pKa', false, false, false, false, true);
		a[Fld.vaporpressure] = new Field('vp', 'Vapor Pressure', 'VP', false, false, false, false, true);
	})();

	static get Flds() :Fld[] {
		return Field.flds;
	}
	static getAbbr(fld :Fld) :string {
		return Field.getField(fld).abbr;
	}
	/* tslint:disable-next-line:variable-name */
	static getFld(name_or_abbr :string) :Fld {
		return Fld[name_or_abbr] || Field.flds.find( (fld :Fld) => Field.fields[fld].abbr === name_or_abbr);
	}
	static getDisplay(fld :Fld) :string {
		return Field.getField(fld).display;
	}
	static getDisplayAbbr(fld :Fld) :string {
		return Field.getField(fld).displayAbbr;
	}
	static allowsAutocomplete(fld :Fld) :boolean {
		return this.getField(fld).allowsAutocomplete;
	}
	static multiOnly(fld :Fld) :boolean {
		return Field.getField(fld).multiOnly;
	}
	static boolean(fld :Fld) :boolean {
		return Field.getField(fld).boolean;
	}
	static caseSensitive(fld :Fld) :boolean {
		return Field.getField(fld).caseSensitive;
	}
	static pp(fld :Fld) :boolean {
		return Field.getField(fld).pp;
	}


	private static getField(fld :Fld) :Field {
		return Field.fields[fld];
	}


// Instance
	constructor(
		readonly abbr :string,
		readonly display :string,
		readonly displayAbbr :string,
		readonly allowsAutocomplete ? :boolean,
		readonly multiOnly ? :boolean,
		readonly boolean ? :boolean,
		readonly caseSensitive ? :boolean,
		readonly pp ? :boolean
	){}

}
