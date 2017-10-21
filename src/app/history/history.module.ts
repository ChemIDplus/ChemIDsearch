import { NgModule } from '@angular/core';

import { HistoryComponent } from './history.component';
import { TrSearchEventComponent } from './tr-search-event/tr-search-event.component';

import { SharedModule } from './../shared/shared.module';
import { HistoryRoutingModule } from './history-routing.module';

@NgModule({
	declarations: [
		HistoryComponent,
		TrSearchEventComponent
	],
	imports: [
		SharedModule,
		HistoryRoutingModule
	]
})
export class HistoryModule { }
