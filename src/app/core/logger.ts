import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';

enum Level {
	OFF,
	ERROR,
	WARN,
	INFO,
	DEBUG,
	LOG,
	TRACE,
	TRACE2
}

/* tslint:disable:no-any no-console */
@Injectable()
export class Logger {

	/*
		To ignore local-only changes to this tracked file, run:
			git update-index --skip-worktree all/new/api_ui/src/app/core/logger.ts
		To undo that so git will notice it again, run:
			git update-index --no-skip-worktree all/new/api_ui/src/app/core/logger.ts
	*/

	/**
	 * For local debugging, update this value instead of updating environment.loggerLevel
	 * Or append a parameter to a URL such as ?loggerLevel=TRACE which will be saved to localStorage.
	 * Undo with ?loggerLevel=DEFAULT which will remove the custom level from localStorage.
	 */
	private static readonly override :string; // = 'TRACE';

	/* tslint:disable-next-line:member-ordering */
	static level :Level = Level[Logger.override || environment.loggerLevel as string];

	static _constructor() :void {
		Logger.info('Logger level set to ' + Level[Logger.level]);
	}

	static testResetLevel(level :string) :boolean {
		if(level){
			const test :any = Level[level];
			if(test !== undefined){
				this.level = Level[level];
				this.info('Logger level reset to ' + level);
				return true;
			}
		}
	}
	static error(...args :any[]) :void {
		if(this.level >= Level.ERROR){
			console.error.apply(undefined, args);
		}
	}
	static warn(...args :any[]) :void {
		if(this.level >= Level.WARN){
			console.warn.apply(undefined, args);
		}
	}
	static info(...args :any[]) :void {
		if(this.level >= Level.INFO){
			console.info.apply(undefined, args);
		}
	}
	static debug(...args :any[]) :void {
		if(this.level >= Level.DEBUG){
			console.debug.apply(undefined, args);
		}
	}
	static log(...args :any[]) :void {
		if(this.level >= Level.LOG){
			console.log.apply(undefined, args);
		}
	}
	static trace(...args :any[]) :void {
		if(this.level >= Level.TRACE){
			console.log.apply(undefined, args);
		}
	}
	static trace2(...args :any[]) :void {
		if(this.level >= Level.TRACE2){
			console.log.apply(undefined, args);
		}
	}

}

Logger._constructor();
