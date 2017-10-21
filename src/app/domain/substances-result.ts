import { IDSimilarity, IDSimilarityMinJSON } from './id-similarity';
import { Search } from './search';
import { Substance } from './substance';

export interface SubstancesResultMinJSON {
	/** total */
	t :number;
	/** idSimilarities */
	i ? :IDSimilarityMinJSON[];
	/** start */
	s ? :number;
	/** end */
	e ? :number;

	// substances serialized separately
}

/** Immutable */
export class SearchSubstancesResult {
	constructor(readonly search :Search, readonly substancesResult :SubstancesResult){}
}


/** Immutable */
export class SubstancesResult {

	constructor(
		readonly total :number,
		readonly idSimilarities :ReadonlyArray<IDSimilarity>,
		readonly start :number,
		readonly end :number,
		readonly substances ? :ReadonlyArray<Substance>
	){}

	serialize() :SubstancesResultMinJSON {
		const mj :SubstancesResultMinJSON = {'t':this.total};
		if(this.idSimilarities){
			mj.i = IDSimilarity.serializeArray(this.idSimilarities);
		}
		if(this.start){
			mj.s = this.start;
		}
		if(this.end){
			mj.e = this.end;
		}
		// substances serialized separately
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :SubstancesResultMinJSON) :SubstancesResult {
		if(mj){
			const total :number = mj.t,
				idSimilarities :IDSimilarity[] = IDSimilarity.deserializeArray(mj.i),
				batchStart :number = mj.s,
				batchEnd :number = mj.e;
			return new SubstancesResult(total, idSimilarities, batchStart, batchEnd /* substances serialized separately */);
		}
	}
}
