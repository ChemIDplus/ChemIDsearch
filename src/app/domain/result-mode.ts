import { EnumEx } from './../util/enum-ex';

export enum RM{
	html,
	json
	// tslint:disable-next-line:comment-format
	//xml
}

export class ResultMode{

	// Static
	private static readonly rms :RM[] = EnumEx.getValues(RM);

	private static resultModes :ResultMode[];

	static _constructor() :void {
		let a :ResultMode[];
		a = ResultMode.resultModes = [];
		a[RM.html] = new ResultMode('HTML', 'HTML');
		a[RM.json] = new ResultMode('JSON', 'JSON');
		// tslint:disable-next-line:comment-format
		//a[RM.xml] = new ResultMode('XML', 'XML');
	}

	static getRMs() :RM[] {
		return ResultMode.rms;
	}
	static getDisplay(rm :RM) :string {
		return ResultMode.getResultMode(rm).display;
	}
	private static getResultMode(rm :RM) :ResultMode {
		return ResultMode.resultModes[rm];
	}


// Instance
	constructor(
		readonly display :string,
		readonly displayAbbr :string
	){}
}

ResultMode._constructor();
