/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataModeComponent } from './data-mode.component';

describe('DataModeComponent', () => {
	let component :DataModeComponent;
	let fixture :ComponentFixture<DataModeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ DataModeComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DataModeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
