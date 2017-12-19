import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Structure } from '../../../domain/structure';
import { StructureDetails } from '../../../domain/structure-details';
import { Summary } from '../../../domain/summary';

import { Logger } from './../../../core/logger';

@Component({
	selector: 'app-structure',
	templateUrl: './structure.component.html',
	styleUrls: ['./structure.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureComponent {
	@Input() structure :Structure; // Immutable
	@Input() summary :Summary; // Immutable

	get details() :StructureDetails {
		Logger.log('Structure.details');
		return this.structure.details;
	}
	get bytes() :string {
		Logger.log('Structure.bytes');
		return this.structure.image;
	}

}
