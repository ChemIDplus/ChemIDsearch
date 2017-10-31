import { EnumEx } from '../util/enum-ex';

export enum DM {
	totals,
	valueCounts,
	id,
	lastMod,
	complete,
		details,
			summary,
			notes,
			categories,
			numbers,
			names,
			formulas,
			resources,
			toxicityList,
			physicalProps,
		structure,
			structureDetails,
				weight,
				inchikey,
				inchi,
				smiles,
				mol,
				mol3d,
			image
}

/** Immutable */
export class DataMode{
// Static:
	/* tslint:disable-next-line:variable-name */
	static readonly DMs :ReadonlyArray<DM> = EnumEx.getValues(DM);

	private static DATA_MODES :DataMode[];

	// Make sure the help matches: \ChemIDsearch\src\app\api\data-parameters\data-parameters.component.html

	// Static Constructor IIFE: see https://github.com/Microsoft/TypeScript/issues/265
	/* tslint:disable-next-line */
	private static _constructor = ( () => {
		let a :DataMode[];
		a = DataMode.DATA_MODES = [];
		a[DM.totals] = new DataMode(DM.totals, 1, ' = Totals for matching values and matching substances');
		a[DM.valueCounts] = new DataMode(DM.valueCounts, 1000, ' = List of matching values with substance counts');
		/* tslint:disable:align */
		a[DM.id] = new DataMode(DM.id, 25000, ' = IDs only');
		a[DM.lastMod] = new DataMode(DM.lastMod, 10000, ' = IDs and Last Modified');
		a[DM.complete] = new DataMode(DM.complete, 25, ' = Everything');
			a[DM.details] = new DataMode(DM.details, 300, ' includes all non-structure data: Summary, Notes, Categories, Numbers, Names, Formulas, and Resources');
				a[DM.summary] = new DataMode(DM.summary, 2000, ' includes: URL, Name, RN, InChIKey, Formula, Weight, 3D flag, MeSH, and Citations');
				a[DM.notes] = new DataMode(DM.notes, 7500);
				a[DM.categories] = new DataMode(DM.categories, 5000);
				a[DM.numbers] = new DataMode(DM.numbers, 2500, ' = Registry Numbers / IDs');
				a[DM.names] = new DataMode(DM.names, 1000, ' = Names / Synonyms');
				a[DM.formulas] = new DataMode(DM.formulas, 4000);
				a[DM.resources] = new DataMode(DM.resources, 1000, ' = Locators / Link Data');
				a[DM.toxicityList] = new DataMode(DM.toxicityList, 2000, ' includes: Organism, Test Type, Route, Dose, Effects, and Journal');
				a[DM.physicalProps] = new DataMode(DM.physicalProps, 5000, ' includes: Property, Value, Units, Temperature and Source');
			a[DM.structure] = new DataMode(DM.structure, 50, ' includes: StructureDetails and Image');
				a[DM.structureDetails] = new DataMode(DM.structureDetails, 90, ' includes: Weight, InChIKey, InChI, SMILES, Mol, and 3D Mol');
					a[DM.weight] = new DataMode(DM.weight, 7000);
					a[DM.inchikey] = new DataMode(DM.inchikey, 5000);
					a[DM.inchi] = new DataMode(DM.inchi, 3000);
					a[DM.smiles] = new DataMode(DM.smiles, 4000);
					a[DM.mol] = new DataMode(DM.mol, 400);
					a[DM.mol3d] = new DataMode(DM.mol3d, 125);
				a[DM.image] = new DataMode(DM.image, 80, ' = png bytes');
		/* tslint:enable:align */
	})();

	static getDataMode(dm :DM) :DataMode {
		return DataMode.DATA_MODES[dm];
	}


// Instance
	constructor(
		readonly dm :DM,
		readonly maxSubstancesPerBatch :number,
		readonly displaySuffix ? :string
	){}

}
