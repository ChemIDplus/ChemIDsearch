import { Search } from './search';
import { Totals } from './totals';

/** Immutable */
export class SearchTotals {
	readonly valid :boolean;
	constructor(readonly search :Search, readonly totals ? :Totals){
		this.valid = !!totals && totals.foundMatch && !!search && search.hasNonNot;
	}
}
