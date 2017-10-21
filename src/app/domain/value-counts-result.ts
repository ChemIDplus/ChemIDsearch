import { DataCount, DataCountMinJSON } from './data-count';
import { ExpressionMut, ExpressionMinJSON } from './expression';
import { RNIDName, RNIDNameMinJSON } from './rn-id-name';
import { SearchMut } from './search';
import { Totals, TotalsMinJSON } from './totals';

export interface ValueCountsResultMinJSON{
	t :TotalsMinJSON;
	e ? :ExpressionMinJSON;
	r ? :DataCountMinJSON[];
	a ? :RNIDNameMinJSON[];
}

export class ValueCountsResult {
	constructor(
		public totals :Totals,
		public expression :ExpressionMut,
		public results :DataCount[],
		public alternatives :RNIDName[]
	){}

	get clone() :ValueCountsResult{
		return new ValueCountsResult(this.totals, this.expression && this.expression.clone, this.results && this.results.slice(), this.alternatives && this.alternatives.slice());
	}

// TODO - this is too much duplicated code, as it is mostly the same as auto-complete-result

	serialize(saveExpression :boolean) :ValueCountsResultMinJSON {
		const mj :ValueCountsResultMinJSON = {'t':this.totals.serialize()};
		if(saveExpression && this.expression){
			mj.e = this.expression.serialize();
		}
		if(this.results){
			mj.r = DataCount.serializeArray(this.results);
		}
		if(this.alternatives){
			mj.a = RNIDName.serializeArray(this.alternatives);
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :ValueCountsResultMinJSON) :ValueCountsResult {
		if(mj){
			const totals :Totals = Totals.deserialize(mj.t),
				expression :ExpressionMut = mj.e && ExpressionMut.deserialize(mj.e),
				results :DataCount[] = mj.r && DataCount.deserializeArray(mj.r),
				alternatives :RNIDName[] = mj.a && RNIDName.deserializeArray(mj.a);
			return new ValueCountsResult(totals, expression, results, alternatives);
		}
	}
}

export interface SearchValueCounts {
	search :SearchMut;
	vcr :ValueCountsResult;
}
