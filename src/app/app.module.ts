import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ModalModule } from './modal/modal.module';
import { SearchModule } from './search/search.module';
import { ResultsModule } from './results/results.module';
import { HistoryModule } from './history/history.module';
import { SettingsModule } from './settings/settings.module';
import { HelpModule } from './help/help.module';
import { ApiModule } from './api/api.module';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		NgbModule.forRoot(),
		AppRoutingModule,
		SharedModule,
		CoreModule,
		ModalModule,
		SearchModule,
		ResultsModule,
		HistoryModule,
		SettingsModule,
		HelpModule,
		ApiModule
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
