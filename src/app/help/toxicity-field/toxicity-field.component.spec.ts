import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToxicityFieldComponent } from './toxicity-field.component';

describe('ToxicityFieldComponent', () => {
	let component :ToxicityFieldComponent;
	let fixture :ComponentFixture<ToxicityFieldComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ToxicityFieldComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ToxicityFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
