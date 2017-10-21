/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SummariesNoStructuresComponent } from './summaries-no-structures.component';

describe('SummariesNoStructuresComponent', () => {
	let component :SummariesNoStructuresComponent;
	let fixture :ComponentFixture<SummariesNoStructuresComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SummariesNoStructuresComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SummariesNoStructuresComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
