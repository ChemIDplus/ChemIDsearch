import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ExpFormComponent } from './exp/exp-form/exp-form.component';
import { ExpListComponent } from './exp/exp-list/exp-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'search', component: ExpListComponent },
		{ path: 'expression', component: ExpFormComponent }
	])],
	exports: [RouterModule]
})
export class SearchRoutingModule {}
