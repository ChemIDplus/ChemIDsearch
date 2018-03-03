import { DataSource } from '@angular/cdk/collections';
import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MatSort, Sort as MatSortEvent } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';
import 'rxjs/add/observable/of';

import { SearchEvent } from './../domain/search-event';

import { AppService } from './../core/app.service';

import { Logger } from './../core/logger';

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class SearchEventsDataSource extends DataSource<SearchEvent> {
	constructor(private readonly searchEvents :SearchEvent[]){
		super();
	}
	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect() :Observable<SearchEvent[]> {
		return Observable.of(this.searchEvents);
	}

	/* tslint:disable-next-line:prefer-function-over-method */
	disconnect() :void {
		// empty
	}
}

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit, OnDestroy {

	@ViewChild(MatSort) sort :MatSort;

	displayedColumns :string[] = ['millis', 'searchDisplay', 'substances', 'actions'];
	dataSource :SearchEventsDataSource | undefined;

	private searchEvents :SearchEvent [];
	private readonly subscriptions :Subscription[] = [];

	constructor(
		readonly app :AppService,
		readonly router :Router,
		readonly cdr :ChangeDetectorRef) {
		}

	ngOnInit() :void {
		Logger.debug('HistoryComponent.init');
		this.subscriptions.push(this.sort.sortChange.subscribe( (s :MatSortEvent) => this.onSortChange(s) ));
		this.setSearchEvents();
	}

	ngOnDestroy() :void {
		Logger.debug('HistoryComponent.onDestroy');
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
	}

	get hasHistory() :boolean {
		Logger.log('HistoryComponent.hasHistory');
		return !!this.app.searchHistory.length;
	}

	run(searchEvent :SearchEvent) :void {
		Logger.debug('HistoryComponent.run');
		this.app.navToResults(searchEvent.search);
	}
	edit(searchEvent :SearchEvent) :void {
		Logger.debug('HistoryComponent.edit');
		this.app.searchForEdit = searchEvent.search;
		this.router.navigate(['/']);
	}
	delete(searchEvent :SearchEvent) :void {
		Logger.debug('HistoryComponent.delete');
		this.app.deleteFromHistory(searchEvent);
		this.setSearchEvents();
	}

	onSortChange(sortEvent :MatSortEvent) :void {
		Logger.log('HistoryComponent.onSortChange', sortEvent);
		this.searchEvents = _.orderBy(this.searchEvents, [sortEvent.active], [sortEvent.direction]);
		this.setDataSource();
	}
	private setSearchEvents() :void {
		this.searchEvents = _.filter(this.app.searchHistory, () => true);
		this.setDataSource();
	}
	private setDataSource() :void {
		this.dataSource = new SearchEventsDataSource(this.searchEvents);
		Logger.trace('HistoryComponent.setDataSource -> markForCheck');
		this.cdr.markForCheck();
	}

}
