import { NgModule } from '@angular/core';

import { HistoryComponent } from './history.component';

import { SharedModule } from './../shared/shared.module';
import { HistoryRoutingModule } from './history-routing.module';

@NgModule({
	declarations: [
		HistoryComponent
	],
	imports: [
		SharedModule,
		HistoryRoutingModule
	]
})
export class HistoryModule { }
