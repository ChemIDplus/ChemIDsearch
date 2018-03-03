import { ToxDose, ToxDoseMinJSON } from './tox-dose';
import { ToxEffect, ToxEffectMinJSON } from './tox-effect';
import { ToxJournal, ToxJournalMinJSON } from './tox-journal';

import { Logger } from './../core/logger';

export interface ToxicityMinJSON {
	/** organism */
	o :string;
	/** testType */
	t :string;
	/** route */
	r :string;
	/** dose */
	d :ToxDoseMinJSON;
	/** journal */
	j :ToxJournalMinJSON;
	/** effects */
	e ? :ToxEffectMinJSON[];
}

/** Immutable */
export class Toxicity {

	private _doseReported :string;
	private _doseNormalized :string;

	constructor(
		readonly organism :string,
		readonly testType :string,
		readonly route :string,
		readonly dose :ToxDose,
		readonly journal :ToxJournal,
		readonly effectList ? :ReadonlyArray<ToxEffect>
	){}

	get doseReported() :string {
		Logger.trace2('Toxicity.doseReported');
		if(!this._doseReported){
			const dose :ToxDose = this.dose;
			this._doseReported = (dose.modifier ? dose.modifier + ' ' : '') + dose.reported + ' ' + dose.reportedUnits;
		}
		return this._doseReported;
	}
	get doseNormalized() :string {
		Logger.trace2('Toxicity.doseNormalized');
		if(!this._doseNormalized){
			const dose :ToxDose = this.dose;
			if(dose.normalized !== undefined || dose.normalizedUnits){
				this._doseNormalized = '(' + (dose.normalized !== undefined ? dose.normalized : dose.reported) + ' ' + (dose.normalizedUnits || dose.reportedUnits) + ')';
			}
		}
		return this._doseNormalized;
	}

	serialize() :ToxicityMinJSON {
		const mj :ToxicityMinJSON = {'o': this.organism, 't': this.testType, 'r': this.route, 'd': this.dose.serialize(), 'j': this.journal.serialize()};
		if(this.effectList){
			mj.e = ToxEffect.serializeArray(this.effectList);
		}
		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :ToxicityMinJSON) :Toxicity {
		if(mj){
			const dose :ToxDose = ToxDose.deserialize(mj.d),
				journal :ToxJournal = ToxJournal.deserialize(mj.j);
			let effectList :ToxEffect[];
			if(mj.e){
				effectList = ToxEffect.deserializeArray(mj.e);
			}
			return new Toxicity(mj.o, mj.t, mj.r, dose, journal, effectList);
		}
	}

	static serializeArray(array :ReadonlyArray<Toxicity>) :ToxicityMinJSON[] {
		if(array){
			const mja :ToxicityMinJSON[] = [];
			array.forEach( (value :Toxicity, index :number) => mja[index] = value.serialize() );
			return mja;
		}
	}
	static deserializeArray(mja :ToxicityMinJSON[]) :Toxicity[] {
		if(mja){
			const array :Toxicity[] = [];
			mja.forEach( (mj :ToxicityMinJSON, index :number) => array[index] = Toxicity.deserialize(mj) );
			return array;
		}
	}

}
