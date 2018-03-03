/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TypeElementsComponent } from './type-elements.component';

describe('TypeElementsComponent', () => {
	let component :TypeElementsComponent;
	let fixture :ComponentFixture<TypeElementsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TypeElementsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TypeElementsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
