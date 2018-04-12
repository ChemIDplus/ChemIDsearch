export interface PhysicalPropMinJSON {
	/** property */
	p :string;
	/** data */
	d ? :number;
	/** data value for some ranges */
	v ? :string;
	/** units */
	u ? :string;
	/** source */
	s :string;
	/** temperature */
	t ? :string;
}

/** Immutable */
export class PhysicalProp {
	constructor(
		readonly property :string,
		readonly data :number,
		readonly value :string,
		readonly units :string,
		readonly source :string,
		readonly temperature ? :string
	){}

	serialize() :PhysicalPropMinJSON {
		const mj :PhysicalPropMinJSON = {'p':this.property, 's':this.source};
		if(this.data !== undefined){
			mj.d = this.data;
		}
		if(this.value !== undefined){
			mj.v = this.value;
		}
		if(this.units !== undefined){
			mj.u = this.units;
		}
		if(this.temperature !== undefined){
			mj.t = this.temperature;
		}

		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :PhysicalPropMinJSON) :PhysicalProp {
		if(mj){
			return new PhysicalProp(mj.p, mj.d, mj.v, mj.u, mj.s, mj.t);
		}
	}

	static serializeArray(array :ReadonlyArray<PhysicalProp>) :PhysicalPropMinJSON[] {
		if(array){
			const mja :PhysicalPropMinJSON[] = [];
			array.forEach( (value :PhysicalProp, index :number) => mja[index] = value.serialize() );
			return mja;
		}
	}
	static deserializeArray(mja :PhysicalPropMinJSON[]) :PhysicalProp[] {
		if(mja){
			const array :PhysicalProp[] = [];
			mja.forEach( (pmj :PhysicalPropMinJSON, index :number) => array[index] = PhysicalProp.deserialize(pmj) );
			return array;
		}
	}

}
