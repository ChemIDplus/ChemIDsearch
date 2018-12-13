import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { XmlPipe } from './xml.pipe';

@NgModule({
	declarations: [
		XmlPipe
	],
	imports: [
		CommonModule,
		HttpClientModule
	],
	exports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,

		FlexLayoutModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatExpansionModule,

		NgbModule,

		XmlPipe
	]
})
export class SharedModule { }
