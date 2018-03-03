import { DataSource } from '@angular/cdk/collections';
import { Component, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';
import 'rxjs/add/observable/of';

import { IDSimilarity } from './../../../domain/id-similarity';
import { IDStructure } from './../../../domain/id-structure';
import { PagedSearch, Paging } from './../../../domain/paging';
import { Search } from './../../../domain/search';
import { OrderBy } from './../../../domain/sort';
import { Substance } from './../../../domain/substance';

import { AppService } from './../../../core/app.service';
import { SearchService } from './../../../core/search.service';

import { Logger } from './../../../core/logger';

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class SubstancesDataSource extends DataSource<Substance> {
	constructor(private readonly substances :Substance[]){
		super();
	}
	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect() :Observable<Substance[]> {
		return Observable.of(this.substances);
	}

	/* tslint:disable-next-line:prefer-function-over-method */
	disconnect() :void {
		// empty
	}
}

@Component({
	selector: 'app-summaries',
	templateUrl: './summaries.component.html',
	styleUrls: ['./summaries.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummariesComponent implements OnInit, OnDestroy {
	@Input() search :Search; // Immutable
	@Input() orderBy :OrderBy; // Immutable
	@Input() paging :Paging; // Immutable
	@Input() total :number;
	@Input() structuresView :boolean;
	@Input()
	set substances(substances :ReadonlyArray<Substance>) {
		Logger.debug('Summaries.substances setter');
		this._substances = substances;
		this.setData();
	}
	@Input() idSimilarities :ReadonlyArray<IDSimilarity>;

	@ViewChild(MatPaginator) paginator :MatPaginator;

	displayedColumns :string[] = ['summary'];
	dataSource :SubstancesDataSource | undefined;
	data :Substance[];
	filterQuery :string = '';
	sortOrder :string = 'asc';
	inited :boolean = false;
	linkSimPercent :number;


	private _substances :ReadonlyArray<Substance>;

	private readonly subscriptions :Subscription[] = [];

	constructor(
		readonly app :AppService,
		readonly searchService :SearchService,
		readonly cdr :ChangeDetectorRef
	){
		Logger.debug('Summaries.constructor');
	}

	ngOnInit() :void {
		this.subscriptions.push(this.paginator.page.subscribe( (pe :PageEvent) => this.onPageChange(pe) ));
		this.linkSimPercent = this.app.simPercent;
	}

	ngOnDestroy() :void {
		Logger.debug('Summaries.onDestroy');
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
	}

	get hasOneSimilarity() :boolean {
		Logger.trace('Summaries.hasOneSimilarity');
		return this.search.hasOneSimilarity;
	}

	get pageSize() :number {
		Logger.trace('Summaries.pageSize');
		return this.paging.pageSize;
	}
	get activePage() :number {
		Logger.trace('Summaries.activePage');
		return this.paging.activePage;
	}

	onSortChange(orderBy :OrderBy) :void {
		Logger.log('Summaries.onSortChange', orderBy);
		this.app.orderBy = orderBy;
		this.app.paging = new Paging(1, this.app.paging.pageSize);
		this.searchService.nextSummariesSearch = new PagedSearch(this.search, this.total, this.app.orderBy, this.app.paging);
	}
	onPageChange(pageEvent :PageEvent) :void {
		Logger.log('Summaries.onPageChange', pageEvent);
		this.app.paging = new Paging(undefined, pageEvent.pageSize, undefined, pageEvent.pageIndex + 1);
		this.searchService.nextSummariesSearch = new PagedSearch(this.search, this.total, this.app.orderBy, this.app.paging);
	}


	getSimilarity(substance :Substance) :number {
		Logger.trace('Summaries.getSimilarity');
		return this.idSimilarities.find( (ids :IDSimilarity) => ids.id === substance.id ).similarity;
	}

	private setData() :void {
		this.data = _.filter(this._substances, () => true);
		Logger.debug('this.data=', this.data);
		this.setDataSource();

		if(!this.subscriptions.length){
			// The first setData call happens before the first OnChanges, so we can't set the subscription there, as we need it before the searchService.nextStructuresFromIDIKs to catch cached results
			Logger.trace('Summaries.setData subscribing to searchService.oStructuresFromIDIKs');
			this.subscriptions.push(this.searchService.oStructuresFromIDIKs.subscribe( (a :IDStructure[]) => this.onNewStructuresFromIDIKs(a) ));
		}
		this.searchService.nextStructuresFromIDIKs = this.data.filter( (substance :Substance) => substance.summary.weight && (!substance.structure || !substance.structure.image ) )
			.map((substance :Substance) => substance.idik);
	}
	private setDataSource() :void {
		this.dataSource = new SubstancesDataSource(this.data);
		Logger.trace('Summaries.setDataSource -> markForCheck');
		this.cdr.markForCheck();
	}

	private onNewStructuresFromIDIKs(a :IDStructure[]) :void {
		Logger.trace('Summaries.onNewStructuresFromIDIKs', a);
		let changed :number = 0;
		this.data.forEach( (substance :Substance, index :number, data :Substance[]) => {
			const withStructure :IDStructure = a.find( (ids :IDStructure) => substance.id === ids.id );
			if(withStructure){
				data[index] = substance.mergeMissingStructure(withStructure.structure);
				++changed;
			}
		});
		if(changed){
			this.setDataSource();
		}
	}

}
