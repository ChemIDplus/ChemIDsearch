import { EnumEx } from '../util/enum-ex';

export enum ToxE{
	any,
	autonomicnervoussystem,
	behavioral,
	biochemical,
	blood,
	brainandcoverings,
	cardiac,
	endocrine,
	gastrointestinal,
	immunologicalincludingallergic,
	kidneyureterandbladder,
	liver,
	lungsthoraxorrespiration,
	musculoskeletal,
	notreported,
	nutritionalandgrossmetabolic,
	peripheralnerveandsensation,
	relatedtochronicdata,
	reproductive,
	senseorgansandspecialsenses,
	skinandappendages,
	spinalcord,
	tumorigenic,
	vascular
}

/** Immutable */
export class ToxicityEffect{


// Static
	/* tslint:disable-next-line:variable-name */
	static readonly ToxEs :ReadonlyArray<ToxE> = EnumEx.getValues(ToxE);

	private static toxicityEffects :ToxicityEffect[];

	// Static Constructor IIFE: see https://github.com/Microsoft/TypeScript/issues/265
	/* tslint:disable-next-line */
	private static _constructor = (() :void => {
		let a :ToxicityEffect[];
		a = ToxicityEffect.toxicityEffects = [];
		a[ToxE.any] = new ToxicityEffect('Any', 'Any');
		a[ToxE.autonomicnervoussystem] = new ToxicityEffect('Autonomic Nervous System', 'Auto. NS');
		a[ToxE.behavioral] = new ToxicityEffect('Behavioral', 'Behav.');
		a[ToxE.biochemical] = new ToxicityEffect('Biochemical', 'Bioch.');
		a[ToxE.blood] = new ToxicityEffect('Blood', 'Blood');
		a[ToxE.brainandcoverings] = new ToxicityEffect('Brain and Coverings', 'Brain');
		a[ToxE.cardiac] = new ToxicityEffect('Cardiac', 'Cardiac');
		a[ToxE.endocrine] = new ToxicityEffect('Endocrine', 'Endoc.');
		a[ToxE.gastrointestinal] = new ToxicityEffect('Gastrointestinal', 'GI');
		a[ToxE.immunologicalincludingallergic] = new ToxicityEffect('Immunological including Allergic', 'Immun.');
		a[ToxE.kidneyureterandbladder] = new ToxicityEffect('Kidney Ureter and Bladder', 'Kid.Ur.Blad.');
		a[ToxE.liver] = new ToxicityEffect('Liver', 'Liver');
		a[ToxE.lungsthoraxorrespiration] = new ToxicityEffect('Lungs Thorax or Respiration', 'Lung.Th.Resp.');
		a[ToxE.musculoskeletal] = new ToxicityEffect('Musculoskeletal', 'Musculoskeletal');
		a[ToxE.notreported] = new ToxicityEffect('Not Reported', 'Not Reported');
		a[ToxE.nutritionalandgrossmetabolic] = new ToxicityEffect('Nutritional and Gross Metabolic', 'Nutri. Metab.');
		a[ToxE.peripheralnerveandsensation] = new ToxicityEffect('Peripheral Nerve and Sensation', 'Periph. Sensa.');
		a[ToxE.relatedtochronicdata] = new ToxicityEffect('Related to Chronic Data', 'Chronic');
		a[ToxE.reproductive] = new ToxicityEffect('Reproductive', 'Reprod.');
		a[ToxE.senseorgansandspecialsenses] = new ToxicityEffect('Sense Organs and Special Senses', 'Sense Organs');
		a[ToxE.skinandappendages] = new ToxicityEffect('Skin and Appendages', 'Skin Appen.');
		a[ToxE.spinalcord] = new ToxicityEffect('Spinal Cord', 'Spinal');
		a[ToxE.tumorigenic] = new ToxicityEffect('Tumorigenic', 'Tumor.');
		a[ToxE.vascular] = new ToxicityEffect('Vascular', 'Vascular');
	})();

	static getAbbr(toxE :ToxE) :string {
		return ToxE[toxE]; // currently no abbreviation, but leaving it in the public api in case we add them
	}
	/* tslint:disable-next-line:variable-name */
	static getToxE(name :string) :ToxE {
		return ToxE[name];
	}
	static getDisplay(toxE :ToxE) :string {
		return ToxicityEffect.getToxicityEffect(toxE).display;
	}
	static getDisplayAbbr(toxE :ToxE) :string {
		return ToxicityEffect.getToxicityEffect(toxE).displayAbbr;
	}

	private static getToxicityEffect(toxE :ToxE) :ToxicityEffect {
		return ToxicityEffect.toxicityEffects[toxE];
	}




// Instance
	constructor(
		readonly display :string,
		readonly displayAbbr :string
	){}
}
