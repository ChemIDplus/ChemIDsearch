/* tslint:disable:no-null-keyword */

import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { ValidatorFn } from '@angular/forms/src/directives/validators';

import { Fld, Field } from '../../../domain/field';
import { Op, Operator } from '../../../domain/operator';
import { ToxT, ToxicityTest } from '../../../domain/toxicity-test';
import { ToxS, ToxicitySpecies } from '../../../domain/toxicity-species';
import { ToxR, ToxicityRoute } from '../../../domain/toxicity-route';
import { ToxE, ToxicityEffect } from '../../../domain/toxicity-effect';
import { ValidationResult } from '../../../util/validation-result';

import { Logger } from './../../../core/logger';

@Injectable()
export class ExpressionValidators {

	public static skipProcessing :boolean = false;

	static validate(formGroup :FormGroup) :ValidationResult {

		if(ExpressionValidators.skipProcessing){
			return null;
		}

		/* tslint:disable:no-string-literal */
		const ctrlFld :FormControl = (formGroup.controls['ctrlFld']) as FormControl,
			fld :Fld = Fld[Fld[ctrlFld.value]],
			ctrlOp :FormControl = (formGroup.controls['ctrlOp']) as FormControl,
			op :Op = Op[Op[ctrlOp.value]],
			ctrlValue :FormControl = (formGroup.controls['ctrlValue']) as FormControl,
			ctrlToxT :FormControl = (formGroup.controls['ctrlToxT']) as FormControl,
			toxT :ToxT = ToxT[ToxT[ctrlToxT.value]],
			ctrlToxS :FormControl = (formGroup.controls['ctrlToxS']) as FormControl,
			toxS :ToxS  = ToxS [ToxS [ctrlToxS.value]],
			ctrlToxR :FormControl = (formGroup.controls['ctrlToxR']) as FormControl,
			toxR :ToxR  = ToxR [ToxR [ctrlToxR.value]],
			ctrlToxE :FormControl = (formGroup.controls['ctrlToxE']) as FormControl,
			toxE :ToxE = ToxE[ToxE[ctrlToxE.value]];

		let value :string = ctrlValue.value + '';
		/* tslint:enable:no-string-literal */
		Logger.debug('ExpValidator validating ' + Field.getDisplay(fld) + ' ' + (op !== undefined  ? Operator.getDisplay(op) : '') + ' "' + value + '"');

		// TODO - I'd like a better way to clear the old validition error messages
		if(!ctrlValue.valid && (!ctrlValue.pristine || fld === Fld.toxicity)){
			Logger.trace('ExpValidator restarting validation to clear error messages');
			ctrlValue.updateValueAndValidity();
			return null;
		}
		if(!Operator.fldHasOp(fld, op)){
			Logger.trace('ExpValidator op about to change, skipping further validation this round');
			return null;
		}

		// tabNewline
		const v2 :string = value.replace(/(^[\r\n\t]+|[\r\n\t]+$)/g, '').replace(/[\r\n\t]+/g, '|');
		if(v2 !== value){
			Logger.log('ExpValidator tabNewline: auto-converting tabs and carriage returns to |');
			ctrlValue.setValue(v2);
			return null;
		}

		if(op === Op.regex){
			return null;
		}

		const hasAsterisk :boolean = !!value.match(/\*/),
			startsWith :boolean = hasAsterisk && !!value.match(/^\*?[^*]+\*$/),
			endsWith :boolean = hasAsterisk && !!value.match(/^\*[^*]*\*?$/),
			inlist :boolean = (op === Op.inlist),
			hasPipe :boolean = !!value.match(/\|/),
			hasMulti :boolean = hasPipe && !!value.match(/.+\|.+/);


		// wildcard
		if(hasAsterisk){
			Logger.log('ExpValidator wildcard: startsWith=' + startsWith + ' endsWith=' + endsWith);

			if(inlist){
				return ExpressionValidators.fail('wildcard_inlist', ctrlValue);
			}
			if(!Operator.autoReplaceAsterisk(op) || Fld.weight === fld){
				return ExpressionValidators.fail('wildcard_not_supported', ctrlValue);
			}
			if(!startsWith && !endsWith){
				return ExpressionValidators.fail('wildcard_internal', ctrlValue);
			}
			if((startsWith && (op === Op.startswith || op === Op.contains)) || (endsWith && (op === Op.endswith || op === Op.contains))){
				return ExpressionValidators.fail('wildcard_already_converted', ctrlValue);
			}

			// Else it is a reasonable startswith and/or endswith wildcard that needs to be auto-converted
			ExpressionValidators.skipProcessing = true;
			ctrlValue.setValue(value.replace(/\*/g, ''));
			let newOp :Op;
			if((startsWith || op === Op.startswith) && (endsWith || op === Op.endswith)){
				newOp = Op.contains;
			}else if(startsWith){
				newOp = Op.startswith;
			}else{
				newOp = Op.endswith;
			}
			Logger.log('ExpValidator wildcard: auto-converting asterisk to ' + Operator.getDisplay(newOp));
			ExpressionValidators.skipProcessing = false;
			ctrlOp.setValue(newOp);
			return null;
		}


		// pipe 1
		if(!inlist && hasPipe){
			if(Operator.fldHasOp(fld, Op.inlist)){
				if(value === '|'){
					ExpressionValidators.skipProcessing = true;
					ctrlValue.setValue('');
					ExpressionValidators.skipProcessing = false;
				}
				Logger.trace('ExpValidator pipe: auto-converting to inlist');
				ctrlOp.setValue(Op.inlist);
				return null;
			}else{
				return ExpressionValidators.fail('pipe_not_supported', ctrlValue);
			}
		}
		// pipe 2
		if(inlist && !hasPipe){
			Logger.trace('ExpValidator pipe: hasPipe=' + hasPipe + ' hasMulti=' + hasMulti + ' inlist=' + inlist);
			return ExpressionValidators.fail('inlist_not_correct', ctrlValue);
		}


		// fld regex
		let regex :RegExp = undefined,
			messageKey :string = undefined;
		switch(fld){
			case Fld.rn:
				messageKey = 'rn_not_correct';
				switch(op){
					case Op.auto:
						regex = /^([1-9]([0-9]{0,6}|[0-9]{1,6}-([0-9]{0,2}|[0-9]{2}-[0-9]?))|([1-9][0-9]{1,6}-[0-9]{2}-[0-9]\|)+[1-9][0-9]{1,6}-[0-9]{2}-[0-9])$/;
						break;
					case Op.equals:
						regex = /^[1-9][0-9]{1,6}-[0-9]{2}-[0-9]$/;
						break;
					case Op.inlist:
						regex = /^([1-9][0-9]{1,6}-[0-9]{2}-[0-9]\|)+[1-9][0-9]{1,6}-[0-9]{2}-[0-9]\|?$/;
						break;
					case Op.startswith:
						regex = /^[1-9]([0-9]{0,6}|[0-9]{1,6}-([0-9]{0,2}|[0-9]{2}-[0-9]?))$/;
						break;
					case Op.endswith:
						regex = /^(([1-9]?[0-9]{0,6}-[0-9]{2}|[0-9]{0,2})-)?[0-9]$/;
						break;
					case Op.contains:
						regex = /^[0-9]{0,7}(-[0-9]{0,1}|-[0-9]{2}(-[0-9]?)?)?$/;
						break;
					default:
						throw new Error('rn logic error');
				}
				break;
			case Fld.id:
				messageKey = 'id_not_correct';
				switch(op){
					case Op.auto:
						regex = /^((?=.{1,10}$)[a-zA-Z]{0,9}[0-9]*|((?=[a-zA-Z0-9]{10}\|)[a-zA-Z]*[0-9]+\|)+(?=.{10}$)[a-zA-Z]*[0-9]+)$/;
						break;
					case Op.equals:
						regex = /^(?=.{10}$)[a-zA-Z]*[0-9]+$/;
						break;
					case Op.inlist:
						regex = /^((?=[a-zA-Z0-9]{10}\|)[a-zA-Z]*[0-9]+\|)+(?=.{10}$)[a-zA-Z]*[0-9]+\|?$/;
						break;
					case Op.startswith:
						regex = /^(?=.{1,10}$)[a-zA-Z]{0,9}[0-9]*$/;
						break;
					case Op.endswith:
						regex = /^(?=.{1,10}$)[a-zA-Z]*[0-9]+$/;
						break;
					case Op.contains:
						regex = /^(?=.{1,10}$)[a-zA-Z]{0,9}[0-9]*$/;
						break;
					default:
						throw new Error('id logic error');
				}
				break;
			case Fld.unii:
				messageKey = 'unii_not_correct';
				switch(op){
					case Op.auto:
						regex = /^([a-zA-Z0-9]{1,10}|([a-zA-Z0-9]{10}\|)+[a-zA-Z0-9]{10})$/;
						break;
					case Op.equals:
						regex = /^[a-zA-Z0-9]{10}$/;
						break;
					case Op.inlist:
						regex = /^([a-zA-Z0-9]{10}\|)+[a-zA-Z0-9]{10}\|?$/;
						break;
					case Op.startswith:
					case Op.endswith:
					case Op.contains:
						regex = /^[a-zA-Z0-9]{1,10}$/;
						break;
					default:
						throw new Error('unii logic error');
				}
				break;
			case Fld.inchikey:
				messageKey = 'inchikey_not_correct';
				switch(op){
					case Op.auto:
						regex = /^(([a-zA-Z]{1,14}|[a-zA-Z]{14}-([a-zA-Z]{0,10}|[a-zA-Z]{10}-[a-zA-Z]?))|([a-zA-Z]{14}-[a-zA-Z]{10}-[a-zA-Z]\|)+[a-zA-Z]{14}-[a-zA-Z]{10}-[a-zA-Z])$/;
						break;
					case Op.equals:
						regex = /^[a-zA-Z]{14}-[a-zA-Z]{10}-[a-zA-Z]$/;
						break;
					case Op.inlist:
						regex = /^([a-zA-Z]{14}-[a-zA-Z]{10}-[a-zA-Z]\|)+[a-zA-Z]{14}-[a-zA-Z]{10}-[a-zA-Z]\|?$/;
						break;
					case Op.startswith:
						regex = /^([a-zA-Z]{1,14}|[a-zA-Z]{14}-([a-zA-Z]{0,10}|[a-zA-Z]{10}-[a-zA-Z]?))$/;
						break;
					case Op.endswith:
						regex = /^(([a-zA-Z]{0,14}-[a-zA-Z]{10}|[a-zA-Z]{0,10})-)?[a-zA-Z]$/;
						break;
					case Op.contains:
						regex = /^[a-zA-Z-]{1,27}$/;
						break;
					default:
						throw new Error('inchikey logic error');
				}
				break;
			case Fld.weight:
				if(op === Op.inlist){
					regex = /^([0-9]+(\.[0-9]{1,4})?\|)+[0-9]+(\.[0-9]{1,4})?\|?$/;
					messageKey = 'number_inlist_not_correct';
				}else if(op === Op.between){
					regex = /^[0-9]+(\.[0-9]{1,4})?[ -][0-9]+(\.[0-9]{1,4})?$/;
					messageKey = 'number_between_not_correct';
				}else{
					regex = /^[0-9]+(\.[0-9]{1,4})?$/;
					messageKey = 'number_single_not_correct';
				}
				break;
		}// end switch(fld)
		if(regex && !value.match(regex)){
			return ExpressionValidators.fail(messageKey, ctrlValue);
		}


		if(inlist){
			if(!hasMulti){
				return ExpressionValidators.fail('inlist_not_correct', ctrlValue);
			}
			value = value.replace(/\|$/, '').replace(/.*\|/, '');
			Logger.log('ExpValidator inlist value reduced to last term: ' + value);
		}
		// empty
		if(value === '' && fld !== Fld.toxicity){
			Logger.trace('ExpValidator Empty');
			if(op === Op.inlist){
				messageKey = 'inlist_not_correct';
			}else if(op === Op.between){
				messageKey = 'number_between_not_correct';
			}else{
				messageKey = 'single_value_empty';
			}
			return ExpressionValidators.fail(messageKey, ctrlValue);
		}
		// Toxicity empty
		if(fld === Fld.toxicity && value === '' && toxT === ToxT.any && toxS === ToxS.any && toxR === ToxR.any && toxE === ToxE.any){
			messageKey = 'tox_single_value_empty';
			return ExpressionValidators.fail(messageKey, ctrlValue);
		}

		// auto
		if(value.length < 3 && (fld === Fld.auto || op === Op.auto)){
			return ExpressionValidators.fail('auto_too_short', ctrlValue);
		}

		// Valid
		return null;
	}


