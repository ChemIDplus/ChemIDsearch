export interface DataCountMinJSON {
	s ? :number;
	d :string;
	v ? :number;
}

/** Immutable */
export class DataCount {
	constructor(readonly substances :number, readonly data :string){}

	serialize() :DataCountMinJSON {
		const mj :DataCountMinJSON = {d:this.data};
		if(this.substances !== 1){
			mj.s = this.substances;
		}
		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :DataCountMinJSON) :DataCount {
		if(mj){
			if(mj.v){
				/* tslint:disable-next-line:no-use-before-declare */
				return new DataCountGroup(mj.d, mj.v);
			}else{
				return new DataCount(mj.s || 1, mj.d);
			}
		}
	}

	static serializeArray(array :ReadonlyArray<DataCount>) :DataCountMinJSON[] {
		if(array){
			const mja :DataCountMinJSON[] = [];
			array.forEach( (value :DataCount, index :number) => mja[index] = value.serialize() );
			return mja;
		}
	}
	static deserializeArray(mja :DataCountMinJSON[]) :DataCount[] {
		if(mja){
			const array :DataCount[] = [];
			mja.forEach( (mj :DataCountMinJSON, index :number) => array[index] = DataCount.deserialize(mj) );
			return array;
		}
	}
}

/** Immutable */
export class DataCountGroup extends DataCount {
	constructor(readonly data :string, readonly values :number){
		super(-1, data);
	}
	serialize() :DataCountMinJSON {
		return {d:this.data, v:this.values};
	}
}
