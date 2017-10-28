import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaFieldComponent } from './formula-field.component';

describe('FormulaFieldComponent', () => {
	let component :FormulaFieldComponent;
	let fixture :ComponentFixture<FormulaFieldComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ FormulaFieldComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FormulaFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
