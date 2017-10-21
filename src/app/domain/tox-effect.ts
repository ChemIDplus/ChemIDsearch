export interface ToxEffectMinJSON {
	/** systemDesc */
	s ? :string;
	/** toxicDesc */
	t ? :string;
}

/** Immutable */
export class ToxEffect {
	constructor(readonly systemDesc ? :string, readonly toxicDesc ? :string){}

	serialize() :ToxEffectMinJSON {
		const mj :ToxEffectMinJSON = {};
		if(this.systemDesc){
			mj.s = this.systemDesc;
		}
		if(this.toxicDesc){
			mj.t = this.toxicDesc;
		}
		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :ToxEffectMinJSON) :ToxEffect {
		if(mj){
			return new ToxEffect(mj.s, mj.t);
		}
	}

	static serializeArray(array :ReadonlyArray<ToxEffect>) :ToxEffectMinJSON[] {
		if(array){
			const mja :ToxEffectMinJSON[] = [];
			array.forEach( (value :ToxEffect, index :number) => mja[index] = value.serialize() );
			return mja;
		}
	}
	static deserializeArray(mja :ToxEffectMinJSON[]) :ToxEffect[] {
		if(mja){
			const array :ToxEffect[] = [];
			mja.forEach( (mj :ToxEffectMinJSON, index :number) => array[index] = ToxEffect.deserialize(mj) );
			return array;
		}
	}
}
