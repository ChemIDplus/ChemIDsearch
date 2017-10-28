import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleExpressionsComponent } from './multiple-expressions.component';

describe('MultipleExpressionsComponent', () => {
	let component :MultipleExpressionsComponent;
	let fixture :ComponentFixture<MultipleExpressionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ MultipleExpressionsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MultipleExpressionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
