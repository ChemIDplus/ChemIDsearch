import { DecimalPipe } from '@angular/common';

export interface TotalsMinJSON{
	s ? :number;
	v ? :number;
}

/** Immutable */
export class Totals {

	private _matchesValuesInSubstances :string;

	constructor(readonly substances ? :number, readonly values ? :number){}

	get foundMatch() :boolean {
		return this.substances >= 1 || this.values >= 1;
	}
	getMatchesValuesInSubstances(expressionCount :number) :string {
		if(!this._matchesValuesInSubstances){
			const decimalPipe :DecimalPipe = new DecimalPipe('en-US');
			let s :string = '';
			if(this.values >= 0 || this.substances >= 0){
				s = ' match';
				if(expressionCount === 1){
					s += 'es';
				}
				s += ' ';
				if(this.values >= 0){
					s += decimalPipe.transform(this.values) + ' value' + (this.values !== 1 ? 's' : '');
					if(this.substances >= 0){
						s += ' in ';
					}
				}
				if(this.substances >= 0){
					s += decimalPipe.transform(this.substances) + ' substance' + (this.substances !== 1 ? 's' : '');
				}
			}
			this._matchesValuesInSubstances = s;
		}
		return this._matchesValuesInSubstances;
	}

	serialize() :TotalsMinJSON {
		const mj :TotalsMinJSON = {};
		if(this.substances !== undefined){
			mj.s = this.substances;
		}
		if(this.values !== undefined){
			mj.v = this.values;
		}
		return mj;
	}
	/* tslint:disable-next-line:member-ordering */
	static deserialize(mj :TotalsMinJSON) :Totals {
		if(mj){
			return new Totals(mj.s, mj.v);
		}
	}
}
