import { Component, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
// import { DataSource } from '@angular/cdk/collections';
import { MatSort, Sort as MatSortEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import * as _ from 'lodash';

import { Toxicity } from './../../../../domain/toxicity';

import { Logger } from './../../../../core/logger';

@Component({
	selector: 'app-toxicity-list',
	templateUrl: './toxicity-list.component.html',
	styleUrls: ['./toxicity-list.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToxicityListComponent implements OnInit {
	@Input() set toxicityList(toxicityReadOnlyArray :ReadonlyArray<Toxicity>) {
		Logger.debug('ToxicityList.toxicityList setter');
		this._toxicityReadOnlyArray = toxicityReadOnlyArray;
// 		this.setDataSource();
	}
	get toxicityList() :ReadonlyArray<Toxicity> {
		return this._toxicityReadOnlyArray;
	}

	@ViewChild(MatSort) sort :MatSort;

	displayedColumns :string[] = ['organism', 'testType', 'route', 'dose', 'effect', 'source'];
// 	dataSource :ToxicitiesDataSource | undefined;

	private _toxicityReadOnlyArray :ReadonlyArray<Toxicity>;
	private readonly subscriptions :Subscription[] = [];


	constructor(readonly cdr :ChangeDetectorRef){}

	ngOnInit() :void {
		this.sort.sort({id:'organism', start:'asc', disableClear:true});
		this.subscriptions.push(this.sort.sortChange.subscribe( (s :MatSortEvent) => this.onSortChange(s) ));
	}

	onSortChange(sortEvent :MatSortEvent) :void {
		Logger.log('ToxicityList.onSortChange', sortEvent);
		let property :string | Function = sortEvent.active;
		if(sortEvent.active === 'dose'){
			property = (tox :Toxicity) :string => tox.dose.normalized === undefined ? tox.dose.reported : tox.dose.normalized;
		}else if (sortEvent.active === 'source'){
			property = 'journal.display';
		}
		this._toxicityReadOnlyArray = _.orderBy(this._toxicityReadOnlyArray, [property], [sortEvent.direction]);
// 		this.setDataSource();
		this.cdr.markForCheck();
	}

/*
	private setDataSource() :void {
		this.dataSource = new ToxicitiesDataSource( _.filter(this._toxicityReadOnlyArray, () => true));
	}
*/
}

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
/*
export class ToxicitiesDataSource extends DataSource<Toxicity> {
	constructor(private substances :Toxicity[]){
		super();
	}
	/** Connect function called by the table to retrieve one stream containing the data to render. * /
	connect() :Observable<Toxicity[]> {
		return Observable.of(this.substances);
	}

	disconnect() :void {
		// empty
	}
}
*/
