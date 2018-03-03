import { EnumEx } from './../util/enum-ex';

export enum Srt{
	similarity,
	lastMod,
	citations,
	id,
	name,
	mesh,
	formula,
	weight,
	has3d,
	inchikey
}

/** Immutable */
export class Sort{

// Static:
	static readonly srts :ReadonlyArray<Srt> = EnumEx.getValues(Srt);

	private static _SORTS :ReadonlyArray<Sort>;

	static _constructor() :void {
		const a :Sort[] = [];
		a[Srt.similarity] = new Sort(Srt.similarity, 'Similarity', false);
		a[Srt.lastMod] = new Sort(Srt.lastMod, 'Last Modified', false);
		a[Srt.citations] = new Sort(Srt.citations, 'Citations', false);
		a[Srt.id] = new Sort(Srt.id, 'RN/System ID', true);
		a[Srt.name] = new Sort(Srt.name, 'Name/Synonym', true);
		a[Srt.mesh] = new Sort(Srt.mesh, 'MeSH', true);
		a[Srt.formula] = new Sort(Srt.formula, 'Formula', true);
		a[Srt.weight] = new Sort(Srt.weight, 'Weight', true);
		a[Srt.has3d] = new Sort(Srt.has3d, 'Has 3D', false);
		a[Srt.inchikey] = new Sort(Srt.inchikey, 'InChIKey', true);
		Sort._SORTS = a;
	}

	static get SORTS() :ReadonlyArray<Sort> {
		return Sort._SORTS;
	}

	static getSort(srt :Srt) :Sort {
		return Sort._SORTS[srt];
	}

	static getDisplay(srt :Srt) :String {
		return Sort.getSort(srt).display;
	}


// Instance:
	constructor(
		readonly srt :Srt,
		readonly display :string,
		readonly normalIsAsc :boolean
	){}
}

/** Immutable */
export class OrderBy{
	constructor(
		readonly sortBy1 ? :Srt,
		readonly sortBy1Reverse ? :boolean,
		readonly sortBy2 ? :Srt,
		readonly sortBy2Reverse ? :boolean
	){}

	get url() :string {
		let url :string = '';
		if(this.sortBy1 !== undefined){
			url += '&sortBy1=' + Srt[this.sortBy1];
			if(this.sortBy1Reverse){
				url += '&sortBy1Reverse=true';
			}
			if(this.sortBy2 !== undefined && this.sortBy1 !== this.sortBy2){
				url += '&sortBy2=' + Srt[this.sortBy2];
				if(this.sortBy2Reverse){
					url += '&sortBy2Reverse=true';
				}
			}
		}
		return url;
	}
}

Sort._constructor();
