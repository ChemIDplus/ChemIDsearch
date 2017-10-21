/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ToxicityListComponent } from './toxicity-list.component';

describe('ToxicityListComponent', () => {
	let component :ToxicityListComponent;
	let fixture :ComponentFixture<ToxicityListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ToxicityListComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ToxicityListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
