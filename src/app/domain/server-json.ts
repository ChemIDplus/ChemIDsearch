import { DataCount } from './data-count';
import { Detail } from './detail';
import { Element } from './element';
import { Expression, ExpressionMut } from './expression';
import { Fld } from './field';
import { IDSimilarity } from './id-similarity';
import { Mt } from './measurement-type';
import { Op } from './operator';
import { PhysicalProp } from './physical-prop';
import { RNIDName } from './rn-id-name';
import { Resource } from './resource';
import { Source } from './source';
import { Structure } from './structure';
import { StructureDetails } from './structure-details';
import { Substance } from './substance';
import { SubstancesResult } from './substances-result';
import { Summary } from './summary';
import { Totals } from './totals';
import { ToxDose } from './tox-dose';
import { ToxEffect } from './tox-effect';
import { Toxicity } from './toxicity';
import { ToxJournal } from './tox-journal';
import { ToxT } from './toxicity-test';
import { ToxS } from './toxicity-species';
import { ToxR } from './toxicity-route';
import { ToxE } from './toxicity-effect';
import { Type } from './type';
import { TypeElements } from './type-elements';
import { ValueCountsResult } from './value-counts-result';

import { Logger } from './../core/logger';

// These interfaces match the server's JSON representation of the objects.
// Make sure the help matches: \ChemIDsearch\src\app\api\json-results\json-results.component.html

export interface SubstancesResultServerJSON {
	total :number;
	start ? :number;
	end ? :number;
	results ? :SubstanceServerJSON[];
}
interface SubstanceServerJSON {
	id :string;
	lastMod ? :Date;
	summary ? :SummaryServerJSON;
	notes ? :TypeElementsServerJSON<DetailServerJSON>[];
	categories ? :TypeElementsServerJSON<DetailServerJSON>[];
	numbers ? :TypeElementsServerJSON<DetailServerJSON>[];
	names ? :TypeElementsServerJSON<DetailServerJSON>[];
	formulas ? :TypeElementsServerJSON<DetailServerJSON>[];
	resources ? :TypeElementsServerJSON<ResourceServerJSON>[];
	toxicityList ? :ToxicityServerJSON[];
	physicalProps ? :PhysicalPropServerJSON[];
	structureDetails ? :StructureDetailsServerJSON;
	image ? :string;
	similarity ? :number;
}
interface SummaryServerJSON {
	/** canonical URL */
	u :string;
	/** name */
	na :string;
	/** inchikey */
	ik ? :string;
	/** formula */
	f ? :string;
	/** weight */
	w ? :number;
	/** has3D */
	'3d' ? :boolean;
	/** mesh */
	mh ? :string;
	/** citations */
	ci ? :number;
	/** rn */
	rn ? :string;
}

interface TypeElementsServerJSON<T extends ElementServerJSON> {
	t :number;
	e :T[];
}
interface ElementServerJSON {
	/** data */
	d :string;
}
interface DetailServerJSON extends ElementServerJSON {
	/** sources */
	s ? :string[];
}
interface ResourceServerJSON extends ElementServerJSON {
	/** postUrl */
	u ? :string;
}

interface ToxicityServerJSON {
	/** organism */
	o :string;
	/** testType */
	t :string;
	/** route */
	r :string;
	/** dose */
	d :ToxDoseServerJSON;
	/** effectList */
	e ? :ToxEffectServerJSON[];
	/** journal */
	j :ToxJournalServerJSON;
}
interface ToxDoseServerJSON {
	/** modifier */
	m ? :string;
	/** reported */
	r :string;
	/** reportedUnits */
	u :string;
	/** normalized */
	n ? :string;
	/** normalizedUnits */
	nu ? :string;
}
interface ToxEffectServerJSON {
	/** systemDesc */
	s ? :string;
	/** toxicDesc */
	t ? :string;
}
interface ToxJournalServerJSON {
	/** title */
	t :string;
	/** vol */
	v ? :string;
	/** page */
	p ? :string;
	/** year */
	y ? :string;
	/** pubmedId */
	i ? :string;
}

