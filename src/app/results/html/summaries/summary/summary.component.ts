import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';

import { Structure } from './../../../../domain/structure';
import { Substance } from './../../../../domain/substance';
import { Summary } from './../../../../domain/summary';

import { AppService } from './../../../../core/app.service';

import { Logger } from './../../../../core/logger';

@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnChanges {
	@Input() substance :Substance;
	@Input() similarity :number;
	@Input() linkSimPercent :number;
	@Input() structuresView :boolean;

	structure :Structure;
	private summary :Summary;

	constructor(readonly app :AppService){
		Logger.log('SummaryComponent.constructor');
	}

	ngOnChanges() :void {
		this.summary = this.substance.summary;
		this.structure = this.substance.structure;
	}

	get image() :string {
		Logger.trace2('SummaryComponent.image');
		return this.structure.image;
	}

	get routerLink() :string[] {
		Logger.trace2('SummaryComponent.routerLink');
		return this.summary.routerLink;
	}
	get name() :string {
		Logger.trace2('SummaryComponent.name');
		return this.summary.name;
	}
	get rn() :string {
		Logger.trace2('SummaryComponent.rn');
		return this.summary.rn;
	}
	get mesh() :string {
		Logger.trace2('SummaryComponent.mesh');
		return this.summary.mesh;
	}
	get citations() :number {
		Logger.trace2('SummaryComponent.citations');
		return this.summary.citations;
	}
	get formula() :string {
		Logger.trace2('SummaryComponent.formula');
		return this.summary.formula;
	}
	get weight() :number {
		Logger.trace2('SummaryComponent.weight');
		return this.summary.weight;
	}
	get inchikey() :string {
		Logger.trace2('SummaryComponent.inchikey');
		return this.summary.inchikey;
	}
	get rn_id() :string {
		Logger.trace2('SummaryComponent.rn_id');
		return this.summary.rn_id;
	}
	get has3D() :boolean {
		Logger.trace2('SummaryComponent.has3D');
		return this.summary.has3D;
	}

	onRequestSubstance() :void {
		Logger.debug('SummaryComponent.onRequestSubstance');
		this.app.routingSubstanceInSearch = true;
	}

}
