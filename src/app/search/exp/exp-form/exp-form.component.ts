import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Expression, ExpressionMut } from './../../../domain/expression';
import { Fld, Field } from './../../../domain/field';
import { Op, Operator } from './../../../domain/operator';
import { PPF, PPField } from './../../../domain/pp-field';
import { PPMT, PPMeasurementType } from './../../../domain/pp-measurement-type';
import { Search } from './../../../domain/search';
import { ToxE, ToxicityEffect } from './../../../domain/toxicity-effect';
import { ToxR, ToxicityRoute } from './../../../domain/toxicity-route';
import { ToxS, ToxicitySpecies } from './../../../domain/toxicity-species';
import { ToxT, ToxicityTest } from './../../../domain/toxicity-test';

import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { ExpressionValidators } from './exp-validators';

import { AppService } from './../../../core/app.service';
import { SearchService } from './../../../core/search.service';

import { Logger } from './../../../core/logger';

@Component({
	selector: 'app-exp-form',
	templateUrl: './exp-form.component.html',
	styleUrls: ['./exp-form.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpFormComponent implements OnInit, AfterViewInit, OnDestroy {

	private static readonly KEY_13 :number = 13;

	exp :ExpressionMut;

	searchForEdit :Search;
	expressionForEdit :Expression;

	form :FormGroup;
	ctrlPercent :FormControl;
	ctrlFld :FormControl;
	ctrlOp :FormControl;
	ctrlValue :FormControl;
	ctrlValueBoolean :FormControl;
	ctrlPPF :FormControl;
	ctrlPPMT :FormControl;
	ctrlToxT :FormControl;
	ctrlToxS :FormControl;
	ctrlToxR :FormControl;
	ctrlToxE :FormControl;

	editNotCreate :boolean = false;
	isStructure :boolean = false;

	@ViewChild('textareaExpValues') private readonly textareaExpValuesElementRef :ElementRef;
	@ViewChild(AutoCompleteComponent) private readonly autoComplete :AutoCompleteComponent;

	private currentOps :ReadonlyArray<Op>;
	private isNavigatingToList :boolean = false;
	private readonly subscriptions :Subscription[] = [];

	constructor(
		readonly app :AppService,
		readonly searchService :SearchService,
		readonly formBuilder :FormBuilder,
		readonly router :Router,
		readonly cdr :ChangeDetectorRef
	){}
	ngOnInit() :void {
		Logger.debug('ExpForm.onInit');
		this.searchForEdit = this.app.searchForEdit;
		this.expressionForEdit = this.app.expressionForEdit;
		const exp :Expression = this.expressionForEdit;
		if(exp === undefined){
			this.exp = this.createExpression();
		}else{
			this.exp = exp.mutable();
			this.isStructure = this.exp.fld === Fld.structure;
			this.editNotCreate = true;
			if(this.exp.fld === Fld.toxicity && this.exp.op === undefined){
				this.exp.op = Op.between;
			}
		}
		// Template's '<auto-complete [exp]="exp"' seems equivalent to ac.exp = this.exp. The result is that this.exp must be set first AND later changing this.exp to point to a different exp does not affect ac.exp
		Logger.log('ExpForm.onInit this.exp =', this.exp);

		this.ctrlFld = new FormControl(this.exp.fld);
		this.ctrlOp = new FormControl(this.exp.op);
		this.ctrlPercent = new FormControl(this.exp.simPercent || Expression.DEFAULT_SIM_PERCENT, ExpressionValidators.percentRange);
		this.ctrlValue = new FormControl(this.exp.value);
		this.ctrlValueBoolean = new FormControl(true);
		this.currentOps = this.ops;
		this.ctrlPPF = new FormControl(this.exp.ppf);
		this.ctrlPPMT = new FormControl(this.exp.ppmt || PPMT.either);
		this.ctrlToxT = new FormControl(this.exp.toxT || ToxT.any);
		this.ctrlToxS = new FormControl(this.exp.toxS || ToxS.any);
		this.ctrlToxR = new FormControl(this.exp.toxR || ToxR.any);
		this.ctrlToxE = new FormControl(this.exp.toxE || ToxE.any);

		this.form = this.formBuilder.group(
			{
				'ctrlFld':this.ctrlFld,
				'ctrlOp':this.ctrlOp,
				'ctrlPercent':this.ctrlPercent,
				'ctrlValue':this.ctrlValue,
				'ctrlValueBoolean':this.ctrlValueBoolean,
				'ctrlPPF':this.ctrlPPF,
				'ctrlPPMT':this.ctrlPPMT,
				'ctrlToxT':this.ctrlToxT,
				'ctrlToxS':this.ctrlToxS,
				'ctrlToxR':this.ctrlToxR,
				'ctrlToxE':this.ctrlToxE
			},
			{
				'validator':ExpressionValidators.validate
			});

		this.subscriptions.push(this.ctrlFld.valueChanges.subscribe( (v :string) => this.onFieldChanges(v) ));
		this.subscriptions.push(this.ctrlOp.valueChanges.subscribe( (v :string) => this.onOperatorChanges(v) ));
		this.subscriptions.push(this.ctrlPercent.valueChanges.subscribe( (v :string) => this.onPercentChanges(v) ));
		this.subscriptions.push(this.ctrlValue.valueChanges.subscribe( (v :string) => this.onValueChanges(v) ));
		this.subscriptions.push(this.ctrlValueBoolean.valueChanges.subscribe( (v :string) => this.onValueBooleanChanges(v) ));
		this.subscriptions.push(this.ctrlPPF.valueChanges.subscribe( (v :string) => this.onPPFieldChanges(v) ));
		this.subscriptions.push(this.ctrlPPMT.valueChanges.subscribe( (v :string) => this.onPPMeasurementTypeChanges(v) ));
		this.subscriptions.push(this.ctrlToxT.valueChanges.subscribe( (v :string) => this.onToxicityTestChanges(v) ));
		this.subscriptions.push(this.ctrlToxS.valueChanges.subscribe( (v :string) => this.onToxicitySpeciesChanges(v) ));
		this.subscriptions.push(this.ctrlToxR.valueChanges.subscribe( (v :string) => this.onToxicityRouteChanges(v) ));
		this.subscriptions.push(this.ctrlToxE.valueChanges.subscribe( (v :string) => this.onToxicityEffectChanges(v) ));

		setTimeout( () => this.setFocus() );
	}
	ngAfterViewInit() :void {
		Logger.debug('ExpForm.afterViewInit');
		this.subscriptions.push(this.form.valueChanges.subscribe( () => this.onFormChanges() ));
		if(this.expressionForEdit && this.exp.usesAC && !this.exp.ac){
			Logger.log('ExpForm.afterViewInit -> newAutoComplete');
			// We know it is valid because we're editing, so there is no concern about temporarily failing autocomplete_pending
			setTimeout( () => this.autoComplete.newAutoComplete() );
		}
	}
	ngOnDestroy() :void {
		Logger.debug('ExpForm.onDestroy');
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
		this.app.expressionForEdit = undefined;
		if(!this.isNavigatingToList){
			this.app.searchForEdit = undefined;
		}
	}

	/** flds called at least once per change, keep it quick! */
	get flds() :ReadonlyArray<Fld> {
		Logger.trace('ExpForm.flds');
		return Field.flds;
	}
	/** ops called at least once per change, keep it quick! */
	get ops() :ReadonlyArray<Op> {
		Logger.trace('ExpForm.ops');
		return Operator.getOps(this.exp.fld);
	}
	get PPFs() :ReadonlyArray<PPF> {
		Logger.trace('ExpForm.PPFs');
		return PPField.ppfs;
	}
	get PPMTs() :ReadonlyArray<PPMT> {
		Logger.trace('ExpForm.PPMTs');
		return PPMeasurementType.ppmts;
	}
	get toxTs() :ReadonlyArray<ToxT> {
		Logger.trace('ExpForm.toxTs');
		return ToxicityTest.toxTs;
	}
	get toxSs() :ReadonlyArray<ToxS> {
		Logger.trace('ExpForm.toxSs');
		return ToxicitySpecies.toxSs;
	}
	get toxRs() :ReadonlyArray<ToxR> {
		Logger.trace('ExpForm.toxRs');
		return ToxicityRoute.toxRs;
	}
	get toxEs() :ReadonlyArray<ToxE> {
		Logger.trace('ExpForm.toxEs');
		return ToxicityEffect.toxEs;
	}
	/** fldMultiOnly called at least once per change, keep it quick! */
	get fldMultiOnly() :boolean {
		Logger.trace('ExpForm.fldMultiOnly');
		return Field.multiOnly(this.exp.fld);
	}
	/** fldBool called at least once per change, keep it quick! */
	get fldBool() :boolean {
		Logger.trace('ExpForm.fldBool');
		return Field.bool(this.exp.fld);
	}
	/** fldPPsmt called at least once per change, keep it quick! */
	get fldPP() :boolean {
		Logger.trace('ExpForm.fldPP');
		return this.exp.fld === Fld.physicalproperty;
	}
	/** fldTox called at least once per change, keep it quick! */
	get fldTox() :boolean {
		Logger.trace('ExpForm.fldTox');
		return this.exp.fld === Fld.toxicity;
	}

	/** opUsesPercent called at least once per change, keep it quick! */
	get opUsesPercent() :boolean {
		Logger.trace('ExpForm.opUsesPercent');
		return (this.exp.op !== undefined ? Operator.usesPercent(this.exp.op) : false);
	}
	/** hasExpression called at least once per change, keep it quick! */
	get hasExpression() :boolean {
		Logger.trace('ExpForm.hasExpression');
		return this.searchForEdit.exps.length >= 1;
	}


	onFieldChanges(v :string) :void {
		Logger.trace('ExpForm.onFieldChanges');
		const oldFld :Fld = this.exp.fld;
		const oldOps :ReadonlyArray<Op> = this.ops;
		this.exp.fld = +v;
		const newOps :ReadonlyArray<Op> = this.ops;
		this.isStructure = this.exp.fld === Fld.structure;
		if(this.currentOps !== newOps){
			this.currentOps = newOps;

			if (oldOps === Operator.autoOps && newOps === Operator.idOps){
				Logger.trace('field change NOT updating operator');
			}else{
				setTimeout( () => {
					// Using timeout to allow the dom's select to be updated with the new ops
					const op :Op = this.ops[0];
					Logger.trace('field change updating op to ' + Operator.getDisplay(op));
					this.ctrlOp.setValue(op);
				});
			}
		}
		if(this.fldBool){
			this.ctrlValue.setValue('' + this.ctrlValueBoolean.value);
		}
		if(this.fldPP){
			this.ctrlPPF.setValue(PPF.meltingpoint);
			this.ctrlPPMT.setValue(PPMT.either);
		}else if(oldFld === Fld.physicalproperty){
			this.ctrlPPF.setValue('');
			this.ctrlPPMT.setValue('');
		}
		if(this.fldTox){
			this.ctrlToxT.setValue(ToxT.any);
			this.ctrlToxS.setValue(ToxS.any);
			this.ctrlToxR.setValue(ToxR.any);
			this.ctrlToxE.setValue(ToxE.any);
		}else if(oldFld === Fld.toxicity){
			this.ctrlToxT.setValue('');
			this.ctrlToxS.setValue('');
			this.ctrlToxR.setValue('');
			this.ctrlToxE.setValue('');
		}
	}
	onOperatorChanges(v :string) :void {
		Logger.trace('ExpForm.onOperatorChanges');
		if(!this.ctrlPercent.valid){
			this.ctrlPercent.setValue(Expression.DEFAULT_SIM_PERCENT);
		}
		this.exp.op = +v;
		this.autoComplete.switchAutoToTestFirst(true);
	}
	onPercentChanges(v :string) :void {
		Logger.trace('ExpForm.onPercentChanges');
		this.exp.simPercent = +v;
	}
	/** onValueChanges called once on every input keypress */
	onValueChanges(v :string) :void {
		Logger.trace('ExpForm.onValueChanges');
		this.exp.value = v;
		this.resizeTextarea();
	}
	onValueBooleanChanges(v :string) :void {
		Logger.trace('ExpForm.onValueBooleanChanges');
		this.ctrlValue.setValue(v);
	}
	onPPFieldChanges(v :string) :void {
		Logger.trace('ExpForm.onPPFieldChanges');
		this.exp.ppf = +v;
	}
	onPPMeasurementTypeChanges(v :string) :void {
		Logger.trace('ExpForm.onPPMeasurementTypeChanges');
		this.exp.ppmt = +v;
	}
	onToxicityTestChanges(v :string) :void {
		Logger.trace('ExpForm.onToxicityTestChanges');
		this.exp.toxT = +v;
	}
	onToxicitySpeciesChanges(v :string) :void {
		Logger.trace('ExpForm.onToxicitySpeciesChanges');
		this.exp.toxS = +v;
	}
	onToxicityRouteChanges(v :string) :void {
		Logger.trace('ExpForm.onToxicityRouteChanges');
		this.exp.toxR = +v;
	}
	onToxicityEffectChanges(v :string) :void {
		Logger.trace('ExpForm.onToxicityEffectChanges');
		this.exp.toxE = +v;
	}
	/** onFormChanges - called on everything! */
	onFormChanges() :void {
		Logger.trace('ExpForm.onFormChanges');
		if( !ExpressionValidators.skipProcessing && this.exp.usesAC && (this.ctrlValue.valid || ExpressionValidators.errorAllowsAutocomplete(this.exp.op, this.ctrlValue) ) ){
			ExpressionValidators.fail('autocomplete_pending', this.ctrlValue);
			this.autoComplete.newAutoComplete();
		}else{
			this.autoComplete.clearAutoComplete();
		}
		this.cdr.detectChanges();
	}
	setFocus() :void {
		Logger.trace('ExpForm.setFocus');
		// Removed Renderer for v7 upgrade. Issue at https://github.com/angular/angular/issues/15674
		this.textareaExpValuesElementRef.nativeElement.focus();
	}
	/** resizeTextarea called once on every input keypress */
	resizeTextarea() :void {
		Logger.trace('ExpForm.resizeTextarea');
		const element :HTMLTextAreaElement = this.textareaExpValuesElementRef.nativeElement;
		element.style.height = '0';
		element.style.height = element.scrollHeight + 'px';
	}
	acFetched(foundMatch :boolean) :void {
		Logger.trace('ExpForm.acFetched');
		ExpressionValidators.pass('autocomplete_pending', this.ctrlValue);
		if(!foundMatch){
			ExpressionValidators.fail(this.exp.op === Op.inlist ? 'autocomplete_no_matching_term' : 'autocomplete_no_matching_results', this.ctrlValue, true);
		}
		this.cdr.detectChanges();
	}
	acClicked(saveSingle :boolean) :void {
		Logger.trace('ExpForm.acClicked');
		if(saveSingle){
			this.save();
		}else{
			this.setFocus();
		}
	}

// USED IN HTML (cannot be static):
/* tslint:disable:prefer-function-over-method */

/** getFieldDisplay called 16 times per change (once per every field)! Keep it quick! */
	getFieldDisplay(fld :Fld) :string {
		Logger.trace('ExpForm.getFieldDisplay');
		return Field.getDisplay(fld);
	}
	/** getOperatorDisplay called 5-6 times per change (once per every active operator)! Keep it quick! */
	getOperatorDisplay(op :Op) :string {
		Logger.trace('ExpForm.getOperatorDisplay');
		return Operator.getDisplay(op);
	}
	/** getPPFieldDisplay called 8 times per change (if fld=pp) */
	getPPFieldDisplay(ppf :PPF) :string {
		Logger.log('ExpForm.getPPFieldDisplay');
		return PPField.getDisplay(ppf);
	}
	/** getPPMeasurementTypeDisplay called 3 times per change (if fld=pp) */
	getPPMeasurementTypeDisplay(ppmt :PPMT) :string {
		Logger.log('ExpForm.getPPMeasurementTypeDisplay');
		return PPMeasurementType.getDisplay(ppmt);
	}
	/** getToxicityTestDisplay called 7 times per change (if fld=toxicity) */
	getToxicityTestDisplay(toxT :ToxT) :string {
		Logger.log('ExpForm.getToxicityTestDisplay');
		return ToxicityTest.getDisplay(toxT);
	}
	/** getToxicitySpeciesDisplay called 18 times per change (if fld=toxicity) */
	getToxicitySpeciesDisplay(toxS :ToxS) :string {
		Logger.log('ExpForm.getToxicitySpeciesDisplay');
		return ToxicitySpecies.getDisplay(toxS);
	}
	/** getToxicityRouteDisplay called 26 times per change (if fld=toxicity) */
	getToxicityRouteDisplay(toxR :ToxR) :string {
		Logger.log('ExpForm.getToxicityRouteDisplay');
		return ToxicityRoute.getDisplay(toxR);
	}
	/** getToxicityEffectDisplay called 24 times per change (if fld=toxicity) */
	getToxicityEffectDisplay(toxE :ToxE) :string {
		Logger.log('ExpForm.getToxicityEffectDisplay');
		return ToxicityEffect.getDisplay(toxE);
	}
	/** onKeyPress called once on every input keypress */
	onKeyPress(event :KeyboardEvent) :void {
		Logger.trace('ExpForm.onKeyPress');
		if(event.keyCode === ExpFormComponent.KEY_13 && this.form.valid){
			this.save();
		}
	}

	navToList() :void {
		Logger.trace('ExpForm.navToList');
		// Does not save.
		this.isNavigatingToList = true;
		this.router.navigate(['/']);
	}
	save() :void {
		Logger.trace('ExpForm.save');
		if(!this.opUsesPercent){
			this.exp.simPercent = undefined;
		}
		let exp2 :ExpressionMut = this.exp;
		if(this.exp.fld === Fld.auto || this.exp.op === Op.auto){
			exp2 = this.exp.ac.expression;
			exp2.ac = this.exp.ac;
		}
		if(exp2.op === Op.inlist){
			exp2.value = exp2.value.replace(/\|$/, '');
		}
		const exp :Expression = exp2.immutable();
		let search :Search;
		if(!this.expressionForEdit || exp.url !== this.expressionForEdit.url){
			search = this.searchForEdit;
			if(this.expressionForEdit){
				Logger.debug('ExpForm REPLACING', this.expressionForEdit, 'WITH', exp);
				search = search.minusExpression(this.expressionForEdit);
			}else{
				Logger.debug('ExpForm ADDING', exp);
			}
			this.app.searchForEdit = search.plusExpression(exp);
		}else{
			Logger.debug('ExpForm saved but no change');
		}
		this.navToList();
	}
	clear() :void {
		Logger.debug('ExpForm.clear');
		// Can't just set this.exp to something else, as this.autoComplete.exp will then be a different exp
		this.exp.setData(this.createExpression());
		ExpressionValidators.skipProcessing = true;
		this.ctrlFld.setValue(this.exp.fld/*, {emitModelToViewChange:false}*/);
		this.ctrlOp.setValue(this.exp.op/*, {emitModelToViewChange:false}*/);
		this.ctrlPercent.setValue(Expression.DEFAULT_SIM_PERCENT/*, {emitModelToViewChange:false}*/);
		ExpressionValidators.skipProcessing = false;
		this.ctrlValue.setValue(this.exp.value);
		this.ctrlPPF.setValue(this.exp.ppf);
		this.ctrlPPMT.setValue(this.exp.ppmt);
		this.ctrlToxT.setValue(this.exp.toxT);
		this.ctrlToxS.setValue(this.exp.toxS);
		this.ctrlToxR.setValue(this.exp.toxR);
		this.ctrlToxE.setValue(this.exp.toxE);
		this.autoComplete.clearAutoComplete();
	}

	private createExpression(fld :Fld = Fld.auto, op :Op = Op.auto, value :string = '', not ? :boolean, simPercent ? :number, ppf ? :PPF, ppmt ? :PPMT, toxtest ? :ToxT, toxspecies ? :ToxS, toxroute ? :ToxR, toxeffect ? :ToxE) :ExpressionMut {
		Logger.debug('ExpForm.createExpression');
		return new ExpressionMut(fld, op, value, not, simPercent, ppf, ppmt, toxtest, toxspecies, toxroute, toxeffect);
	}
}