	static percentRange(ctrl :FormControl) :ValidationResult {
		Logger.trace('ExpValidator.percentRange');
		const v :string = ctrl.value + '';
		let n :number;
		try{
			n = parseInt(v, 10);
			if(n >= 40 && n <= 100){
				return null;
			}
			// else pass through to error below
		}catch(e){
			// pass through to error below
		}
		return ExpressionValidators.fail('isNot_40_to_100', ctrl);
	}


	static fail(messageKey :string, ctrl :FormControl, replaceError :boolean = false) :ValidationResult {
		Logger.debug('ExpValidator.fail ' + messageKey);
		if(!ctrl.valid){
			if(replaceError){
				ctrl.setErrors(null);
			}
		}
		const err :ValidationResult = {};
		err[messageKey] = true;
		ctrl.setErrors(err);
		return err;
	}
	static pass(messageKey :string, ctrl :FormControl) :void {
		Logger.debug('ExpValidator.pass ' + messageKey);
		if(ctrl.hasError(messageKey)){
			ctrl.setErrors(null);
		}
	}

	static errorAllowsAutocomplete(op :Op, ctrl :FormControl) :boolean {
		Logger.trace('ExpValidator.errorAllowsAutocomplete');
		return (
				(op === Op.equals || op === Op.inlist)
				&& (
						ctrl.hasError('rn_not_correct')
					|| ctrl.hasError('id_not_correct')
					|| ctrl.hasError('unii_not_correct')
					|| ctrl.hasError('inchikey_not_correct')
					|| ctrl.hasError('autocomplete_no_matching_results')
				)
			)
			||
			(
				op === Op.inlist
				&& (	ctrl.hasError('inlist_not_correct')
					|| ctrl.hasError('autocomplete_no_matching_term')
				)
			)
		;
	}

}
