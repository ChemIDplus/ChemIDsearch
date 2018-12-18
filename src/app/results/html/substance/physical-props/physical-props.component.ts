import { DataSource } from '@angular/cdk/collections';
import { Component, Input, ViewChild, ChangeDetectionStrategy, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { MatSort, Sort as MatSortEvent } from '@angular/material';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';

import * as _ from 'lodash';

import { PhysicalProp } from './../../../../domain/physical-prop';

import { Logger } from './../../../../core/logger';

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class PPsDataSource extends DataSource<PhysicalProp> {
	constructor(readonly dataChange :BehaviorSubject<PhysicalProp[]>, readonly sort :MatSort){
		super();
	}

	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect() :Observable<PhysicalProp[]> {
		const displayDataChanges :(Observable<ReadonlyArray<PhysicalProp>> | EventEmitter<MatSortEvent>)[] = [
			this.dataChange,
			this.sort.sortChange
		];

		return merge(...displayDataChanges).pipe(
			map( () => this.getSortedData() )
		);
	}

	/* tslint:disable-next-line:prefer-function-over-method */
	disconnect() :void {
		// empty
	}

	/** Returns a sorted copy of the database data. */
	getSortedData() :PhysicalProp[] {
		const data :PhysicalProp[] = this.dataChange.value.slice(),
			sort :MatSort = this.sort,
			direction :'' | 'asc' | 'desc' = sort.direction;
		let active :string | Function = sort.active;
		if(active === 'property'){
			active = ( (pp :PhysicalProp) :string => pp.property.toLowerCase() );
		}else if(active === 'value'){
			active = ( (pp :PhysicalProp) :number => Number(pp.value) );
		}
		return (!active || direction === '') ? data : _.orderBy(data, [active], [direction]) as PhysicalProp[];
	}
}

@Component({
	selector: 'app-physical-props',
	templateUrl: './physical-props.component.html',
	styleUrls: ['./physical-props.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class PhysicalPropsComponent implements OnInit, OnChanges {
	@Input() physicalProps :ReadonlyArray<PhysicalProp>; // Immutable
	@ViewChild(MatSort) sort :MatSort;

	displayedColumns :string[] = ['property', 'value', 'units', 'temperature', 'source'];
	dataSource :PPsDataSource | undefined;

	/** Stream that emits whenever the data has been modified. */
	readonly dataChange :BehaviorSubject<PhysicalProp[]> = new BehaviorSubject<PhysicalProp[]>([]);

	ngOnChanges() :void {
		Logger.debug('PhysicalProps.onChanges', this.physicalProps);
		this.dataChange.next(_.filter(this.physicalProps, () => true));
	}
	ngOnInit() :void {
		Logger.debug('PhysicalProps.onInit');
		this.dataSource = new PPsDataSource(this.dataChange, this.sort);
	}
}
