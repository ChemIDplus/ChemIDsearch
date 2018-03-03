/* tslint:disable:ordered-imports */
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { SearchModule } from './../search/search.module';

import { ResultsRoutingModule } from './results-routing.module';

import { ResultsComponent } from './results.component';
import { HtmlComponent } from './html/html.component';
import { SummariesComponent } from './html/summaries/summaries.component';
import { SummaryComponent } from './html/summaries/summary/summary.component';
import { SummariesSortComponent } from './html/summaries/summaries-sort/summaries-sort.component';
import { SummariesNoStructuresComponent } from './html/summaries-no-structures/summaries-no-structures.component';
import { SubstanceComponent } from './html/substance/substance.component';
import { TypeElementsComponent } from './html/substance/type-elements/type-elements.component';
import { ToxicityListComponent } from './html/substance/toxicity-list/toxicity-list.component';
import { PhysicalPropsComponent } from './html/substance/physical-props/physical-props.component';
import { StructureComponent } from './html/structure/structure.component';
import { StructureDetailsComponent } from './html/structure-details/structure-details.component';
import { StructureImageComponent } from './html/structure-image/structure-image.component';
import { StructureSearchComponent } from './html/structure-search/structure-search.component';
import { JsonComponent } from './json/json.component';
import { JsonDataComponent } from './json/json-data/json-data.component';
import { DataModeComponent } from './data-mode/data-mode.component';

@NgModule({
	declarations: [
		ResultsComponent,
		HtmlComponent,
		SummariesComponent,
		SummaryComponent,
		SummariesSortComponent,
		SummariesNoStructuresComponent,
		SubstanceComponent,
		TypeElementsComponent,
		ToxicityListComponent,
		PhysicalPropsComponent,
		StructureComponent,
		StructureDetailsComponent,
		StructureSearchComponent,
		StructureImageComponent,
		JsonComponent,
		JsonDataComponent,
		DataModeComponent
	],
	imports: [
		SharedModule,
		SearchModule,
		ResultsRoutingModule
	]
})
export class ResultsModule { }
