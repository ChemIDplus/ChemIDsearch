/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalOuterComponent } from './modal-outer.component';

describe('ModalOuterComponent', () => {
	let component :ModalOuterComponent;
	let fixture :ComponentFixture<ModalOuterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ModalOuterComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalOuterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
