import { EnumEx } from './../util/enum-ex';

export enum ToxT{
	any,
	lc,
	lc50,
	ld,
	ld50,
	tclo,
	tdlo
}

/** Immutable */
export class ToxicityTest{


// Static
	static readonly toxTs :ReadonlyArray<ToxT> = EnumEx.getValues(ToxT);

	private static toxicityTests :ToxicityTest[];

	static _constructor() :void {
		let a :ToxicityTest[];
		a = ToxicityTest.toxicityTests = [];
		a[ToxT.any] = new ToxicityTest('Any', 'Any');
		a[ToxT.lc] = new ToxicityTest('LC', 'LC');
		a[ToxT.lc50] = new ToxicityTest('LC50', 'LC50');
		a[ToxT.ld] = new ToxicityTest('LD', 'LD');
		a[ToxT.ld50] = new ToxicityTest('LD50', 'LD50');
		a[ToxT.tclo] = new ToxicityTest('TCLo', 'TCLo');
		a[ToxT.tdlo] = new ToxicityTest('TDLo', 'TDLo');
	}

	static getAbbr(toxT :ToxT) :string {
		return ToxT[toxT]; // currently no abbreviation, but leaving it in the public api in case we add them
	}
	static getToxT(name :string) :ToxT {
		return ToxT[name];
	}
	static getDisplay(toxT :ToxT) :string {
		return ToxicityTest.getToxicityTest(toxT).display;
	}
	static getDisplayAbbr(toxT :ToxT) :string {
		return ToxicityTest.getToxicityTest(toxT).displayAbbr;
	}

	private static getToxicityTest(toxT :ToxT) :ToxicityTest {
		return ToxicityTest.toxicityTests[toxT];
	}


// Instance
	constructor(
		readonly display :string,
		readonly displayAbbr :string
	){}
}

ToxicityTest._constructor();
