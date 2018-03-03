import { EnumEx } from './../util/enum-ex';

export enum ToxS{
	any,
	allbirds,
	alldomesticanimals,
	cat,
	dog,
	frog,
	gerbil,
	guineapig,
	hamster,
	horsedonkey,
	human,
	mammal,
	monkey,
	mouse,
	pig,
	rabbit,
	rat,
	squirrel
}

/** Immutable */
export class ToxicitySpecies{


// Static
	static readonly toxSs :ReadonlyArray<ToxS> = EnumEx.getValues(ToxS);

	private static toxicitySpeciess :ToxicitySpecies[];

	static _constructor() :void {
		let a :ToxicitySpecies[];
		a = ToxicitySpecies.toxicitySpeciess = [];
		a[ToxS.any] = new ToxicitySpecies('Any', 'Any');
		a[ToxS.allbirds] = new ToxicitySpecies('All Birds', 'Birds');
		a[ToxS.alldomesticanimals] = new ToxicitySpecies('All Domestic Animals', 'Domestic');
		a[ToxS.cat] = new ToxicitySpecies('Cat', 'Cat');
		a[ToxS.dog] = new ToxicitySpecies('Dog', 'Dog');
		a[ToxS.frog] = new ToxicitySpecies('Frog', 'Frog');
		a[ToxS.gerbil] = new ToxicitySpecies('Gerbil', 'Gerbil');
		a[ToxS.guineapig] = new ToxicitySpecies('Guinea Pig', 'Guinea Pig');
		a[ToxS.hamster] = new ToxicitySpecies('Hamster', 'Hamster');
		a[ToxS.horsedonkey] = new ToxicitySpecies('Horse/Donkey', 'Horse/Donkey');
		a[ToxS.human] = new ToxicitySpecies('Human', 'Human');
		a[ToxS.mammal] = new ToxicitySpecies('Mammal', 'Mammal');
		a[ToxS.monkey] = new ToxicitySpecies('Monkey', 'Monkey');
		a[ToxS.mouse] = new ToxicitySpecies('Mouse', 'Mouse');
		a[ToxS.pig] = new ToxicitySpecies('Pig', 'Pig');
		a[ToxS.rabbit] = new ToxicitySpecies('Rabbit', 'Rabbit');
		a[ToxS.rat] = new ToxicitySpecies('Rat', 'Rat');
		a[ToxS.squirrel] = new ToxicitySpecies('Squirrel', 'Squirrel');
	}

	static getAbbr(toxS :ToxS) :string {
		return ToxS[toxS]; // currently no abbreviation, but leaving it in the public api in case we add them
	}
	static getToxS(name :string) :ToxS {
		return ToxS[name];
	}
	static getDisplay(toxS :ToxS) :string {
		return ToxicitySpecies.getToxicitySpecies(toxS).display;
	}
	static getDisplayAbbr(toxS :ToxS) :string {
		return ToxicitySpecies.getToxicitySpecies(toxS).displayAbbr;
	}

	private static getToxicitySpecies(toxS :ToxS) :ToxicitySpecies {
		return ToxicitySpecies.toxicitySpeciess[toxS];
	}


// Instance
	constructor(
		readonly display :string,
		readonly displayAbbr :string
	){}
}

ToxicitySpecies._constructor();
