import { Detail, DetailMinJSON } from './detail';
import { IDInchikey } from './id-inchikey';
import { Resource, ResourceMinJSON } from './resource';
import { PhysicalProp, PhysicalPropMinJSON } from './physical-prop';
import { TypeElements, TypeElementsMinJSON } from './type-elements';
import { Toxicity, ToxicityMinJSON } from './toxicity';
import { Summary, SummaryMinJSON } from './summary';
import { Structure } from './structure';

import { Logger } from './../core/logger';

export interface SubstanceMinJSON {
	id :string;
	/** lastMod */
	l ? :Date;
	/** summary */
	s ? :SummaryMinJSON;
	/** notes */
	no ? :TypeElementsMinJSON<DetailMinJSON>[];
	/** categories */
	c ? :TypeElementsMinJSON<DetailMinJSON>[];
	/** numbers */
	nu ? :TypeElementsMinJSON<DetailMinJSON>[];
	/** names */
	na ? :TypeElementsMinJSON<DetailMinJSON>[];
	/** formulas */
	f ? :TypeElementsMinJSON<DetailMinJSON>[];
	/** resources */
	r ? :TypeElementsMinJSON<ResourceMinJSON>[];
	/** toxicityList */
	t ? :ToxicityMinJSON[];
	/** physicalProps */
	p ? :PhysicalPropMinJSON[];

	// structure serialized separately
}


/** Immutable */
export class Substance {

	/* tslint:disable-next-line:variable-name */
	readonly rn_id :string;
	readonly idik :IDInchikey;

	constructor(
		readonly id :string,
		readonly lastMod ? :Date,
		readonly summary ? :Summary,
		readonly notes ? :ReadonlyArray<TypeElements<Detail>>,
		readonly categories ? :ReadonlyArray<TypeElements<Detail>>,
		readonly numbers ? :ReadonlyArray<TypeElements<Detail>>,
		readonly names ? :ReadonlyArray<TypeElements<Detail>>,
		readonly formulas ? :ReadonlyArray<TypeElements<Detail>>,
		readonly resources ? :ReadonlyArray<TypeElements<Resource>>,
		readonly toxicityList ? :ReadonlyArray<Toxicity>,
		readonly physicalProps ? :ReadonlyArray<PhysicalProp>,
		readonly structure ? :Structure
	){
		this.rn_id = (this.summary && this.summary.rn) || this.id;
		this.idik = new IDInchikey(this.id, (this.summary && this.summary.inchikey) || (this.structure && this.structure.details && this.structure.details.inchikey));
		Logger.trace('GENERATED IMMUTABLE Substance'/*, this */);
	}

