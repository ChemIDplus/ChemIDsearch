/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HtmlComponent } from './html.component';

describe('HtmlResultsComponent', () => {
	let component :HtmlComponent;
	let fixture :ComponentFixture<HtmlComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ HtmlComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HtmlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
