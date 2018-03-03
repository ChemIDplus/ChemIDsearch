import { DataSource } from '@angular/cdk/collections';
import { Component, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent, MatSort, Sort as MatSortEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/of';

import { PagedSearch, Paging } from './../../../domain/paging';
import { Search } from './../../../domain/search';
import { OrderBy, Srt, Sort } from './../../../domain/sort';
import { Substance } from './../../../domain/substance';
import { Summary } from './../../../domain/summary';

import { AppService } from './../../../core/app.service';
import { SearchService } from './../../../core/search.service';

import { Logger } from './../../../core/logger';

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class SummariesDataSource extends DataSource<Summary> {
	constructor(private readonly summaries :Summary[]){
		super();
	}
	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect() :Observable<Summary[]> {
		return Observable.of(this.summaries);
	}

	/* tslint:disable-next-line:prefer-function-over-method */
	disconnect() :void {
		// empty
	}
}

@Component({
	selector: 'app-summaries-no-structures',
	templateUrl: './summaries-no-structures.component.html',
	styleUrls: ['./summaries-no-structures.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummariesNoStructuresComponent implements OnInit, OnChanges, OnDestroy {
	@Input() search :Search; // Immutable
	@Input() orderBy :OrderBy; // Immutable
	@Input() paging :Paging; // Immutable
	@Input() total :number;
	@Input() substances :ReadonlyArray<Substance>; // Immutable

	@ViewChild(MatPaginator) paginator :MatPaginator;
	@ViewChild(MatSort) sort :MatSort;

	displayedColumns :string[] = ['name', 'id', 'formula', 'weight', 'has3d', 'mesh', 'inchikey', 'citations'];
	dataSource :SummariesDataSource | undefined;

	private readonly subscriptions :Subscription[] = [];

	constructor(
		readonly app :AppService,
		readonly searchService :SearchService,
		readonly cdr :ChangeDetectorRef
	){
		Logger.debug('SummariesNoStructures.constructor');
	}

	ngOnChanges() :void {
		Logger.debug('SummariesNoStructures.change');
		this.setDataSource();
	}

	ngOnInit() :void {
		Logger.debug('SummariesNoStructures.init');
		this.subscriptions.push(this.paginator.page.subscribe( (pe :PageEvent) => this.onPageChange(pe) ));
		this.subscriptions.push(this.sort.sortChange.subscribe( (s :MatSortEvent) => this.onSortChange(s) ));
		this.setDataSource();
	}

	ngOnDestroy() :void {
		Logger.debug('SummariesNoStructures.onDestroy');
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
	}

	get summaries() :Summary[] {
		Logger.trace('SummariesNoStructures.summaries');
		return this.substances.map( (substance :Substance) => substance.summary );
	}

	get pageSize() :number {
		Logger.trace('SummariesNoStructures.pageSize');
		return this.paging.pageSize;
	}
	get activePage() :number {
		Logger.trace('SummariesNoStructures.activePage');
		return this.paging.activePage;
	}
	get sortBy() :string {
		Logger.trace('SummariesNoStructures.sortBy');
		return Srt[this.orderBy.sortBy1];
	}
	get sortOrder() :string {
		Logger.trace('SummariesNoStructures.sortOrder');
		return !this.orderBy.sortBy1Reverse === Sort.getSort(this.orderBy.sortBy1).normalIsAsc ? 'asc' : 'desc';
	}

	onSortChange(sortEvent :MatSortEvent) :void {
		Logger.log('SummariesNoStructures.onSortChange', sortEvent);
		const sortBy1 :Srt = Srt[sortEvent.active],
			sort :Sort = Sort.getSort(sortBy1),
			sortBy1Reverse :boolean = sort.normalIsAsc !== (sortEvent.direction === 'asc');
		Logger.debug('SummariesNoStructures.onSortChange sortBy1=', sortBy1, ' sortBy1Reverse=', sortBy1Reverse);
		this.app.orderBy = new OrderBy(sortBy1, sortBy1Reverse);
		this.app.paging = new Paging(1, this.app.paging.pageSize);
		this.searchService.nextSummariesSearch = new PagedSearch(this.search, this.total, this.app.orderBy, this.app.paging);
	}
	onPageChange(pageEvent :PageEvent) :void {
		Logger.log('SummariesNoStructures.onPageChange', pageEvent);
		this.app.paging = new Paging(undefined, pageEvent.pageSize, undefined, pageEvent.pageIndex + 1);
		this.searchService.nextSummariesSearch = new PagedSearch(this.search, this.total, this.app.orderBy, this.app.paging);
	}

	onRequestSubstance() :void {
		Logger.debug('SummariesNoStructures.onRequestSubstance');
		this.app.routingSubstanceInSearch = true;
	}

	private setDataSource() :void {
		this.dataSource = new SummariesDataSource(this.summaries);
		Logger.trace('SummariesNoStructures.setDataSource -> markForCheck');
		this.cdr.markForCheck();
	}

}
