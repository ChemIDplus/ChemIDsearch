interface TypeMinJSON {
	/** id */
	i :number;
	/** name */
	n :string;
	/** table */
	t :string;
}

/** Immutable */
export class Type {

// Static
	static readonly LABELS :{} = {
		's':'Summaries',
		'na':'Names / Synonyms',
		'nu':'Registry Numbers / IDs',
		'ca':'Categories',
		'fo':'Formulas',
		'no':'Notes',
		'lo':'Resources / Locators',
		'cp':'Physical Properties'
	};
	private static readonly TYPES :Type[] = [];
	public static get(id :number) :Type {
		return Type.TYPES.find( (type :Type) => type.id === id);
	}
	public static get initialized() :boolean {
		return Type.TYPES.length > 0;
	}


// Instance
	readonly sharedLabel :string;

	constructor(
		readonly id :number,
		readonly name :string,
		readonly table :string
	){
		this.sharedLabel = Type.LABELS[table];
		Type.TYPES.push(this);
	}

	serialize() :TypeMinJSON {
		return {'i':this.id, 'n':this.name, 't':this.table};
	}
/* tslint:disable:member-ordering */
	static deserialize(mj :TypeMinJSON) :Type {
		if(mj){
			return new Type(mj.i, mj.n, mj.t);
		}
	}
	static serializeArray(types :Type[]) :TypeMinJSON[] {
		return types.map( (type :Type) => type.serialize());
	}
	static deserializeArray(mja :TypeMinJSON[]) :Type[] {
		if(mja){
			return mja.map( (mj :TypeMinJSON) => Type.deserialize(mj) );
		}
	}
}


/*
interface Labels{
	single :string;
	plural :string;
}
	private static labels(table :string) :Labels {
		switch(table){
			case 's': return {single:'Summary', plural:'Summaries'};
			case 'na': return {single:'Name/Synonym', plural:'Names/Synonyms'};
			case 'nu': return {single:'ID/Code/Number', plural:'IDs/Codes/Numbers'};
			case 'ca': return {single:'Category', plural:'Categories'};
			case 'fo': return {single:'Formula', plural:'Formulas'};
			case 'no': return {single:'Note', plural:'Notes'};
			case 'lo': return {single:'Locator', plural:'Locators'};
			case 'cp': return {single:'Chem Prop', plural:'Chem Props'};
			default: throw table + ' is not a table';
		}
	}
*/
