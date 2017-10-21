export interface RNIDNameMinJSON {
	/** rn */
	r ? :string;
	/** id */
	i ? :string;
	/** inchikey */
	n :string;
}

/** Immutable */
export class RNIDName {
	constructor(
		readonly rn :string,
		readonly id :string,
		readonly name :string
	){}

	serialize() :RNIDNameMinJSON {
		const mj :RNIDNameMinJSON = {n:this.name};
		if(this.rn){
			mj.r = this.rn;
		}else{
			mj.i = this.id;
		}
		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :RNIDNameMinJSON) :RNIDName {
		if(mj){
			return new RNIDName(mj.r, mj.i, mj.n);
		}
	}

	static serializeArray(array :ReadonlyArray<RNIDName>) :RNIDNameMinJSON[] {
		if(array){
			const mja :RNIDNameMinJSON[] = [];
			array.forEach( (value :RNIDName, index :number) => mja[index] = value.serialize() );
			return mja;
		}
	}
	static deserializeArray(mja :RNIDNameMinJSON[]) :RNIDName[] {
		if(mja){
			const array :RNIDName[] = [];
			mja.forEach( (mj :RNIDNameMinJSON, index :number) => array[index] = RNIDName.deserialize(mj) );
			return array;
		}
	}
}
