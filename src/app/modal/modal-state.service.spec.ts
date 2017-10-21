/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModalStateService } from './modal-state.service';

describe('ModalStateService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ModalStateService]
		});
	});

	it('should ...', inject([ModalStateService], (service :ModalStateService) => {
		expect(service).toBeTruthy();
	}));
});
