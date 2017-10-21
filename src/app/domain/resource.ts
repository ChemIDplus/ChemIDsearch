import { Element, ElementMinJSON } from './element';
import { Source } from './source';
import { Summary } from './summary';

export interface ResourceMinJSON extends ElementMinJSON {
	/** postUrl */
	u ? :string;
}

/** Immutable */
export class Resource extends Element {

	// readonly source :Source; // Causes "'Type 'Resource' cannot be converted to type 'T'.'" in server-json.ts
		// The error apparently occurs when trying to use generics and inheritance with classes where one or more member properties are not in the constructor;
		// get method() "properties" also cause the error.
		// Even non getter methods cause the error. Not sure what is going on!

	constructor(data :string, readonly postUrl ? :string){
		super(data);
	}

	serialize() :ResourceMinJSON {
		const mj :ResourceMinJSON = super.serialize();
		if(this.postUrl){
			mj.u = this.postUrl;
		}
		return mj;
	}
	/* tslint:disable-next-line:member-ordering */
	static deserialize(mj :ResourceMinJSON) :Resource {
		if(mj){
			return new Resource(mj.d, mj.u);
		}
	}
}

export class ResourceWithURL extends Resource {

	readonly url :string;
	readonly sourceName :string;
	readonly sourceIdName :string;
	readonly sourceBrReplacedDescription :string;

	constructor(resource :Resource, summary :Summary){
		super(resource.data, resource.postUrl);

		const source :Source = Source.get(resource.data);
		if(source){
			this.sourceName = source.name;
			this.sourceIdName = source.id + ' = ' + source.name;
			this.sourceBrReplacedDescription = source.description && source.description.replace(/\\r\\n/g, '<br>');
		}

		let url :string = '';
		if(source && source.preUrl){
			url = source.preUrl.replace(/\${RN}/g, summary.rn).replace(/\${MH}/g, summary.mesh);
		}
		if(this.postUrl){
			url += this.postUrl;
		}
		this.url = url;
	}
}
