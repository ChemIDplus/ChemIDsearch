export interface SummaryMinJSON {
	/** canonical URL */
	u :string;
	/** name */
	n :string;
	/** rn */
	r ? :string;
	/** inchikey */
	i ? :string;
	/** formula */
	f ? :string;
	/** weight */
	w ? :number;
	/** has3D */
	h ? :boolean;
	/** mesh */
	m ? :string;
	/** citations */
	c ? :number;
}

/** Immutable */
export class Summary {

	readonly rn_id :string;
	readonly routerLink :string[];

	constructor(
		readonly canonical :string,
		readonly name :string,
		readonly rn ? :string,
		readonly inchikey ? :string,
		readonly formula ? :string,
		readonly weight ? :number,
		readonly has3D ? :boolean,
		readonly mesh ? :string,
		readonly citations ? :number
	){
		this.rn_id = this.rn || this.canonical.replace('id/eq/', '');
		this.routerLink = ['/results', ...this.canonical.split('/')];
	}

	serialize() :SummaryMinJSON {
		const mj :SummaryMinJSON = {u:this.canonical, n:this.name};
		if(this.rn){
			mj.r = this.rn;
		}
		if(this.inchikey){
			mj.i = this.inchikey;
		}
		if(this.formula){
			mj.f = this.formula;
		}
		if(this.weight){
			mj.w = this.weight;
		}
		if(this.has3D){
			mj.h = this.has3D;
		}
		if(this.mesh){
			mj.m = this.mesh;
		}
		if(this.citations){
			mj.c = this.citations;
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :SummaryMinJSON) :Summary {
		if(mj){
			return new Summary(mj.u, mj.n, mj.r, mj.i, mj.f, mj.w, mj.h, mj.m, mj.c);
		}
	}

}
