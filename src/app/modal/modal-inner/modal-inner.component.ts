import { Component } from '@angular/core';

import { ModalData } from '../modal-data';
import { ModalStateService } from '../modal-state.service';

import { Logger } from './../../core/logger';

@Component({
	selector: 'app-modal-inner',
	templateUrl: './modal-inner.component.html',
	styleUrls: ['./modal-inner.component.css']
})
export class ModalInnerComponent {
	data :ModalData;

	constructor(readonly state :ModalStateService) {
		Logger.debug('ModalInner.constructor');
		this.data = state.data;
	}

	yes() :void {
		this.state.modal.close('confirmed');
	}

	no() :void {
		this.state.modal.dismiss('not confirmed');
	}
}
