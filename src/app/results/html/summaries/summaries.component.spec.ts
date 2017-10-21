/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SummariesComponent } from './summaries.component';

describe('SummariesHtmlComponent', () => {
	let component :SummariesComponent;
	let fixture :ComponentFixture<SummariesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SummariesComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SummariesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
