import { Component, OnChanges, Input, ChangeDetectionStrategy } from '@angular/core';

import { Search } from './../../domain/search';
import { Totals } from './../../domain/totals';

import { SearchService } from './../../core/search.service';

import { Logger } from './../../core/logger';

@Component({
	selector: 'app-criteria',
	templateUrl: './criteria.component.html',
	styleUrls: ['./criteria.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CriteriaComponent implements OnChanges {
	@Input() totals :Totals; // Immutable
	@Input() search :Search; // Immutable
	@Input() expressionCount :number;

	matchesTotalValuesInTotalSubstances :string = '';

	constructor(readonly searchService :SearchService){}

	ngOnChanges() :void {
		Logger.debug('Criteria.onChanges'/*, this.totals*/);
		this.matchesTotalValuesInTotalSubstances = SearchService.getMatchesValuesInSubstances(this.totals, this.expressionCount);
	}

	get criteria() :string {
		return this.search ? this.search.display : ('Expression' + (this.expressionCount === 1 ? '' : 's'));
	}

}
