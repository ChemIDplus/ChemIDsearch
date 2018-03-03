import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';

import { InitComponent } from './init/init.component';
import { TopMenuComponent } from './top-menu/top-menu.component';

import { AppService } from './app.service';
import { EnvService } from './env.service';
import { SearchService } from './search.service';

import { CanDeactivateGuard } from './can-deactivate-guard.service';

@NgModule({
	declarations: [
		InitComponent,
		TopMenuComponent
	],
	imports: [
		SharedModule,
		RouterModule
	],
	exports: [
		InitComponent,
		TopMenuComponent
	],
	providers: [EnvService, SearchService, AppService, CanDeactivateGuard]

})
export class CoreModule { }
