import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticOperatorComponent } from './automatic-operator.component';

describe('AutomaticOperatorComponent', () => {
	let component :AutomaticOperatorComponent;
	let fixture :ComponentFixture<AutomaticOperatorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AutomaticOperatorComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutomaticOperatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
