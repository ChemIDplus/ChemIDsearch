export interface ElementMinJSON {
	/** data */
	d :string;
}

/** Immutable */
export abstract class Element {

	constructor(readonly data :string){}

	serialize() :ElementMinJSON {
		const mj :ElementMinJSON = {d:this.data};
		return mj;
	}
}
