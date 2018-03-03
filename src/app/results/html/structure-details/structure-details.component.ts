import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { StructureDetails } from './../../../domain/structure-details';

import { Logger } from './../../../core/logger';

@Component({
	selector: 'app-structure-details',
	templateUrl: './structure-details.component.html',
	styleUrls: ['./structure-details.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureDetailsComponent {
	@Input() details :StructureDetails; // Immutable

	get weight() :number {
		Logger.trace('StructureDetails.weight');
		return this.details.weight;
	}
	get inchikey() :string {
		Logger.trace('StructureDetails.inchikey');
		return this.details.inchikey;
	}
	get inchi() :string {
		Logger.trace('StructureDetails.inchi');
		return this.details.inchi;
	}
	get smiles() :string {
		Logger.trace('StructureDetails.smiles');
		return this.details.smiles;
	}
	get mol() :string {
		Logger.trace('StructureDetails.mol');
		return this.details.mol;
	}
	get mol3d() :string {
		Logger.trace('StructureDetails.mol3d');
		return this.details.mol3d;
	}
}
