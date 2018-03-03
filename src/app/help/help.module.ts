import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { HelpRoutingModule } from './help-routing.module';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutomaticFieldComponent } from './automatic-field/automatic-field.component';
import { AutomaticOperatorComponent } from './automatic-operator/automatic-operator.component';
import { CategoryFieldComponent } from './category-field/category-field.component';
import { EditSearchComponent } from './edit-search/edit-search.component';
import { FormulaFieldComponent } from './formula-field/formula-field.component';
import { HelpComponent } from './help.component';
import { InlistOperatorComponent } from './inlist-operator/inlist-operator.component';
import { LikeOperatorsComponent } from './like-operators/like-operators.component';
import { MultipleExpressionsComponent } from './multiple-expressions/multiple-expressions.component';
import { RegexOperatorComponent } from './regex-operator/regex-operator.component';
import { StructureFieldComponent } from './structure-field/structure-field.component';
import { ToSearchComponent } from './to-search/to-search.component';
import { ToxicityFieldComponent } from './toxicity-field/toxicity-field.component';

@NgModule({
	imports: [
		SharedModule,
		HelpRoutingModule
	],
	declarations: [
		HelpComponent,
		ToSearchComponent,
		AutomaticFieldComponent,
		AutomaticOperatorComponent,
		AutocompleteComponent,
		FormulaFieldComponent,
		CategoryFieldComponent,
		StructureFieldComponent,
		ToxicityFieldComponent,
		LikeOperatorsComponent,
		InlistOperatorComponent,
		RegexOperatorComponent,
		MultipleExpressionsComponent,
		EditSearchComponent
	]
})
export class HelpModule { }