	/** Prefers own values over arguments'. Returns this if argument doesn't have anything to add. */
	mergeMissing(s :Substance) :Substance {
		if(!s){
			return this;
		}else{
			const structure :Structure = !this.structure ? s.structure : this.structure.mergeMissing(s.structure);
			if(
				(this.lastMod || !s.lastMod) &&
				(this.summary || !s.summary) &&
				(this.notes || !s.notes) &&
				(this.categories || !s.categories) &&
				(this.numbers || !s.numbers) &&
				(this.names || !s.names) &&
				(this.formulas || !s.formulas) &&
				(this.resources || !s.resources) &&
				(this.toxicityList || !s.toxicityList) &&
				(this.physicalProps || !s.physicalProps) &&
				(this.structure === structure)
			){
				return this;
			}else{
				Logger.log('Substance.mergeMissing merging differences');
				return new Substance(
					this.id,
					/* use the oldest date */
					this.lastMod && s.lastMod
						? this.lastMod < s.lastMod ? this.lastMod : s.lastMod
						: this.lastMod || s.lastMod,
					this.summary || s.summary,
					this.notes || s.notes,
					this.categories || s.categories,
					this.numbers || s.numbers,
					this.names || s.names,
					this.formulas || s.formulas,
					this.resources || s.resources,
					this.toxicityList || s.toxicityList,
					this.physicalProps || s.physicalProps,
					structure
				);
			}
		}
	}
	/** Prefers own values over argument's. Returns this if argument doesn't have anything to add. */
	mergeMissingStructure(s :Structure) :Substance {
		if(!s){
			return this;
		}else{
			const structure :Structure = !this.structure ? s : this.structure.mergeMissing(s);
			if(structure === this.structure){
				return this;
			}
			return new Substance(
				this.id,
				this.lastMod,
				this.summary,
				this.notes,
				this.categories,
				this.numbers,
				this.names,
				this.formulas,
				this.resources,
				this.toxicityList,
				this.physicalProps,
				structure
			);
		}
	}
	serialize() :SubstanceMinJSON {
		const mj :SubstanceMinJSON = {'id':this.id};
		if(this.lastMod){
			mj.l = this.lastMod;
		}
		if(this.summary){
			mj.s = this.summary.serialize();
		}
		if(this.notes){
			mj.no = TypeElements.serializeTypeElementsArray<Detail, DetailMinJSON>(this.notes);
		}
		if(this.categories){
			mj.c = TypeElements.serializeTypeElementsArray<Detail, DetailMinJSON>(this.categories);
		}
		if(this.numbers){
			mj.nu = TypeElements.serializeTypeElementsArray<Detail, DetailMinJSON>(this.numbers);
		}
		if(this.names){
			mj.na = TypeElements.serializeTypeElementsArray<Detail, DetailMinJSON>(this.names);
		}
		if(this.formulas){
			mj.f = TypeElements.serializeTypeElementsArray<Detail, DetailMinJSON>(this.formulas);
		}
		if(this.resources){
			mj.r = TypeElements.serializeTypeElementsArray<Resource, ResourceMinJSON>(this.resources);
		}
		if(this.toxicityList){
			mj.t = Toxicity.serializeArray(this.toxicityList);
		}
		if(this.physicalProps){
			mj.p = PhysicalProp.serializeArray(this.physicalProps);
		}
		// structure serialized separately
		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :SubstanceMinJSON) :Substance {
		if(mj){
			let summary :Summary,
				notes :TypeElements<Detail>[],
				categories :TypeElements<Detail>[],
				names :TypeElements<Detail>[],
				numbers :TypeElements<Detail>[],
				formulas :TypeElements<Detail>[],
				resources :TypeElements<Resource>[],
				toxicityList :Toxicity[],
				physicalProps :PhysicalProp[]
				;
			if(mj.s){
				summary = Summary.deserialize(mj.s);
			}
			if(mj.no){
				notes = TypeElements.deserializeTypeElementsArray<Detail, DetailMinJSON>(mj.no);
			}
			if(mj.c){
				categories = TypeElements.deserializeTypeElementsArray<Detail, DetailMinJSON>(mj.c);
			}
			if(mj.nu){
				numbers = TypeElements.deserializeTypeElementsArray<Detail, DetailMinJSON>(mj.nu);
			}
			if(mj.na){
				names = TypeElements.deserializeTypeElementsArray<Detail, DetailMinJSON>(mj.na);
			}
			if(mj.f){
				formulas = TypeElements.deserializeTypeElementsArray<Detail, DetailMinJSON>(mj.f);
			}
			if(mj.r){
				resources = TypeElements.deserializeTypeElementsArray<Detail, DetailMinJSON>(mj.r);
			}
			if(mj.t){
				toxicityList = Toxicity.deserializeArray(mj.t);
			}
			if(mj.p){
				physicalProps = PhysicalProp.deserializeArray(mj.p);
			}

			return new Substance(mj.id, mj.l, summary, notes, categories, numbers, names, formulas, resources, toxicityList, physicalProps /* structure serialized separately */);
		}
	}

	static serializeArray(array :ReadonlyArray<Substance>) :SubstanceMinJSON[] {
		if(array){
			const mja :SubstanceMinJSON[] = [];
			array.forEach( (value :Substance, index :number) => mja[index] = value.serialize() );
			return mja;
		}
	}
	static deserializeArray(mja :SubstanceMinJSON[]) :Substance[] {
		if(mja){
			const array :Substance[] = [];
			mja.forEach( (mj :SubstanceMinJSON, index :number) => array[index] = Substance.deserialize(mj) );
			return array;
		}
	}

}
