export interface ToxDoseMinJSON {
	/** reported */
	r :string;
	/** reportedUnits */
	u :string;
	/** modifier */
	m ? :string;
	/** normalized */
	n ? :string;
	/** normalizedUnits */
	nu ? :string;
}

/** Immutable */
export class ToxDose {
	constructor(
		readonly reported :string,
		readonly reportedUnits :string,
		readonly modifier ? :string,
		readonly normalized ? :string,
		readonly normalizedUnits ? :string
	){}

	serialize() :ToxDoseMinJSON {
		const mj :ToxDoseMinJSON = {'r':this.reported, 'u':this.reportedUnits};
		if(this.modifier){
			mj.m = this.modifier;
		}
		if(this.normalized){
			mj.n = this.normalized;
		}
		if(this.normalizedUnits){
			mj.nu = this.normalizedUnits;
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :ToxDoseMinJSON) :ToxDose {
		if(mj){
			return new ToxDose(mj.r, mj.u, mj.m, mj.n, mj.nu);
		}
	}
}
