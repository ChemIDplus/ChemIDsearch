import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Summary } from './../../../domain/summary';

import { AppService } from './../../../core/app.service';

import { Logger } from './../../../core/logger';

@Component({
	selector: 'app-structure-search',
	templateUrl: './structure-search.component.html',
	styleUrls: ['./structure-search.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureSearchComponent {
	@Input() readonly summary :Summary; // Immutable
	@Input() set linkSimPercent(linkSimPercent :number) {
		if(linkSimPercent !== undefined){
			this._linkSimPercent = linkSimPercent;
		}else{
			this.needsLinkSimPercent = true;
			this._linkSimPercent = this.app.simPercent;
		}
	}
	get linkSimPercent() :number {
		return this._linkSimPercent;
	}

	needsLinkSimPercent :boolean = false;

	private _linkSimPercent :number;

	constructor(readonly app :AppService){}

	get has3D() :boolean {
		Logger.trace2('structureSearch.has3D');
		return this.summary.has3D;
	}
	get rn_id() :string {
		Logger.trace2('structureSearch.rn_id');
		return this.summary.rn_id;
	}

}
