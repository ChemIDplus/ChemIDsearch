import { Type } from './type';

interface SourceMinJSON {

	/** id */
	i :string;
	/** name */
	n :string;
	/** elementTypeId */
	t :number;
	/** description */
	d ? :string;
	/** preUrl */
	u ? :string;
}

/** Immutable */
export class Source {

// Static
	private static readonly SOURCES :Source[] = [];

	public static get(id :string) :Source {
		return Source.SOURCES.find( (source :Source) => source.id === id);
	}
	public static get initialized() :boolean {
		return Source.SOURCES.length > 0;
	}


// Instance
	readonly elementType :Type;

	constructor(
		readonly id :string,
		readonly name :string,
		elementTypeId :number,
		readonly description ? :string,
		readonly preUrl ? :string
	){
		this.elementType = Type.get(elementTypeId);
		Source.SOURCES.push(this);
	}

	serialize() :SourceMinJSON {
		const mj :SourceMinJSON = {i:this.id, n:this.name, t:this.elementType.id};
		if(this.description){
			mj.d = this.description;
		}
		if(this.preUrl){
			mj.u = this.preUrl;
		}
		return mj;
	}
	/*tslint:disable:member-ordering */
	static deserialize(mj :SourceMinJSON) :Source {
		if(mj){
			return new Source(mj.i, mj.n, mj.t, mj.d, mj.u);
		}
	}
	static serializeArray(sources :Source[]) :SourceMinJSON[] {
		return sources.map( (source :Source) => source.serialize() );
	}
	static deserializeArray(mja :SourceMinJSON[]) :Source[] {
		if(mja){
			return mja.map( (mj :SourceMinJSON) => Source.deserialize(mj) );
		}
	}

}
