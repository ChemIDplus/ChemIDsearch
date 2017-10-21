import { Injectable, TemplateRef } from '@angular/core';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


import { ModalData } from './modal-data';
/**
 * An internal service allowing to access, from the modal component, the options and the modal reference.
 * It also allows registering the TemplateRef containing the modal component.
 *
 * It must be declared in the providers of the NgModule, but is not supposed to be used in application code
 */

@Injectable()
export class ModalStateService {
	/**
	 * The last options passed ConfirmService.confirm()
	 */
	data :ModalData;

	/**
	 * The last opened confirmation modal
	 */
	modal :NgbModalRef;

	/**
	 * The template containing the confirmation modal component
	 */
	/* tslint:disable-next-line:no-any */
	template :TemplateRef<any>;
}
