import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticFieldComponent } from './automatic-field.component';

describe('AutomaticFieldComponent', () => {
	let component :AutomaticFieldComponent;
	let fixture :ComponentFixture<AutomaticFieldComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AutomaticFieldComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutomaticFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
