import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// ToDo - Replace deprecated HttpModule with HttpClientModule, see http://brianflove.com/2017/07/21/migrating-to-http-client/

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
