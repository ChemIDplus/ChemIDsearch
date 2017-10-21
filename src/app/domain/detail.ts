import { Element, ElementMinJSON } from './element';

export interface DetailMinJSON extends ElementMinJSON {
	/** sources */
	s ? :ReadonlyArray<string>;
}

/** Immutable */
export class Detail extends Element {

	constructor(data :string, readonly sources ? :ReadonlyArray<string>){
		super(data);
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
