import { SearchTotals } from './../../domain/search-totals';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { AppService } from '../app.service';

import { Logger } from './../logger';

@Component({
	selector: 'app-top-menu',
	templateUrl: './top-menu.component.html',
	styleUrls: ['./top-menu.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent implements OnInit {

	valid :boolean;

	constructor(readonly app :AppService, readonly cdr :ChangeDetectorRef){
		this.valid = this.app.currentSearchTotalsStream.value.valid;
		Logger.debug('TopMenu.constructor valid =', this.valid);
	}
	ngOnInit() :void {
		Logger.debug('TopMenu.onInit');
		this.app.oCurrentSearchTotals.subscribe( (searchTotals :SearchTotals) => {
			this.valid = searchTotals.valid;
			Logger.log('TopMenu oCurrentSearchTotals.subscribe valid =', this.valid);
			Logger.trace('TopMenu oCurrentSearchTotals.subscribe -> markForCheck');
			this.cdr.markForCheck();
		});

	}
}
