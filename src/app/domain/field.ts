import { EnumEx } from './../util/enum-ex';

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
	weight,
	structure,
	has2d,
	has3d,
	physicalproperty,
	toxicity,
	lastmod
}

/** Immutable */
export class Field{

// Static
	static readonly flds :ReadonlyArray<Fld> = EnumEx.getValues(Fld);

	private static fields :Field[];

	// Make sure the help matches: \ChemIDsearch\src\app\api\fields-operators\fields-operators.component.html

	static _constructor() :void {
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
		a[Fld.weight] = new Field('mw', 'Molecular Weight', 'Weight');
		a[Fld.structure] = new Field('st', 'Structure', 'Struc.', false, false, false, true);
		a[Fld.has2d] = new Field('2d', 'Has 2D', '2D', false, true, true);
		a[Fld.has3d] = new Field('3d', 'Has 3D', '3D', false, true, true);
		a[Fld.physicalproperty] = new Field('pp', 'Physical Property', 'PP'); // Display values are not currently used; PPField displayed instead
		a[Fld.toxicity] = new Field('tox', 'Toxicity', 'Tox.');
		a[Fld.lastmod] = new Field('lm', 'Last Modified', 'LastMod');
	}

	static getAbbr(fld :Fld) :string {
		return Field.getField(fld).abbr;
	}
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
	static bool(fld :Fld) :boolean {
		return Field.getField(fld).bool;
	}
	static caseSensitive(fld :Fld) :boolean {
		return Field.getField(fld).caseSensitive;
	}
	static autocompleteMinLength(fld :Fld) :number {
		return Field.getField(fld).autocompleteMinLength;
	}


	private static getField(fld :Fld) :Field {
		return Field.fields[fld];
	}


// Instance

	readonly autocompleteMinLength :number;
	constructor(
		readonly abbr :string,
		readonly display :string,
		readonly displayAbbr :string,
		readonly allowsAutocomplete ? :boolean,
		readonly multiOnly ? :boolean,
		readonly bool ? :boolean,
		readonly caseSensitive ? :boolean
	){
		this.autocompleteMinLength = abbr === 'lo' || abbr === 'ca' ? 1 : 3;
	}
}

Field._constructor();
