import { Search } from './search';
import { OrderBy } from './sort';
import { SubstancesResult } from './substances-result';

/** Immutable */
export class Paging{
	constructor(
		readonly rowStart ? :number,
		readonly pageSize ? :number,
		readonly batchStart ? :number,
		activePage ? :number
	){
		if(activePage){
			this.rowStart = ((activePage - 1) * pageSize) + 1;
		}
	}
	get url() :string {
		let url :string = '';
		if(this.rowStart){
			url += '&rowStart=' + this.rowStart;
			if(this.pageSize){
				url += '&pageSize=' + this.pageSize;
			}
		}else if(this.batchStart){
			url += '&batchStart=' + this.batchStart;
		}
		return url;
	}
	get activePage() :number{
		return ((this.rowStart - 1) / this.pageSize) + 1;
	}
}

/** Immutable */
export class PagedSearch{
	constructor(
		readonly search :Search,
		readonly total :number,
		readonly orderBy ? :OrderBy,
		readonly paging ? :Paging
	){}
	get summariesURL() :string{
		let url :string = this.search.summariesURL;
		if(this.total > 1 || this.total === undefined){
			if(this.orderBy){
				url += this.orderBy.url;
			}
			if(this.paging){
				url += this.paging.url;
			}
		}
		return url;
	}
}

/** Immutable */
export class PagedSearchSubstancesResult {
	constructor(readonly pagedSearch :PagedSearch, readonly substancesResult :SubstancesResult){}
}
