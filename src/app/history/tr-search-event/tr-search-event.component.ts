import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SearchEvent } from './../../domain/search-event';

import { AppService } from './../../core/app.service';

import { Logger } from './../../core/logger';

/* This component has to output in a TR tag and not a normal component tag, and so we use an attribute selector on a TR instead */
/* tslint:disable:component-selector */
@Component({
	selector: 'tr [app-tr-search-event]',
	templateUrl: './tr-search-event.component.html',
	styleUrls: ['./tr-search-event.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrSearchEventComponent {
	@Input() searchEvent :SearchEvent;
	@Output() private onDelete :EventEmitter<SearchEvent> = new EventEmitter<SearchEvent>();

	constructor(readonly app :AppService, readonly router :Router){}

	get searchDisplay() :string {
		Logger.trace2('TrSearchEventComponent.searchDisplay');
		return this.searchEvent.search.display;
	}
	get values() :number {
		Logger.trace2('TrSearchEventComponent.values');
		return this.searchEvent.totals.values;
	}
	get substances() :number {
		Logger.trace2('TrSearchEventComponent.substances');
		return this.searchEvent.totals.substances;
	}
	get millis() :number {
		Logger.trace2('TrSearchEventComponent.millis');
		return this.searchEvent.millisSinceLastReopened || this.searchEvent.millisSinceFirstRun;
	}
	get inLastDay() :boolean {
		Logger.trace2('TrSearchEventComponent.inLastDay');
		return this.millis >= (Date.now() - 86410000 /* 24*60*60*1000 */);
	}

	run() :void {
		Logger.debug('TrSearchEventComponent.run');
		this.app.navToResults(this.searchEvent.search);
	}
	edit() :void {
		Logger.debug('TrSearchEventComponent.edit');
		this.app.searchForEdit = this.searchEvent.search;
		this.router.navigate(['/']);
	}
	delete() :void {
		Logger.trace('TrSearchEventComponent.delete');
		this.onDelete.emit(this.searchEvent);
	}
}
