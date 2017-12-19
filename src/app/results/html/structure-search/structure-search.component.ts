import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Summary } from './../../../domain/summary';

import { Logger } from './../../../core/logger';

@Component({
	selector: 'app-structure-search',
	templateUrl: './structure-search.component.html',
	styleUrls: ['./structure-search.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureSearchComponent {
	@Input() readonly summary :Summary; // Immutable
	@Input() readonly linkSimPercent :number;

	get has3D() :boolean {
		Logger.trace2('structureSearch.has3D');
		return this.summary.has3D;
	}
	get rn_id() :string {
		Logger.trace2('structureSearch.rn_id');
		return this.summary.rn_id;
	}

}
