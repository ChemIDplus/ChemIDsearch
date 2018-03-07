import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { OrderBy, Srt, Sort } from './../../../../domain/sort';

import { Logger } from './../../../../core/logger';

@Component({
	selector: 'app-summaries-sort',
	templateUrl: './summaries-sort.component.html',
	styleUrls: ['./summaries-sort.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummariesSortComponent {
	@Input()
	set orderBy(orderBy :OrderBy) {
		this._orderBy = orderBy;
		this.current = Sort.getSort(this._orderBy.sortBy1);
		this.currentIsAsc = this.current.normalIsAsc === !orderBy.sortBy1Reverse;
		Logger.log('SummariesSort.orderBy setter', orderBy, this.currentIsAsc);
	}
	@Input() hasOneSimilarity :boolean;
	@Output() public change :EventEmitter<OrderBy> = new EventEmitter<OrderBy>();

	current :Sort;
	currentIsAsc :boolean;

	private _orderBy :OrderBy;


	get sortOptions() :ReadonlyArray<Sort> {
		return this.hasOneSimilarity ? Sort.sorts : Sort.sortsNotSimilarity;
	}

	changeSortBy(sort :Sort) :void {
		Logger.log('SummariesSort.changeSortBy', sort, this.current, this.currentIsAsc);
		if(sort === this.current){
			this.changeDirection();
		}else{
			const sortBy2 :Srt = this.current.srt,
				sortBy2Reverse :boolean = this.currentIsAsc !== this.current.normalIsAsc;
			this.current = sort;
			this.currentIsAsc = sort.normalIsAsc;
			this.changeSort(sortBy2, sortBy2Reverse);
		}
	}

	changeDirection() :void{
		Logger.log('SummariesSort.changeDirection', this.current, this.currentIsAsc);
		this.currentIsAsc = !this.currentIsAsc;
		this.changeSort(this._orderBy.sortBy2, this._orderBy.sortBy2Reverse);
	}

	private changeSort(sortBy2 :Srt, sortBy2Reverse :boolean) :void{
		this.change.emit(new OrderBy(this.current.srt, this.currentIsAsc !== this.current.normalIsAsc, sortBy2, sortBy2Reverse));
	}
}
