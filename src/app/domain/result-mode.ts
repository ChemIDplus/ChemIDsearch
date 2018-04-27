import { EnumEx } from './../util/enum-ex';

export enum RM{
	html,
	api
}

export class ResultMode{

	// Static
	private static readonly rms :RM[] = EnumEx.getValues(RM);

	private static resultModes :ResultMode[];

	static _constructor() :void {
		let a :ResultMode[];
		a = ResultMode.resultModes = [];
		a[RM.html] = new ResultMode('HTML');
		a[RM.api] = new ResultMode('API');
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
		readonly display :string
	){}
}

ResultMode._constructor();
