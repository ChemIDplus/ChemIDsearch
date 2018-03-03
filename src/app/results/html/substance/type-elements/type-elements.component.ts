import { DataSource } from '@angular/cdk/collections';
import { Component, Input, ViewChild, ChangeDetectionStrategy, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { MatSort, Sort as MatSortEvent } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { Element } from './../../../../domain/element';
import { Resource, ResourceWithURL } from './../../../../domain/resource';
import { Summary } from './../../../../domain/summary';
import { Type } from './../../../../domain/type';
import { TypeElements } from './../../../../domain/type-elements';

import { ModalData } from './../../../../modal/modal-data';
import { ModalService } from './../../../../modal/modal.service';

import { Logger } from './../../../../core/logger';

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ElementsDataSource extends DataSource<Element> {
	constructor(readonly dataChange :BehaviorSubject<Element[]>, readonly sort :MatSort){
		super();
	}

	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect() :Observable<Element[]> {
		const displayDataChanges :(Observable<ReadonlyArray<Element>> | EventEmitter<MatSortEvent>)[] = [
			this.dataChange,
			this.sort.sortChange
		];

		return Observable.merge(...displayDataChanges).map(() => {
			return this.getSortedData();
		});
	}

	/* tslint:disable-next-line:prefer-function-over-method */
	disconnect() :void {
		// empty
	}

	/** Returns a sorted copy of the database data. */
	getSortedData() :Element[] {
		const data :Element[] = this.dataChange.value.slice(),
			sort :MatSort = this.sort,
			direction :'' | 'asc' | 'desc' = sort.direction;
		let active :string = sort.active;
		if(active === 'url'){
			active = 'data';
		}
		return (!active || direction === '') ? data : _.orderBy(data, [active], [direction]);
	}
}

@Component({
	selector: 'app-type-elements',
	templateUrl: './type-elements.component.html',
	styleUrls: ['./type-elements.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeElementsComponent implements OnInit, OnChanges {

	@Input() public summary :Summary; // Immutable
	@Input() public typeElements :TypeElements<Element>; // Immutable

	@ViewChild(MatSort) sort :MatSort;

	displayedColumns :string[];
	dataSource :ElementsDataSource | undefined;

	/** Stream that emits whenever the data has been modified. */
	readonly dataChange :BehaviorSubject<Element[]> = new BehaviorSubject<Element[]>([]);

	constructor(readonly modalService :ModalService){}

	ngOnChanges() :void {
		Logger.debug('TypeElementsComponent.onChanges', this.typeElements);
		/* tslint:disable-next-line:no-string-literal */
		const isLocator :boolean = this.typeElements.type.sharedLabel === Type.LABELS['lo'];
		this.displayedColumns = isLocator ? ['url', 'sourceName'] : ['data', 'sources'];
		const elements :Element[] = isLocator ? this.typeElements.elements.map( (element :Element) => new ResourceWithURL((element as Resource), this.summary) ) : _.filter(this.typeElements.elements, () => true);
		this.dataChange.next(elements);
	}
	ngOnInit() :void {
		Logger.debug('TypeElementsComponent.init');
		this.dataSource = new ElementsDataSource(this.dataChange, this.sort);
	}

	sourceDescription(resource :ResourceWithURL) :void {
		Logger.trace2('TypeElementsComponent.sourceDescription');
		this.modalService.open(new ModalData(resource.sourceIdName, resource.sourceBrReplacedDescription));
	}
}
