import { Element, ElementMinJSON } from './element';

export interface DetailMinJSON extends ElementMinJSON {
	/** sources */
	s ? :ReadonlyArray<string>;
}

/** Immutable */
export class Detail extends Element {

	// readonly sourcesDisplay :string; // Causes "Type 'Detail' cannot be converted to type 'T'." in server-json.ts
		// The error apparently occurs when trying to use generics and inheritance with classes where one or more member properties are not in the constructor;
		// get method() "properties" also cause the error.
		// Even non getter methods cause the error. Not sure what is going on!

	/**
	 * @param sourcesDisplay Param ignored and member's value generated from sources param instead. Adding this member within the constructor to avoid the issue with generics and inheritance.
	 */
	constructor(data :string, readonly sources ? :ReadonlyArray<string>, readonly sourcesDisplay ? :string){
		super(data);
		this.sourcesDisplay = (sources ? sources.join(', ') : undefined);
	}

	serialize() :DetailMinJSON {
		const mj :DetailMinJSON = super.serialize();
		if(this.sources){
			mj.s = this.sources;
		}
		return mj;
	}
	/* tslint:disable-next-line:member-ordering */
	static deserialize(mj :DetailMinJSON) :Detail {
		if(mj){
			return new Detail(mj.d, mj.s);
		}
	}
}
