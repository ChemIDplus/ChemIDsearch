import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegexOperatorComponent } from './regex-operator.component';

describe('RegexOperatorComponent', () => {
	let component :RegexOperatorComponent;
	let fixture :ComponentFixture<RegexOperatorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ RegexOperatorComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RegexOperatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
