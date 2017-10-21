import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { DM, DataMode } from '../../domain/data-mode';
import { Search } from '../../domain/search';
import { TotalsServerJSON } from '../../domain/server-json';
import { Totals } from '../../domain/totals';

import { AppService } from '../../core/app.service';

import { EnvService } from '../../core/env.service';

import { Logger } from './../../core/logger';

@Component({
	selector: 'app-json',
	templateUrl: './json.component.html',
	styleUrls: ['./json.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonComponent implements OnInit {
	@Input() search :Search; // Immutable
	@Input() totals :Totals; // Immutable

	tsj :TotalsServerJSON;
	dm :DM = DM.summary;

	constructor(
		readonly app :AppService,
		readonly env :EnvService){}

	ngOnInit() :void {
		Logger.debug('JsonComponent.onInit');

		this.tsj = {};
		if(this.totals.substances >= 0){
			this.tsj.substances = this.totals.substances;
		}
		if(this.totals.values >= 0){
			this.tsj.values = this.totals.values;
		}
	}

	get dataModes() :DataMode[] {
		return DataMode.DMs
			.filter( (dm :DM) => dm !== DM.totals && dm !== DM.valueCounts)
			.map( (dm :DM) => DataMode.getDataMode(dm) );
	}
	get totalsURL() :string {
		return this.env.apiURL + (this.app.useFieldOperatorAbbreviations ? this.search.totalsURL : this.search.totalsURLNoAbbr);
	}


}
