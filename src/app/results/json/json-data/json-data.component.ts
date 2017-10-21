import { Component, Input, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Http, Response } from '@angular/http';

import { DM, DataMode } from '../../../domain/data-mode';
import { Search } from './../../../domain/search';
import { SubstancesResultServerJSON } from '../../../domain/server-json';
import { Totals } from './../../../domain/totals';

import { AppService } from '../../../core/app.service';

import { Logger } from './../../../core/logger';

@Component({
	selector: 'app-json-data',
	templateUrl: './json-data.component.html',
	styleUrls: ['./json-data.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonDataComponent implements OnChanges {
	@Input() search :Search; // Immutable
	@Input() totals :Totals; // Immutable
	@Input() dm :DM; // Immutable

	dataMode :DataMode;
	urls :string[] = [];
	page :number;
	srsj :SubstancesResultServerJSON;

	private priorDm :DM;

	constructor(
		readonly http :Http,
		readonly app :AppService,
		readonly cdr :ChangeDetectorRef
	){}

	/* tslint:disable-next-line:no-any */
	ngOnChanges(changes :any) :void {
		Logger.debug('JsonData.onChanges');
		if(this.priorDm !== this.dm){
			this.page = 1;
			this.priorDm = this.dm;
		}
		this.dataMode = DataMode.getDataMode(this.dm);
		this.urls = this.search.getBatchApiURLs(this.dm, this.totals.substances, this.app.useFieldOperatorAbbreviations);
		this.updateSRSJ();
	}
	onPageChange(page :number) :void {
		Logger.trace('JsonData.onPageChange');
		this.page = page;
		this.updateSRSJ();
	}


	get fetching() :string {
		Logger.trace('JsonData.fetching');
		let s :string = 'Fetching results for data=' + DM[this.dm];
		if(this.urls.length > 1){
			s += ', batch ' + this.page + ' / ' + this.urls.length;
		}
		s += ' ...';
		return s;
	}
	get pageUrl() :string {
		Logger.trace('JsonData.pageUrl');
		return this.urls[this.page - 1];
	}
	get collectionSize() :number {
		Logger.trace('JsonData.collectionSize');
		return this.urls.length;
	}

	private updateSRSJ() :void {
		Logger.trace('JsonData.updateSRSJ');
		this.srsj = undefined;
		const pageUrl :string = this.pageUrl;
		this.http.get(pageUrl)
			.map( (res :Response) => res.json() )
			.subscribe( (srsj :SubstancesResultServerJSON) => {
				if(pageUrl === this.pageUrl){
					this.srsj = srsj;
					Logger.trace('TopMenu oCurrentSearchTotals.subscribe -> markForCheck');
					this.cdr.markForCheck();
				}
			});

	}
}
