import { Component, OnChanges, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IDSimilarity } from './../../domain/id-similarity';
import { Paging, PagedSearch, PagedSearchSubstancesResult } from './../../domain/paging';
import { Search } from './../../domain/search';
import { OrderBy } from './../../domain/sort';
import { Substance } from './../../domain/substance';
import { SubstancesResult } from './../../domain/substances-result';
import { Summary } from './../../domain/summary';
import { Totals } from './../../domain/totals';

import { AppService } from './../../core/app.service';
import { SearchService } from './../../core/search.service';

import { Logger } from './../../core/logger';

@Component({
	selector: 'app-html',
	templateUrl: './html.component.html',
	styleUrls: ['./html.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtmlComponent implements OnChanges, OnInit, OnDestroy {
	@Input() search :Search; // Immutable
	@Input() totals :Totals; // Immutable

	orderBy :OrderBy;
	paging :Paging;
	total :number;
	substance :Substance;
	substances :ReadonlyArray<Substance>;
	idSimilarities :ReadonlyArray<IDSimilarity>;
	viewStructures :boolean;
	ltLg :boolean = false;

	private readonly subscriptions :Subscription[] = [];

	constructor(
		readonly router :Router,
		readonly app :AppService,
		readonly searchService :SearchService,
		readonly cdr :ChangeDetectorRef,
		readonly media :ObservableMedia){
			this.setLtLg();
		}

	ngOnChanges() :void {
		Logger.debug('HTMLResults.onChanges');
		// There is probably a better way it kick these off again - or better would be to correctly use Observable and an async pipe...
		if(this.substances || this.substance){
			this.checkTotals();
		}
	}
	ngOnInit() :void {
		Logger.debug('HTMLResults.onInit');
		this.subscriptions.push(this.media.subscribe( (change :MediaChange) => this.onMediaChange(change) ));
		this.subscriptions.push(this.searchService.oPagedSearchSubstancesResult.subscribe( (pssr :PagedSearchSubstancesResult) => this.onNewPagedSearchSubstancesResult(pssr) ));
		this.checkTotals();
		this.viewStructures = this.app.viewStructures;
	}
	ngOnDestroy() :void {
		Logger.debug('HTMLResults.onDestroy');
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
	}

	get summaries() :Summary[] {
		Logger.trace('HTMLResults.summaries');
		return this.substances.map( (substance :Substance) => substance.summary );
	}

	onMediaChange(change :MediaChange) :void {
		if(change){
			Logger.debug('HTMLResults.onMediaChange', change);
			this.setLtLg();
			this.cdr.markForCheck();
		}
	}
	setLtLg() :void {
		this.ltLg = this.media.isActive('lt-lg');
	}

	onNewPagedSearchSubstancesResult(pssr :PagedSearchSubstancesResult) :void {
		this.substances = undefined;
		this.idSimilarities = undefined;
		this.substance = undefined;
		const sr :SubstancesResult = pssr.substancesResult;
		this.total = sr && sr.total;
		this.orderBy = pssr.pagedSearch.orderBy;
		this.paging = pssr.pagedSearch.paging;
		Logger.info('HTMLResults.onNewPagedSearchSubstancesResult', this.total);
		if(this.total > 1){
			this.substances = sr.substances;
		}else if(this.total === 1){
			this.substance = sr.substances[0];
		}
		this.idSimilarities = sr && sr.idSimilarities;
		Logger.trace('HTMLResults.onNewPagedSearchSubstancesResult -> markForCheck');
		this.cdr.markForCheck();
	}

	checkTotals() :void {
		Logger.trace('HTMLResults.checkTotals');
		const substances :number = this.totals.substances;
		if(substances >= 1 || (this.totals.substances === undefined && this.totals.values >= 1)){
			Logger.log('HTMLResults.checkTotals -> searchService.nextSummariesSearch to populate substances');
			this.searchService.nextSummariesSearch = new PagedSearch(this.search, substances, this.app.orderBy, this.app.paging);
		}
	}

}
