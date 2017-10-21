import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ApiRoutingModule } from './api-routing.module';

import { ApiComponent } from './api.component';
import { GeneratingUrlsComponent } from './generating-urls/generating-urls.component';
import { DataParametersComponent } from './data-parameters/data-parameters.component';
import { SortingComponent } from './sorting/sorting.component';
import { JsonResultsComponent } from './json-results/json-results.component';
import { BatchResultsComponent } from './batch-results/batch-results.component';
import { FieldsOperatorsComponent } from './fields-operators/fields-operators.component';
import { ExamplesComponent } from './examples/examples.component';
import { ReferenceDataComponent } from './reference-data/reference-data.component';
import { ValueCountsComponent } from './value-counts/value-counts.component';
import { SourceCodeComponent } from './source-code/source-code.component';

@NgModule({
	imports: [
		SharedModule,
		ApiRoutingModule
	],
	declarations: [
		ApiComponent,
		GeneratingUrlsComponent,
		ExamplesComponent,
		DataParametersComponent,
		SortingComponent,
		JsonResultsComponent,
		BatchResultsComponent,
		FieldsOperatorsComponent,
		ReferenceDataComponent,
		ValueCountsComponent,
		SourceCodeComponent
	]
})
export class ApiModule { }
