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
		return Sort.SORTS.filter( (sort :Sort) => this.hasOneSimilarity || sort.srt !== Srt.similarity );
	}

	changed(sort :Sort) :void {
		Logger.log('SummariesSort.change', sort, this.current, this.currentIsAsc);
		let sortBy2 :Srt,
			sortBy2Reverse :boolean;
		if(sort === this.current){
			sortBy2 = this._orderBy.sortBy2;
			sortBy2Reverse = this._orderBy.sortBy2Reverse;
			Logger.log('sort === this.current =' + sort + '; switching this.currentIsAsc from ', this.currentIsAsc);
			this.currentIsAsc = !this.currentIsAsc;
		}else{
			sortBy2 = this.current.srt;
			sortBy2Reverse = this.currentIsAsc !== this.current.normalIsAsc;
			this.current = sort;
			this.currentIsAsc = sort.normalIsAsc;
		}
		this.change.emit(new OrderBy(this.current.srt, this.currentIsAsc !== this.current.normalIsAsc, sortBy2, sortBy2Reverse));
	}

	mouseenter(div :HTMLDivElement) :void {
		Logger.log('mouseenter', div);
		div.className = 'show-all';
		/* tslint:disable-next-line:no-magic-numbers */
		div.style.top = (Math.min(this.sortOptions.indexOf(this.current), 5) * -2.15 - 0.45) + 'em'; /* (-1.95 * Math.min(this.sortOptions.indexOf(this.current), 5) - 0.6) goes up*/
	}
	/* tslint:disable-next-line:prefer-function-over-method */
	mouseleave(div :HTMLDivElement) :void {
		Logger.log('mouseleave', div);
		div.className = '';
	}
}
