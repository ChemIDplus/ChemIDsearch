import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsOperatorsComponent } from './fields-operators.component';

describe('FieldsOperatorsComponent', () => {
	let component :FieldsOperatorsComponent;
	let fixture :ComponentFixture<FieldsOperatorsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ FieldsOperatorsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FieldsOperatorsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
