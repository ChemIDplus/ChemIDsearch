/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { JsonDataComponent } from './json-data.component';

describe('JsonDataComponent', () => {
	let component :JsonDataComponent;
	let fixture :ComponentFixture<JsonDataComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ JsonDataComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JsonDataComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
