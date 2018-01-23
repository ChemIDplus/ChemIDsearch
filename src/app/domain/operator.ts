import { EnumEx } from '../util/enum-ex';
import { Fld } from './field';

export enum Op{
	auto,
	equals,
	inlist,
	startswith,
	endswith,
	contains,
	regex,
	between,
	lte,
	gte,
	substructure,
	similarity,
	exact,
	flex,
	flexplus
}

/** Immutable */
export class Operator{

// Static
	static readonly ops :ReadonlyArray<Op> = EnumEx.getValues(Op);

	static readonly autoOps :ReadonlyArray<Op> = [Op.auto, Op.equals, Op.inlist, Op.startswith, Op.endswith, Op.contains];
	static readonly idOps :ReadonlyArray<Op> = [Op.auto, Op.equals, Op.inlist, Op.startswith, Op.endswith, Op.contains, Op.regex];
	static readonly dateOps :ReadonlyArray<Op> = [Op.gte, Op.lte]; // gte first as the default for last_mod
	static readonly rangeOps :ReadonlyArray<Op> = [Op.between, Op.lte, Op.gte, Op.equals, Op.inlist];
	static readonly stOps :ReadonlyArray<Op> = [Op.substructure, Op.similarity, Op.exact, Op.flex, Op.flexplus];
	static readonly eqOp :ReadonlyArray<Op> = [Op.equals];

	private static operators :Operator[];

	// Make sure the help matches: \ChemIDsearch\src\app\api\fields-operators\fields-operators.component.html

	// Static Constructor IIFE: see https://github.com/Microsoft/TypeScript/issues/265
	/* tslint:disable-next-line */
	private static _constructor = (() :void => {
		let a :Operator[];
		a = Operator.operators = [];
		a[Op.auto] = new Operator('auto', '(automatic)', 'auto', true);
		a[Op.equals] = new Operator('eq', 'equals', '=', true);
		a[Op.inlist] = new Operator('in', 'in list', 'in');
		a[Op.startswith] = new Operator('sw', 'starts with', 'starts with', true);
		a[Op.endswith] = new Operator('ew', 'ends with', 'ends with', true);
		a[Op.contains] = new Operator('cs', 'contains', 'contains', true);
		a[Op.regex] = new Operator('re', 'Regular Expression', 'regex', true);
		a[Op.between] = new Operator('bw', 'between', 'between');
		a[Op.lte] = new Operator('lte', '<=', '<=');
		a[Op.gte] = new Operator('gte', '>=', '>=');
		a[Op.substructure] = new Operator('sb', 'Substructure Search', 'sub.');
		a[Op.similarity] = new Operator('si', 'Similarity Search', 'sim.', false, true);
		a[Op.exact] = new Operator('ex', 'Exact (parent only)', '=');
		a[Op.flex] = new Operator('fx', 'Flex (parent, salts, mixture)', 'flex');
		a[Op.flexplus] = new Operator('fp', 'Flexplus (parent, all variations)', 'flexplus');
	})();

	static getOps(fld :Fld) :ReadonlyArray<Op> {
		switch(fld){
			case Fld.auto:
				return Operator.autoOps;
			case Fld.name:
			case Fld.number:
			case Fld.rn:
			case Fld.id:
			case Fld.unii:
			case Fld.formula:
			case Fld.category:
			case Fld.inchikey:
			case Fld.locator:
				return Operator.idOps;
			case Fld.weight:
			case Fld.physicalproperty:
			case Fld.toxicity:
				return Operator.rangeOps;
			case Fld.structure:
				return Operator.stOps;
			case Fld.has2d:
			case Fld.has3d:
				return Operator.eqOp;
			case Fld.lastmod:
				return Operator.dateOps;
			default:
				throw new Error('getOps expected a valid fld and received ' + fld);
		}
	}
	static getAbbr(op :Op) :string {
		return Operator.getOperator(op).abbr;
	}
	/* tslint:disable-next-line:variable-name */
	static getOp(name_or_abbr :string) :Op {
		return Op[name_or_abbr] || Operator.ops.find( (op :Op) => Operator.operators[op].abbr === name_or_abbr);
	}
	static getDisplay(op :Op) :string {
		return Operator.getOperator(op).display;
	}
	static getDisplayAbbr(op :Op) :string {
		return Operator.getOperator(op).displayAbbr;
	}
	static autoReplaceAsterisk(op :Op) :boolean {
		return Operator.getOperator(op).autoReplaceAsterisk;
	}
	static usesPercent(op :Op) :boolean {
		return Operator.getOperator(op).usesPercent;
	}

	static fldHasOp(fld :Fld, op :Op) :boolean {
		return Operator.getOps(fld).indexOf(op) >= 0;
	}

	private static getOperator(op :Op) :Operator {
		return Operator.operators[op];
	}


// Instance
	constructor(
		readonly abbr :string,
		readonly display :string,
		readonly displayAbbr :string,
		readonly autoReplaceAsterisk ? :boolean,
		readonly usesPercent ? :boolean
	){}


}
