/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExpFormComponent } from './exp-form.component';

describe('ExpFormComponent', () => {
	let component :ExpFormComponent;
	let fixture :ComponentFixture<ExpFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ExpFormComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExpFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
