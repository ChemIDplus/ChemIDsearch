import { Directive, TemplateRef } from '@angular/core';

import { ModalStateService } from './modal-state.service';

import { Logger } from './../core/logger';

/**
 * Directive allowing to get a reference to the template containing the modal component,
 * and to store it into the internal state service. Somewhere in the view, there must be
 *
 * ```
 * <ng-template appModal>
 *     <app-modal-inner></app-modal-inner>
 * </ng-template>
 * ```
 *
 * in order to register the template to the internal modal state service
 */
@Directive({
	selector: 'ng-template[appModal]'
})
export class ModalTemplateDirective {

	/* tslint:disable-next-line:no-any */
	constructor(readonly modalTemplate :TemplateRef<any>, readonly modalState :ModalStateService) {
		Logger.debug('ModalTemplate.constructor');
		modalState.template = modalTemplate;
	}

}
