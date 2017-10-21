// https://gist.github.com/jnizet/15c7a0ab4188c9ce6c79ca9840c71c4e

import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ModalTemplateDirective } from './modal-template.directive';
import { ModalStateService } from './modal-state.service'; // Internal Only
import { ModalService } from './modal.service';
import { ModalInnerComponent } from './modal-inner/modal-inner.component';
import { ModalOuterComponent } from './modal-outer/modal-outer.component';

@NgModule({
	declarations: [ModalTemplateDirective, ModalInnerComponent, ModalOuterComponent],
	imports: [
		SharedModule
	],
	exports: [ModalOuterComponent],
	providers: [ModalStateService, ModalService]
})
export class ModalModule { }
