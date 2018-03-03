/* tslint:disable-next-line:interface-name */
export interface IDSimilarityMinJSON {
	/** id */
	i :string;
	/** similarity */
	s ? :number;
}

/** Immutable */
export class IDSimilarity {
	constructor(readonly id :string, readonly similarity ? :number){}

	serialize() :IDSimilarityMinJSON {
		const mj :IDSimilarityMinJSON = {i:this.id};
		if(this.similarity){
			mj.s = this.similarity;
		}
		return mj;
	}
	/* tslint:disable:member-ordering */
	static deserialize(mj :IDSimilarityMinJSON) :IDSimilarity {
		if(mj){
			return new IDSimilarity(mj.i, mj.s);
		}
	}

	static serializeArray(array :ReadonlyArray<IDSimilarity>) :IDSimilarityMinJSON[] {
		if(array){
			const mja :IDSimilarityMinJSON[] = [];
			array.forEach( (value :IDSimilarity, index :number) => mja[index] = value.serialize() );
			return mja;
		}
	}
	static deserializeArray(mja :IDSimilarityMinJSON[]) :IDSimilarity[] {
		if(mja){
			const array :IDSimilarity[] = [];
			mja.forEach( (mj :IDSimilarityMinJSON, index :number) => array[index] = IDSimilarity.deserialize(mj) );
			return array;
		}
	}

}
