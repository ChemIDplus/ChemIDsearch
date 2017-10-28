import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlistOperatorComponent } from './inlist-operator.component';

describe('InlistOperatorComponent', () => {
	let component :InlistOperatorComponent;
	let fixture :ComponentFixture<InlistOperatorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ InlistOperatorComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InlistOperatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
