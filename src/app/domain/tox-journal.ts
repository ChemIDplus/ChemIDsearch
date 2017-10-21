export interface ToxJournalMinJSON {
	/** title */
	t :string;
	/** vol */
	v ? :string;
	/** page */
	p ? :string;
	/** year */
	y ? :string;
	/** pubmedId */
	i ? :string;
}

import { Logger } from './../core/logger';

/** Immutable */
export class ToxJournal {

	/* tslint:disable:variable-name */
	private _display :string;
	private _href :string;

	constructor(
		readonly title :string,
		readonly vol ? :string,
		readonly page ? :string,
		readonly year ? :string,
		readonly pubmedId ? :string
	){}

	get display() :string {
		Logger.trace2('Journal.display');
		if(!this._display){
			let s :string = this.title + '.',
			hasPrior :boolean = false;
			if(this.vol){
				s += ' Vol. ' + this.vol;
				hasPrior = true;
			}
			if(this.page){
				if(hasPrior){
					s += ',';
				}
				s += ' Pg. ' + this.page;
				hasPrior = true;
			}
			if(this.year){
				if(hasPrior){
					s += ',';
				}
				s += ' ' + this.year;
				hasPrior = true;
			}
			if(hasPrior){
				s += '.';
			}
			this._display = s;
		}
		return this._display;
	}

	get href() :string {
		Logger.trace2('Journal.href');
		if(!this._href){
			this._href = 'https://www.ncbi.nlm.nih.gov/pubmed?cmd=Search&term=' + this.pubmedId;
		}
		return this._href;
	}

	serialize() :ToxJournalMinJSON {
		const mj :ToxJournalMinJSON = {'t': this.title};
		if(this.vol){
			mj.v = this.vol;
		}
		if(this.page){
			mj.p = this.page;
		}
		if(this.year){
			mj.y = this.year;
		}
		if(this.pubmedId){
			mj.i = this.pubmedId;
		}
		return mj;
	}
	/*tslint:disable-next-line:member-ordering */
	static deserialize(mj :ToxJournalMinJSON) :ToxJournal {
		if(mj){
			return new ToxJournal(mj.t, mj.v, mj.p, mj.y, mj.i);
		}
	}
}
