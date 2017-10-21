import { DataCount, DataCountMinJSON } from './data-count';
import { ExpressionMinJSON, ExpressionMut } from './expression';
import { RNIDName, RNIDNameMinJSON } from './rn-id-name';
import { Totals, TotalsMinJSON } from './totals';

export interface AutoCompleteResultMinJSON{
	t :TotalsMinJSON;
	e ? :ExpressionMinJSON;
	r ? :DataCountMinJSON[];
	a ? :RNIDNameMinJSON[];
}

export class AutoCompleteResult {

	constructor(
		public totals :Totals,
		public expression :ExpressionMut,
		public results :DataCount[],
		public alternatives :RNIDName[]
	){}

	get totalsComplete() :boolean{
		return this.totals.substances >= 0 && this.totals.values >= 0;
	}


// TODO - this is too much duplicated code, as it is mostly the same as value-counts-result

	serialize(saveExpression :boolean) :AutoCompleteResultMinJSON {
		const mj :AutoCompleteResultMinJSON = {'t':this.totals.serialize()};
		if(saveExpression && this.expression){
			mj.e = this.expression.serialize();
		}
		if(this.results){
			mj.r = [];
			mj.r = DataCount.serializeArray(this.results);
		}
		if(this.alternatives){
			mj.a = RNIDName.serializeArray(this.alternatives);
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :AutoCompleteResultMinJSON) :AutoCompleteResult {
		if(mj){
			const totals :Totals = Totals.deserialize(mj.t),
				expression :ExpressionMut = mj.e && ExpressionMut.deserialize(mj.e),
				results :DataCount[] = mj.r && DataCount.deserializeArray(mj.r),
				alternatives :RNIDName[] = mj.a && RNIDName.deserializeArray(mj.a);
			return new AutoCompleteResult(totals, expression, results, alternatives);
		}
	}

}
