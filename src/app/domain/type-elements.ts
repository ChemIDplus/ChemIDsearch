import { Detail } from './detail';
import { Element, ElementMinJSON } from './element';
import { Resource } from './resource';
import { Type } from './type';

export interface TypeElementsMinJSON<T extends ElementMinJSON> {
	/** typeId */
	t :number;
	/** elements */
	e :ReadonlyArray<T>;
}

/** Immutable */
export class TypeElements<T extends Element> {

	readonly type :Type;

	constructor(typeId :number, readonly elements :ReadonlyArray<T>){
		this.type = Type.get(typeId);
	}

	serialize<TMJ extends ElementMinJSON>() :TypeElementsMinJSON<TMJ> {
		const mja :TMJ[] = [];
		this.elements.forEach((e :T, index :number) => mja[index] = <TMJ>e.serialize());
		return {'t':this.type.id, 'e':mja};
	}
	/*tslint:disable:member-ordering */
	static deserialize<T2 extends Element, TMJ extends ElementMinJSON>(mj :TypeElementsMinJSON<TMJ>) :TypeElements<T2> {
		if(mj){
			const type :Type = Type.get(mj.t),
				elements :T2[] = [];
			if(type.table === 'lo'){
				mj.e.forEach( (rmj :TMJ, index :number) => elements[index] = <T2>Resource.deserialize(rmj) );
			}else{
				mj.e.forEach( (dmj :TMJ, index :number) => elements[index] = <T2>Detail.deserialize(dmj) );
			}
			return new TypeElements(mj.t, elements);
		}
	}
	static serializeTypeElementsArray<T2 extends Element, TMJ extends ElementMinJSON>(typeElementsArray :ReadonlyArray<TypeElements<T2>>) :TypeElementsMinJSON<TMJ>[] {
		if(typeElementsArray){
			const mja :TypeElementsMinJSON<TMJ>[] = [];
			typeElementsArray.forEach( (te :TypeElements<T2>, index :number) => mja[index] = te.serialize<TMJ>() );
			return mja;
		}
	}
	static deserializeTypeElementsArray<T2 extends Element, TMJ extends ElementMinJSON>(mja :TypeElementsMinJSON<TMJ>[]) :TypeElements<T2>[] {
		if(mja){
			const typeElementsArray :TypeElements<T2>[] = [];
			mja.forEach( (temj :TypeElementsMinJSON<TMJ>, index :number) => typeElementsArray[index] = TypeElements.deserialize<T2, TMJ>(temj) );
			return typeElementsArray;
		}
	}
}
