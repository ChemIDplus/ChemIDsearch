import { StructureDetails, StructureDetailsMinJSON } from './structure-details';

import { Logger } from './../core/logger';

export interface StructureMinJSON {
	/** details */
	d ? :StructureDetailsMinJSON;
	/** image = png Base64 byte[] */
	i ? :string;
}

/** Immutable */
export class Structure {
	constructor(
		readonly details ? :StructureDetails,
		/** png Base64 byte[] */
		readonly image ? :string
	){
		Logger.trace('GENERATED IMMUTABLE Structure'/*, this */);
	}

	/** Prefers own values over arguments'. Returns this if argument doesn't have anything to add. */
	mergeMissing(s :Structure) :Structure {
		if(!s){
			return this;
		}
		const details :StructureDetails = !this.details ? s.details : this.details.mergeMissing(s.details),
			image :string = this.image || s.image;
		if(details === this.details && image === this.image){
			return this;
		}else{
			Logger.log('Structure.mergeMissing merging differences');
			return new Structure(details, image);
		}
	}

	serialize() :StructureMinJSON {
		const mj :StructureMinJSON = {};
		if(this.details){
			mj.d = this.details.serialize();
		}
		if(this.image){
			mj.i = this.image;
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :StructureMinJSON) :Structure {
		if(mj){
			return new Structure(StructureDetails.deserialize(mj.d), mj.i);
		}
	}
}
