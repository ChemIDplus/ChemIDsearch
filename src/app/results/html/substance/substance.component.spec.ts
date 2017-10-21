/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubstanceComponent } from './substance.component';

describe('SubstanceHtmlComponent', () => {
	let component :SubstanceComponent;
	let fixture :ComponentFixture<SubstanceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SubstanceComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubstanceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
