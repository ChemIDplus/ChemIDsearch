import { Component, Input, OnChanges, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Element } from '../../../domain/element';
import { IDStructure } from './../../../domain/id-structure';
import { Structure } from '../../../domain/structure';
import { Substance } from '../../../domain/substance';
import { TypeElements } from '../../../domain/type-elements';
import { Toxicity } from '../../../domain/toxicity';
import { PhysicalProp } from '../../../domain/physical-prop';

import { SearchService } from '../../../core/search.service';

import { Logger } from './../../../core/logger';

@Component({
	selector: 'app-substance',
	templateUrl: './substance.component.html',
	styleUrls: ['./substance.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubstanceComponent implements OnChanges, OnInit, OnDestroy {
	@Input() substance :Substance; // Immutable
	structure :Structure;

	oneAtATime :boolean = true;

	private inited :boolean = false;
	private subscriptions :Subscription[] = [];

	constructor(readonly searchService :SearchService, readonly cdr :ChangeDetectorRef){}

	/* tslint:disable-next-line:no-any */
	ngOnChanges(changes :any) :void {
		Logger.debug('Substance.onChanges ' + this.substance.rn_id);
		if(this.inited && this.substance.summary.weight){
			this.searchService.nextStructuresFromIDIKs = [this.substance.idik];
		}
	}

	ngOnInit() :void {
		Logger.debug('Substance.onInit ' + this.substance.rn_id);
		this.subscriptions.push(this.searchService.oStructuresFromIDIKs.subscribe( (a :IDStructure[]) => this.onNewStructuresFromSummaries(a) ));
		this.inited = true;
		if(this.substance.summary.weight){
			this.searchService.nextStructuresFromIDIKs = [this.substance.idik];
		}
	}

	ngOnDestroy() :void {
		Logger.debug('Substance.onDestroy ' + this.substance.rn_id);
		this.subscriptions.forEach( (sub :Subscription) => sub.unsubscribe() );
	}

	get typeElementsArrays() :ReadonlyArray<TypeElements<Element>>[] {
		Logger.trace('Substance.typeElementArrays');
		const ret :ReadonlyArray<TypeElements<Element>>[] = [],
			s :Substance = this.substance;
		if(s.notes){
			ret.push( s.notes );
		}
		if(s.categories){
			ret.push( s.categories );
		}
		if(s.formulas){
			ret.push( s.formulas );
		}
		if(s.resources){
			ret.push( s.resources );
		}
		if(s.names){
			ret.push( s.names );
		}
		if(s.numbers){
			ret.push( s.numbers );
		}
		return ret;
	}
	get name() :string {
		Logger.trace('Substance.name');
		return this.substance.summary.name;
	}
	get routerLink() :string[] {
		Logger.trace('Substance.routerLink');
		return this.substance.summary.routerLink;
	}
	get rn_id() :string {
		Logger.trace('Substance.rn_id');
		return this.substance.rn_id;
	}
	get formula() :string {
		Logger.trace('Substance.formula');
		return this.substance.summary.formula;
	}
	get mesh() :string {
		Logger.trace('Substance.mesh');
		return this.substance.summary.mesh;
	}
	get citations() :number {
		Logger.trace('Substance.citations');
		return this.substance.summary.citations;
	}
	get weight() :number {
		Logger.trace('Substance.weight');
		return this.substance.summary.weight;
	}
	sharedTypeLabel(typeElementsArray :ReadonlyArray<TypeElements<Element>>) :string {
		Logger.trace('Substance.sharedTypeLabel');
		return typeElementsArray[0].type.sharedLabel;
	}
	get toxicityList() :ReadonlyArray<Toxicity> {
		Logger.trace('Substance.toxicityList');
		return this.substance.toxicityList;
	}
	get physicalProps() :ReadonlyArray<PhysicalProp> {
		Logger.trace('Substance.physicalProps');
		return this.substance.physicalProps;
	}

	private onNewStructuresFromSummaries(a :IDStructure[]) :void {
		Logger.trace('Substance.onNewStructuresFromSummaries');
		this.structure = a[0].structure;
		// this.structure change isn't picked up as it is not an input. Firing markForCheck shows this change.
		Logger.trace('Substance.onNewStructuresFromSummaries -> markForCheck');
		this.cdr.markForCheck();
	}
}