interface PhysicalPropServerJSON {
	/** property */
	p :string;
	/** value */
	v :string;
	/** units */
	u :string;
	/** temperature */
	t ? :string;
	/** source */
	s :string;
}

interface StructureDetailsServerJSON {
	/** weight */
	w ? :number;
	/** inchikey */
	ik ? :string;
	/** inchi */
	i ? :string;
	/** smiles */
	s ? :string;
	/** mol */
	m ? :string;
	/** mol3d */
	m3 ? :string;
}


// Make sure the help matches: \ChemIDsearch\src\app\api\reference-data\reference-data.component.html

interface SourceServerJSON {
	id :string;
	/** name */
	n :string;
	/** description */
	d :string;
	/** elementTypeId */
	t :number;
	/** preUrl */
	u :string;
}
interface TypeServerJSON {
	id :number;
	name :string;
	table :string;
}


// Make sure the help matches: \ChemIDsearch\src\app\api\value-counts\value-counts.component.html

interface ValueCountsResultServerJSON {
	totals :TotalsServerJSON;
	expression ? :ExpressionServerJSON;
	results ? :DataCountServerJSON[];
	alternatives ? :RNIDNameServerJSON[];
}
export interface TotalsServerJSON {
	substances ? :number;
	values ? :number;
}
interface ExpressionServerJSON {
	field :string;
	operator :string;
	value :string;
	not ? :boolean;
	similarity ? :number;
	measurement ? :string;
	toxtest ? :string;
	toxspecies ? :string;
	toxroute ? :string;
	toxeffect ? :string;
}
interface DataCountServerJSON {
	/** substances */
	s :number;
	/** data */
	d :string;
}
interface RNIDNameServerJSON {
	rn ? :string;
	id ? :string;
	/** name */
	n :string;
}



export class ServerJSON {

