import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
	],
	imports: [
		CommonModule,
		HttpModule
	],
	exports: [
		CommonModule,
		HttpModule,
		FormsModule,
		ReactiveFormsModule,

		FlexLayoutModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatExpansionModule,

		NgbModule
	]
})
export class SharedModule { }
