import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { SearchRoutingModule } from './search-routing.module';

import { CriteriaComponent } from './criteria/criteria.component';
import { AutoCompleteComponent } from './exp/exp-form/auto-complete/auto-complete.component';
import { ExpFormComponent } from './exp/exp-form/exp-form.component';
import { ExpListComponent } from './exp/exp-list/exp-list.component';

import { AutoCompleteService } from './exp/exp-form/auto-complete/auto-complete.service';

@NgModule({
	imports: [
		SharedModule,
		SearchRoutingModule
	],
	declarations: [
		ExpFormComponent,
		ExpListComponent,
		AutoCompleteComponent,
		CriteriaComponent
	],
	exports: [
		CriteriaComponent
	],
	providers: [AutoCompleteService]
})
export class SearchModule { }
