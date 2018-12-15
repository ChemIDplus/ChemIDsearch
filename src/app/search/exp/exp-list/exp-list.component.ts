import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Expression } from './../../../domain/expression';
import { Search } from './../../../domain/search';
import { SearchTotals } from './../../../domain/search-totals';
import { Totals } from './../../../domain/totals';

import { AppService } from './../../../core/app.service';
import { SearchService } from './../../../core/search.service';

import { Logger } from './../../../core/logger';

@Component({
	selector: 'app-exp-list',
	templateUrl: './exp-list.component.html',
	styleUrls: ['./exp-list.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpListComponent implements OnInit, OnDestroy {
	search :Search;
	totals :Totals;
	valid :boolean;

	@ViewChild('getResults') private readonly getResults :ElementRef;

	private isNavigatingToExp :boolean = false;
	private readonly subscriptions :Subscription[] = [];

	constructor(
		readonly app :AppService,
		readonly searchService :SearchService,
		readonly router :Router,
		readonly cdr :ChangeDetectorRef
	){}

	ngOnInit() :void {
		Logger.debug('ExpList.onInit');
		this.app.search = this.app.searchForEdit;
		this.onSearchTotals(this.app.currentSearchTotalsStream.value);
		if(this.expCount){
			this.subscriptions.push(this.app.oCurrentSearchTotals.subscribe( (searchTotals :SearchTotals) => this.onSearchTotals(searchTotals) ));
		}
	}
	ngOnDestroy() :void {
		Logger.debug('ExpList.onDestroy');
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
		if(!this.isNavigatingToExp){
			this.app.searchForEdit = undefined;
		}
	}

	get expCount() :number {
		const expCount :number = this.search && this.search.exps.length;
		Logger.trace('ExpList.expCount=' + expCount);
		return expCount;
	}

	onSearchTotals(searchTotals :SearchTotals) :void {
		if(this.search === searchTotals.search && this.totals === searchTotals.totals){
			Logger.log('ExpList.onSearchTotals 1', searchTotals);
			return;
		}
		this.search = searchTotals.search;
		if(this.expCount === 0){
			Logger.log('ExpList.onSearchTotals 2', searchTotals);
			this.createOrEdit();
		}else{
			Logger.log('ExpList.onSearchTotals 3', searchTotals);
			this.totals = searchTotals.totals;
			this.valid = searchTotals.valid;
			Logger.trace('ExpList.onSearchTotals -> markForCheck');
			this.cdr.markForCheck();
			setTimeout( () => this.setFocus() );
		}
	}


	createOrEdit(exp ? :Expression) :void {
		Logger.log('ExpList.createOrEdit');
		if(exp){
			this.app.expressionForEdit = exp;
		}
		this.isNavigatingToExp = true;
		// Navigate with Absolute link
		this.router.navigate(['/expression']);
	}
	deleteExp(exp :Expression) :void {
		const old :Search = this.search,
			sFE :Search = old.minusExpression(exp);
		Logger.info('ExpList.deleteExp FROM ' + old.url + ' TO ' + sFE.url);
		this.app.searchForEdit = sFE;
		Logger.trace('ExpList.deleteExp -> markForCheck');
		this.cdr.markForCheck();
	}
	toggleNot(exp :Expression) :void {
		Logger.log('ExpList.toggleNot');
		this.app.searchForEdit = this.search.minusExpression(exp).plusExpression(exp.toggleNot());
	}

	clear() :void {
		Logger.info('ExpList.clear');
		this.app.searchForEdit = Search.EMPTY_SEARCH;
		Logger.trace('ExpList.clear -> markForCheck');
		this.cdr.markForCheck();
	}

	private setFocus() :void {
		Logger.trace('ExpList.setFocus');
		// Removed Renderer for v7 upgrade. Issue at https://github.com/angular/angular/issues/15674
		this.getResults.nativeElement.focus();
	}

}
