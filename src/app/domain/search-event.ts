import { Search } from './search';
import { Totals, TotalsMinJSON } from './totals';

import { Logger } from './../core/logger';

export interface SearchEventMinJSON {
	/** search url */
	s :string;
	/** totals */
	t :TotalsMinJSON;
	/** date first executed with same totals */
	f :number;
	/** date last re-opened with same totals */
	l ? :number;
}
/** Immutable */
export class SearchEvent {

	constructor(
		readonly search :Search,
		readonly totals :Totals,
		/** first time executed where it returned this totals' substances count */
		readonly millisSinceFirstRun :number,
		/** may not have been re-executed, may just have come from cache */
		readonly millisSinceLastReopened ? :number
	){}

	get searchDisplay() :string {
		Logger.trace2('SearchEvent.searchDisplay');
		return this.search.display;
	}
	get values() :number {
		Logger.trace2('SearchEvent.values');
		return this.totals.values;
	}
	get substances() :number {
		Logger.trace2('SearchEvent.substances');
		return this.totals.substances;
	}
	get millis() :number {
		Logger.trace2('SearchEvent.millis');
		return this.millisSinceLastReopened || this.millisSinceFirstRun;
	}
	get inLastDay() :boolean {
		Logger.trace2('SearchEvent.inLastDay');
		return this.millis >= (Date.now() - 86410000 /* 24*60*60*1000 */);
	}

	serialize() :SearchEventMinJSON {
		const mj :SearchEventMinJSON = {'s':this.search.url, 't':this.totals && this.totals.serialize(), 'f':this.millisSinceFirstRun};
		if(this.millisSinceLastReopened){
			mj.l = this.millisSinceLastReopened;
		}
		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :SearchEventMinJSON) :SearchEvent {
		if(mj){
			return new SearchEvent(Search.deserializeURL(mj.s), Totals.deserialize(mj.t), mj.f, mj.l);
		}
	}

	static serializeArray(array :ReadonlyArray<SearchEvent>) :SearchEventMinJSON[] {
		if(array){
			const mja :SearchEventMinJSON[] = [];
			array.forEach( (value :SearchEvent, index :number) => mja[index] = value.serialize() );
			return mja;
		}
	}
	static deserializeArray(mja :SearchEventMinJSON[]) :SearchEvent[] {
		if(mja){
			const array :SearchEvent[] = [];
			mja.forEach( (mj :SearchEventMinJSON, index :number) => array[index] = SearchEvent.deserialize(mj) );
			return array;
		}
	}
}
