import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { DM, DataMode } from './../../domain/data-mode';
@Component({
	selector: 'app-data-mode',
	templateUrl: './data-mode.component.html',
	styleUrls: ['./data-mode.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataModeComponent {
	@Input() dataMode :DataMode; // Immutable

	get dm() :string {
		return DM[this.dataMode.dm];
	}
	get displaySuffix() :string {
		return this.dataMode.displaySuffix || '';
	}
	get maxSubstancesPerBatch() :number {
		return this.dataMode.maxSubstancesPerBatch;
	}
}
