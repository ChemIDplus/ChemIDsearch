import { Injectable } from '@angular/core';
/**
 * Async modal dialog service
 * DialogService makes this app easier to test by faking this service.
 * TODO: better modal implementation that doesn't use window.confirm
 */
@Injectable()
export class DialogService {
	/* tslint:disable:promise-function-async prefer-function-over-method */
	/**
	 * Ask user to confirm an action. `message` explains the action and choices.
	 * Returns promise resolving to `true`=confirm or `false`=cancel
	 */
	confirm(message ? :string) :Promise<boolean> {
	/* tslint:disable-next-line:no-any typedef */
	return new Promise<boolean>( (resolve :any) => {
			return resolve(window.confirm(message || 'Is it OK?'));
		});
	}
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
