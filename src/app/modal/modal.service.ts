import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalData } from './modal-data';
import { ModalStateService } from './modal-state.service';

@Injectable()
export class ModalService {

	constructor(private readonly modalService :NgbModal, private readonly state :ModalStateService) {}

	/**
	 * Opens a modal
	 * @param data the title and body for the modal
	 * @returns a promise that is fulfilled when the user chooses to confirm, and rejected when
	 * the user chooses not to confirm, or closes the modal
	 */
	/* tslint:disable-next-line:no-any promise-function-async */
	open(data :ModalData) :Promise<any> {
		this.state.data = data;
		this.state.modal = this.modalService.open(this.state.template);
		return this.state.modal.result;
	}
}
