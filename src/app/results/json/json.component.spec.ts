/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { JsonComponent } from './json.component';

describe('JsonResultsComponent', () => {
	let component :JsonComponent;
	let fixture :ComponentFixture<JsonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JsonComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JsonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
