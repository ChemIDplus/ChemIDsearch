import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AutoCompleteResult } from './../../../../domain/auto-complete-result';
import { DataCount } from './../../../../domain/data-count';
import { Expression, ExpressionMut } from './../../../../domain/expression';
import { Fld, Field } from './../../../../domain/field';
import { Op, Operator } from './../../../../domain/operator';
import { SearchTotals } from './../../../../domain/search-totals';
import { SearchValueCounts } from './../../../../domain/value-counts-result';

import { AppService } from './../../../../core/app.service';
import { SearchService } from './../../../../core/search.service';
import { ExpressionValidators } from './../exp-validators';
import { AutoCompleteService } from './auto-complete.service';

import { Logger } from './../../../../core/logger';

@Component({
	selector: 'app-auto-complete',
	templateUrl: './auto-complete.component.html',
	styleUrls: ['./auto-complete.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteComponent implements OnInit, OnDestroy {

	private static getNewAutocompleteValue(exp :ExpressionMut, suffixValue :string) :string {
		Logger.trace('AutoComplete.getNewAutocompleteValue');
		let value :string = suffixValue;
		if(exp.op === Op.inlist){
			value = exp.value.replace(/[^|]*$/, '') + suffixValue;
			Logger.log('AutoComplete.getNewAutocompleteValue inlist value=' + value);
		}
		return Expression.trimAndCase(exp.fld, value);
	}

	ac :AutoCompleteResult = undefined;

/* These Inputs are NOT immutable - be careful and call cdr.markForCheck() whenever a DOM change is needed! */
	@Input() private readonly exp :ExpressionMut;
	@Input() private readonly ctrlFld :FormControl;
	@Input() private readonly ctrlOp :FormControl;
	@Input() private readonly ctrlValue :FormControl;
	@Output() private readonly click :EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() private readonly acFetch :EventEmitter<boolean> = new EventEmitter<boolean>();

	private readonly subscriptions :Subscription[] = [];

	constructor(
		readonly app :AppService,
		readonly searchService :SearchService,
		readonly acService :AutoCompleteService,
		readonly cdr :ChangeDetectorRef
	){}

	ngOnInit() :void {
		Logger.log('AutoComplete.onInit this.exp =', this.exp);
		if(this.exp.ac){
			Logger.log('AutoComplete.onInit this.exp.ac.totals =', this.exp.ac.totals);
			this.ac = this.exp.ac;
			Logger.trace('AutoComplete.onInit -> markForCheck');
			this.cdr.markForCheck();
		}
		this.subscriptions.push(this.searchService.oSearchTotals.subscribe( (searchTotals :SearchTotals) => this.onNewSearchTotals(searchTotals) ));
		this.subscriptions.push(this.searchService.oSearchValueCounts.subscribe( (svc :SearchValueCounts) => this.acService.onNewSVC(svc) ));
		this.subscriptions.push(this.acService.ACRs.subscribe( (acr :AutoCompleteResult) => this.onNewACR(acr) ));
	}
	ngOnDestroy() :void {
		Logger.debug('AutoComplete.onDestroy');
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
	}

	/** showResults called once/twice per result list */
	get showResults() :boolean {
		Logger.debug('AutoComplete.showResults');
		return !!this.ac.results && (this.ac.totals.values > 1 || !this.onlyEquals);
	}
	/** formulaGTE called MANY times per result list */
	get formulaGTE() :string {
		Logger.trace('AutoComplete.formulaGTE');
		return this.exp.fld === Fld.formula || this.exp.testFirst === Fld.formula ? '>= ' : '';
	}
	/** valueMatchesTotalValuesInTotalSubstancesAutoField called once/twice per showResults */
	get valueMatchesTotalValuesInTotalSubstancesAutoField() :string {
		Logger.trace('AutoComplete.valueMatchesTotalValuesInTotalSubstancesAutoField');
		const exp :ExpressionMut = this.ac.expression,
			totalSubstances :number = this.ac.totals.substances;
		let s :string = exp.acValue.toUpperCase() + (!this.onlyEquals ? '*' : '') + SearchService.getMatchesValuesInSubstances(this.ac.totals, 1);
		if(totalSubstances >= 0 && (this.exp.fld === Fld.auto || this.exp.op === Op.auto) && totalSubstances >= 1){
			s += ' (using ' + Field.getDisplay(exp.fld) + ' ' + Operator.getDisplay(exp.op) + ')';
		}
		return s;
	}
	/** onlyEquals called once per showResults */
	private get onlyEquals() :boolean {
		Logger.trace('AutoComplete.onlyEquals');
		return this.ac.totals.values === 1 && this.firstEquals;
	}
	private get firstEquals() :boolean {
		Logger.trace('AutoComplete.firstEquals');
		return this.ac.totals.values >= 1 && this.ac.results[0].data.toUpperCase() === this.exp.acValue.toUpperCase();
	}

	/** clearAutoComplete called on every change */
	clearAutoComplete() :void {
		Logger.trace('AutoComplete.clearAutoComplete removing existing ac and exp.ac for', this.exp);
		this.ac = undefined;
		this.exp.ac = undefined;
		Logger.trace('AutoComplete.clearAutoComplete -> markForCheck');
		this.cdr.markForCheck();
	}
	newAutoComplete() :void {
		Logger.trace('AutoComplete.newAutoComplete');
		this.clearAutoComplete();
		if(this.exp.usesAC){
			this.acService.newAutoComplete(this.exp);
		}
	}
	onNewACR(ac :AutoCompleteResult) :void {
		const acExp :ExpressionMut = ac.expression,
			expFld :Fld = this.exp.fld,
			expOp :Op = this.exp.op;
		let foundMatch :boolean = ac.totals.foundMatch;
		Logger.log('AutoComplete.onNewACR', acExp, ac.totals);
		this.ac = ac;
		this.exp.ac = ac;
		if(foundMatch && (expOp === Op.equals || expOp === Op.inlist)){
			foundMatch = !!ac.results.find( (dc :DataCount) => Expression.trimAndCase(expFld, dc.data, true) === acExp.acValue );
		}
		this.acFetch.emit(foundMatch);
		if(acExp){
			if(!this.ac.totalsComplete){
				this.acService.fetchTotals(acExp);
			}else{
				Logger.trace('AutoComplete.onNewACR: totals already complete');
			}
		}else{
			Logger.trace('AutoComplete.onNewACR - !acExp');
		}
		this.exp.testFirst = (acExp && this.exp.fld === Fld.auto && acExp.fld !== Fld.auto ? acExp.fld : undefined);
		this.switchAutoToTestFirst(true);
		Logger.trace('AutoComplete.onNewACR -> markForCheck');
		this.cdr.markForCheck();
	}
	onNewSearchTotals(searchTotals :SearchTotals) :void {
		Logger.trace('AutoComplete.onNewSearchTotals');
		this.acService.onNewSearchTotals(searchTotals);
		Logger.trace('AutoComplete.onNewSearchTotals -> markForCheck');
		this.cdr.markForCheck();
	}
	switchAutoToTestFirst(onlyIfInlist :boolean) :void {
		if(this.exp.fld === Fld.auto && this.exp.testFirst && (!onlyIfInlist || this.exp.op === Op.inlist)){
			Logger.trace('AutoComplete.switchAutoToTestFirst');
			this.ctrlFld.setValue(this.exp.testFirst);
			this.exp.testFirst = undefined;
			Logger.trace('AutoComplete.switchAutoToTestFirst -> markForCheck');
			this.cdr.markForCheck();
		}
	}


// USED IN HTML:
	clicked(event :Event) :void {
		Logger.debug('AutoComplete.clicked event.target =', event.target);
		let target :HTMLElement = (event.target as HTMLElement);
		if(target.tagName === 'SPAN'){
			target = target.parentElement;
		}
		if(target.tagName === 'LI'){
			const html :string = target.innerHTML,
				value :string = html.replace(/<(.|\r|\n)+>/g, ''),
				singleValue :boolean = !html.match(/values\)<\/span>$/),
				op :Op = this.exp.op,
				saveSingle :boolean = singleValue && (op === Op.auto || op === Op.startswith || op === Op.equals),
				singleInlist :boolean = singleValue && op === Op.inlist;
			if(saveSingle){
				Logger.trace('AutoComplete.clicked single value - switch to equals');
				ExpressionValidators.skipProcessing = true;
				if(op !== Op.equals){
					this.ctrlOp.setValue(Op.equals);
				}
				this.switchAutoToTestFirst(false);
				ExpressionValidators.skipProcessing = false;
			}
			this.ctrlValue.setValue(AutoCompleteComponent.getNewAutocompleteValue(this.exp, value) + (singleInlist ? '|' : ''));
			this.click.emit(saveSingle);
		}
	}
}
