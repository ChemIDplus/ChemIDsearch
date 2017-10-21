/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CriteriaComponent } from './criteria.component';

describe('CriteriaComponent', () => {
	let component :CriteriaComponent;
	let fixture :ComponentFixture<CriteriaComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CriteriaComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CriteriaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
