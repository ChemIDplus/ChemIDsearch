/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExpListComponent } from './exp-list.component';

describe('ExpListComponent', () => {
	let component :ExpListComponent;
	let fixture :ComponentFixture<ExpListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ExpListComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExpListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
