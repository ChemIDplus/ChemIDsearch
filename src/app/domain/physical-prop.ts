export interface PhysicalPropMinJSON {
	/** property */
	p :string;
	/** value */
	v :string;
	/** units */
	u :string;
	/** source */
	s :string;
	/** temperature */
	t ? :string;
}

/** Immutable */
export class PhysicalProp {
	constructor(
		readonly property :string,
		readonly value :string,
		readonly units :string,
		readonly source :string,
		readonly temperature ? :string
	){}

	serialize() :PhysicalPropMinJSON {
		const mj :PhysicalPropMinJSON = {'p':this.property, 'v':this.value, 'u':this.units, 's':this.source};
		if(this.temperature){
			mj.t = this.temperature;
		}

		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :PhysicalPropMinJSON) :PhysicalProp {
		if(mj){
			return new PhysicalProp(mj.p, mj.v, mj.u, mj.s, mj.t);
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
