import { Totals } from './totals';
import { Search } from './search';
/** Immutable */
export class SearchTotals {
	readonly valid :boolean;
	constructor(readonly search :Search, readonly totals ? :Totals){
		this.valid = !!totals && totals.foundMatch && !!search && search.hasNonNot;
	}
}
