import { EnumEx } from '../util/enum-ex';

export enum ToxR{
	any,
	implant,
	inhalation,
	intraarterial,
	intraaural,
	intracervical,
	intracrebral,
	intradermal,
	intraduodenal,
	intramuscular,
	intraperitoneal,
	intrapleural,
	intrarenal,
	intraspinal,
	intratracheal,
	intrauterine,
	intravaginal,
	intravenous,
	multipleroutes,
	ocular,
	oral,
	parenteral,
	rectal,
	skin,
	subcutaneous,
	unreported
}

/** Immutable */
export class ToxicityRoute{


// Static
	/* tslint:disable-next-line:variable-name */
	static readonly ToxRs :ReadonlyArray<ToxR> = EnumEx.getValues(ToxR);

	private static toxicityRoutes :ToxicityRoute[];

	// Static Constructor IIFE: see https://github.com/Microsoft/TypeScript/issues/265
	/* tslint:disable-next-line */
	private static _constructor = (() :void => {
		let a :ToxicityRoute[];
		a = ToxicityRoute.toxicityRoutes = [];
		a[ToxR.any] = new ToxicityRoute('Any', 'Any');
		a[ToxR.implant] = new ToxicityRoute('Implant', 'Implant');
		a[ToxR.inhalation] = new ToxicityRoute('Inhalation', 'Inhalation');
		a[ToxR.intraarterial] = new ToxicityRoute('Intraarterial', 'Intraarterial');
		a[ToxR.intraaural] = new ToxicityRoute('Intraaural', 'Intraaural');
		a[ToxR.intracervical] = new ToxicityRoute('Intracervical', 'Intracervical');
		a[ToxR.intracrebral] = new ToxicityRoute('Intracrebral', 'Intracrebral');
		a[ToxR.intradermal] = new ToxicityRoute('Intradermal', 'Intradermal');
		a[ToxR.intraduodenal] = new ToxicityRoute('Intraduodenal', 'Intraduodenal');
		a[ToxR.intramuscular] = new ToxicityRoute('Intramuscular', 'Intramuscular');
		a[ToxR.intraperitoneal] = new ToxicityRoute('Intraperitoneal', 'Intraperitoneal');
		a[ToxR.intrapleural] = new ToxicityRoute('Intrapleural', 'Intrapleural');
		a[ToxR.intrarenal] = new ToxicityRoute('Intrarenal', 'Intrarenal');
		a[ToxR.intraspinal] = new ToxicityRoute('Intraspinal', 'Intraspinal');
		a[ToxR.intratracheal] = new ToxicityRoute('Intratracheal', 'Intratracheal');
		a[ToxR.intrauterine] = new ToxicityRoute('Intrauterine', 'Intrauterine');
		a[ToxR.intravaginal] = new ToxicityRoute('Intravaginal', 'Intravaginal');
		a[ToxR.intravenous] = new ToxicityRoute('Intravenous', 'Intravenous');
		a[ToxR.multipleroutes] = new ToxicityRoute('Multipleroutes', 'Multiple');
		a[ToxR.ocular] = new ToxicityRoute('Ocular', 'Ocular');
		a[ToxR.oral] = new ToxicityRoute('Oral', 'Oral');
		a[ToxR.parenteral] = new ToxicityRoute('Parenteral', 'Parenteral');
		a[ToxR.rectal] = new ToxicityRoute('Rectal', 'Rectal');
		a[ToxR.skin] = new ToxicityRoute('Skin', 'Skin');
		a[ToxR.subcutaneous] = new ToxicityRoute('Subcutaneous', 'Subcutaneous');
		a[ToxR.unreported] = new ToxicityRoute('Unreported', 'Unreported');
	})();

	static getAbbr(toxR :ToxR) :string {
		return ToxR[toxR]; // currently no abbreviation, but leaving it in the public api in case we add them
	}
	/* tslint:disable-next-line:variable-name */
	static getToxR(name :string) :ToxR {
		return ToxR[name];
	}
	static getDisplay(toxR :ToxR) :string {
		return ToxicityRoute.getToxicityRoute(toxR).display;
	}
	static getDisplayAbbr(toxR :ToxR) :string {
		return ToxicityRoute.getToxicityRoute(toxR).displayAbbr;
	}

	private static getToxicityRoute(toxR :ToxR) :ToxicityRoute {
		return ToxicityRoute.toxicityRoutes[toxR];
	}




// Instance
	constructor(
		readonly display :string,
		readonly displayAbbr :string
	){}
}
