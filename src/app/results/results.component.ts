import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RM } from './../domain/result-mode';
import { Search } from './../domain/search';
import { SearchTotals } from './../domain/search-totals';
import { Totals } from './../domain/totals';
import { ViewMode } from './../domain/view-mode';

import { AppService } from './../core/app.service';
import { SearchService } from './../core/search.service';

import { Logger } from './../core/logger';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent implements OnInit, OnDestroy {

	private _search :Search;
	private _totals :Totals;

	private readonly subscriptions :Subscription[] = [];
	private viewMode :ViewMode;

	constructor(
		readonly route :ActivatedRoute,
		readonly app :AppService,
		readonly searchService :SearchService,
		readonly cdr :ChangeDetectorRef){}

	ngOnInit() :void {
		Logger.debug('Results.onInit');

		switch(this.app.rm){
			case RM.html:
				this.viewMode = ViewMode.html;
				break;
			case RM.api:
				this.viewMode = ViewMode.api;
				break;
			default:
				this.viewMode = ViewMode.html;

		}


		// Or the snapshot version without the subscribe if we don't want to reuse the component:
		// let id = +this.route.snapshot.params['id'];
		// We would only reuse if we're going to use the same for HTML/JSON/XML

		// SearchTotals subscription has to come before params subscription or params will emit totals before searchTotals is ready to catch it
		this.subscriptions.push(this.app.oCurrentSearchTotals.subscribe( (searchTotals :SearchTotals) => this.onNewSearchTotals(searchTotals)));
		this.subscriptions.push(this.route.params.subscribe( (params :Params) => this.onNewParams(params) ));
	}
	ngOnDestroy() :void {
		Logger.debug('Results.onDestroy');
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
	}

	get search() :Search {
		Logger.trace('Results.search');
		return this._search;
	}
	get totals() :Totals {
		Logger.trace('Results.totals');
		return this._totals;
	}
	get viewHTML() :boolean {
		Logger.trace('Results.viewHTML');
		return this.viewMode === ViewMode.html;
	}
	get viewAPI() :boolean {
		Logger.trace('Results.viewAPI');
		return this.viewMode === ViewMode.api;
	}

	onNewParams(params :Params) :void {
		Logger.log('Results.onNewParams this.app.routingSessionSearch=' + this.app.routingSessionSearch);
		if(this.app.routingSessionSearch){
			this.app.routingSessionSearch = false;
// 			this.app.search = this.app.sessionSearch;
		}else{
			this.app.search = Search.parseParams(params);
			Logger.log('Results.onNewParams this.app.routingSubstanceInSearch=' + this.app.routingSubstanceInSearch);
			if(this.app.routingSubstanceInSearch){
				this.app.routingSubstanceInSearch = false;
			}else{
				this.app.setAsSessionSearch_UpdateHistory();
			}
		}
	}
	onNewSearchTotals(searchTotals :SearchTotals) :void {
		if(searchTotals.valid){
			Logger.info('Results.onNewSearchTotals', searchTotals);
		}else{
			Logger.debug('Results.onNewSearchTotals !VALID', searchTotals);
		}
		this._search = searchTotals.search;
		this._totals = searchTotals.totals;
		Logger.trace('Results.onNewSearchTotals -> markForCheck');
		this.cdr.markForCheck();
	}


	setViewHTML() :void {
		Logger.debug('Results.setViewHTML');
		this.viewMode = ViewMode.html;
	}
	setViewAPI() :void {
		Logger.debug('Results.setViewAPI');
		this.viewMode = ViewMode.api;
	}
}
