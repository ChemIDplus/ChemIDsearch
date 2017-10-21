/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StructureImageComponent } from './structure-image.component';

describe('StructureImageComponent', () => {
	let component :StructureImageComponent;
	let fixture :ComponentFixture<StructureImageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StructureImageComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StructureImageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
