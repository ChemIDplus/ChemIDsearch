import { Logger } from './../core/logger';

export interface StructureDetailsMinJSON {
	/** weight */
	w ? :number;
	/** inchikey */
	ik ? :string;
	/** inchi */
	i ? :string;
	/** smiles */
	s ? :string;
	/** mol */
	m ? :string;
	/** mol3d */
	m3 ? :string;
}

/** Immutable */
export class StructureDetails {
	constructor(
			readonly weight ? :number,
			readonly inchikey ? :string,
			readonly inchi ? :string,
			readonly smiles ? :string,
			readonly mol ? :string,
			readonly mol3d ? :string){}

	/** Prefers own values over arguments'. Returns this if argument doesn't have anything to add. */
	mergeMissing(sd :StructureDetails) :StructureDetails {
		if(!sd || (
			(this.weight || !sd.weight) &&
			(this.inchikey || !sd.inchikey) &&
			(this.inchi || !sd.inchi) &&
			(this.smiles || !sd.smiles) &&
			(this.mol || !sd.mol) &&
			(this.mol3d || !sd.mol3d)
		)){
			return this;
		}else{
			Logger.log('StructureDetails.mergeMissing merging differences');
			return new StructureDetails(
				this.weight || sd.weight,
				this.inchikey || sd.inchikey,
				this.inchi || sd.inchi,
				this.smiles || sd.smiles,
				this.mol || sd.mol,
				this.mol3d || sd.mol3d
			);
		}
	}
	serialize() :StructureDetailsMinJSON {
		const mj :StructureDetailsMinJSON = {};
		if(this.weight){
			mj.w = this.weight;
		}
		if(this.inchikey){
			mj.ik = this.inchikey;
		}
		if(this.inchi){
			mj.i = this.inchi;
		}
		if(this.smiles){
			mj.s = this.smiles;
		}
		if(this.mol){
			mj.m = this.mol;
		}
		if(this.mol3d){
			mj.m3 = this.mol3d;
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :StructureDetailsMinJSON) :StructureDetails {
		if(mj){
			return new StructureDetails(mj.w, mj.ik, mj.i, mj.s, mj.m, mj.m3);
		}
	}
}