	static dataCount(sj :DataCountServerJSON) :DataCount {
		return new DataCount(sj.s, sj.d);
	}
	static detail(sj :DetailServerJSON) :Detail {
		if(sj){
			Logger.trace2('ServerJSON.detail');
			return new Detail(sj.d, sj.s);
		}
	}
	static expression(sj :ExpressionServerJSON) :Expression {
		const fld :Fld = Fld[sj.field.toLowerCase()],
			op :Op = Op[sj.operator.toLowerCase()],
			value :string = sj.value,
			not :boolean = sj.not,
			simPercent :number = sj.similarity,
			mt :Mt = sj.measurement && Mt[sj.measurement.toLowerCase()],
			toxT :ToxT = sj.toxtest && ToxT[sj.toxtest.toLowerCase()],
			toxS :ToxS = sj.toxspecies && ToxS[sj.toxspecies.toLowerCase()],
			toxR :ToxR = sj.toxroute && ToxR[sj.toxroute.toLowerCase()],
			toxE :ToxE = sj.toxeffect && ToxE[sj.toxeffect.toLowerCase()];
		return new Expression(fld, op, value, not, simPercent, mt, toxT, toxS, toxR, toxE);
	}
	static expressionMut(sj :ExpressionServerJSON) :ExpressionMut {
		const fld :Fld = Fld[sj.field.toLowerCase()],
			op :Op = Op[sj.operator.toLowerCase()],
			value :string = sj.value,
			not :boolean = sj.not,
			simPercent :number = sj.similarity,
			mt :Mt = sj.measurement && Mt[sj.measurement.toLowerCase()],
			toxT :ToxT = sj.toxtest && ToxT[sj.toxtest.toLowerCase()],
			toxS :ToxS = sj.toxspecies && ToxS[sj.toxspecies.toLowerCase()],
			toxR :ToxR = sj.toxroute && ToxR[sj.toxroute.toLowerCase()],
			toxE :ToxE = sj.toxeffect && ToxE[sj.toxeffect.toLowerCase()];
		return new ExpressionMut(fld, not, op, simPercent, value, mt, toxT, toxS, toxR, toxE);
	}
	static physicalProps(sja :PhysicalPropServerJSON[]) :PhysicalProp[] {
		if(sja && sja.length){
			Logger.trace('ServerJSON.physicalProps sja.length=', sja.length);
			const ret :PhysicalProp[] = [];
			sja.forEach( (psj :PhysicalPropServerJSON, index :number) => ret[index] = new PhysicalProp(psj.p, psj.v, psj.u, psj.s, psj.t) );
			return ret;
		}
	}
	static resource(sj :ResourceServerJSON) :Resource {
		if(sj){
			Logger.trace2('ServerJSON.resource');
			return new Resource(sj.d, sj.u);
		}
	}
	static rnIdName(sj :RNIDNameServerJSON) :RNIDName {
		return new RNIDName(sj.rn, sj.id, sj.n);
	}
	static sources(sja :SourceServerJSON[]) :Source[] {
		if(sja && sja.length){
			Logger.trace('ServerJSON.sources sja.length=', sja.length);
			const ret :Source[] = [];
			sja.forEach( (sj :SourceServerJSON, index :number) => ret[index] = new Source(sj.id, sj.n, sj.t, sj.d, sj.u) );
			return ret;
		}
	}
	static structure(structureDetails :StructureDetails, image :string) :Structure {
		if(structureDetails || image){
			Logger.trace('ServerJSON.structure');
			return new Structure(structureDetails, image);
		}
	}
	static structureDetails(sj :StructureDetailsServerJSON) :StructureDetails {
		if(sj){
			Logger.trace2('ServerJSON.structureDetails', sj);
			return new StructureDetails(sj.w, sj.ik, sj.i, sj.s, sj.m, sj.m3);
		}
	}
	static substance(sj :SubstanceServerJSON) :Substance {
		if(sj){
			Logger.trace('ServerJSON.substance');
			const summary :Summary = this.summary(sj.summary),
				notes :TypeElements<Detail>[] = this.typeElementsList<Detail, DetailServerJSON>(sj.notes),
				categories :TypeElements<Detail>[] = this.typeElementsList<Detail, DetailServerJSON>(sj.categories),
				numbers :TypeElements<Detail>[] = this.typeElementsList<Detail, DetailServerJSON>(sj.numbers),
				names :TypeElements<Detail>[] = this.typeElementsList<Detail, DetailServerJSON>(sj.names),
				formulas :TypeElements<Detail>[] = this.typeElementsList<Detail, DetailServerJSON>(sj.formulas),
				resources :TypeElements<Resource>[] = this.typeElementsList<Resource, ResourceServerJSON>(sj.resources),
				toxicityList :Toxicity[] = this.toxicityList(sj.toxicityList),
				physicalProps :PhysicalProp[] = this.physicalProps(sj.physicalProps),
				structure :Structure = this.structure(this.structureDetails(sj.structureDetails), sj.image);
			return new Substance(sj.id, sj.lastMod, summary, notes, categories, numbers, names, formulas, resources, toxicityList, physicalProps, structure);
		}
	}
	static substancesResult(sj :SubstancesResultServerJSON) :SubstancesResult {
		if(sj){
			Logger.trace('ServerJSON.substancesResult', sj.total, sj.start, sj.end);
			let idSimilarities :IDSimilarity[],
				substances :Substance[];
			if(sj.results){
				idSimilarities = [];
				substances = [];
				sj.results.forEach( (ssj :SubstanceServerJSON, index :number) => {
					idSimilarities[index] = new IDSimilarity(ssj.id, ssj.similarity);
					substances[index] = this.substance(ssj);
				});
			}
			return new SubstancesResult(sj.total, idSimilarities, sj.start, sj.end, substances);
		}
	}
	static summary(sj :SummaryServerJSON) :Summary {
		if(sj){
			Logger.trace('ServerJSON.summary', sj);
			return new Summary(sj.u, sj.na, sj.rn, sj.ik, sj.f, sj.w, sj['3d'], sj.mh, sj.ci);
		}
	}
	static totals(sj :TotalsServerJSON) :Totals {
		return new Totals(sj.substances, sj.values);
	}
	static toxDose(sj :ToxDoseServerJSON) :ToxDose {
		if(sj){
			Logger.trace2('ServerJSON.toxDose');
			return new ToxDose(sj.r, sj.u, sj.m, sj.n, sj.nu);
		}
	}
	static toxEffect(sj :ToxEffectServerJSON) :ToxEffect {
		if(sj){
			return new ToxEffect(sj.s, sj.t);
		}
	}
	static toxicity(sj :ToxicityServerJSON) :Toxicity {
		Logger.trace2('ServerJSON.toxicity Dose:', !!sj.d, 'Journal:', !!sj.j, 'Effects:', !!sj.e);
		const dose :ToxDose = this.toxDose(sj.d),
			journal :ToxJournal = this.toxJournal(sj.j);
		let effectList :ToxEffect[];
		if(sj.e){
			effectList = [];
			sj.e.forEach( (tesj :ToxEffectServerJSON, index :number) => effectList[index] = this.toxEffect(tesj) );
		}
		return new Toxicity(sj.o, sj.t, sj.r, dose, journal, effectList);
	}
	static toxicityList(sja :ToxicityServerJSON[]) :Toxicity[] {
		if(sja && sja.length){
			Logger.trace('ServerJSON.toxicityList sja.length=', sja.length);
			const ret :Toxicity[] = [];
			sja.forEach( (tsj :ToxicityServerJSON, index :number) => ret[index] = this.toxicity(tsj) );
			return ret;
		}
	}
	static toxJournal(sj :ToxJournalServerJSON) :ToxJournal {
		if(sj){
			return new ToxJournal(sj.t, sj.v, sj.p, sj.y, sj.i);
		}
	}
	static types(sja :TypeServerJSON[]) :Type[] {
		if(sja && sja.length){
			Logger.trace('ServerJSON.types sja.length=', sja.length);
			const ret :Type[] = [];
			sja.forEach( (sj :TypeServerJSON, index :number) => ret[index] = new Type(sj.id, sj.name, sj.table) );
			return ret;
		}
	}
	static typeElements<T extends Element, TSJ extends ElementServerJSON>(sj :TypeElementsServerJSON<TSJ>) :TypeElements<T> {
		if(sj){
			Logger.trace('ServerJSON.typeElements Type.get(sj.t)=', Type.get(sj.t), sj.e.length);
			const elements :T[] = [];
			if(Type.get(sj.t).table === 'lo'){
				sj.e.forEach( (esj :TSJ, index :number) => elements[index] = <T>this.resource(esj) );
			}else{
				sj.e.forEach( (esj :TSJ, index :number) => elements[index] = <T>this.detail(esj) );
			}
			return new TypeElements(sj.t, elements);
		}
	}
	static typeElementsList<T extends Element, TSJ extends ElementServerJSON>(sja :TypeElementsServerJSON<TSJ>[]) :TypeElements<T>[] {
		if(sja && sja.length){
			Logger.trace('ServerJSON.typeElementsList sja.length=', sja.length);
			const ret :TypeElements<T>[] = [];
			sja.forEach( (tesj :TypeElementsServerJSON<TSJ>, index :number) => ret[index] = this.typeElements<T, TSJ>(tesj) );
			return ret;
		}
	}
	static valueCountsResult(sj :ValueCountsResultServerJSON) :ValueCountsResult {
		const totals :Totals = this.totals(sj.totals);
		let expression :ExpressionMut,
			results :DataCount[],
			alternatives :RNIDName[];

		if(sj.expression){
			expression = this.expressionMut(sj.expression);
		}
		if(sj.results){
			results = [];
			sj.results.forEach( (dcsj :DataCountServerJSON, index :number) => results[index] = this.dataCount(dcsj) );
		}
		if(sj.alternatives){
			alternatives = [];
			sj.alternatives.forEach( (rinsj :RNIDNameServerJSON, index :number) => alternatives[index] = this.rnIdName(rinsj) );
		}
		return new ValueCountsResult(totals, expression, results, alternatives);
	}
/*
	private static isSubstanceServerJSON(sj :DetailsResultServerJSON) :sj is SubstanceServerJSON {
		return(<SubstanceServerJSON>sj).names !== undefined;
	}
*/
}


