import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureFieldComponent } from './structure-field.component';

describe('StructureFieldComponent', () => {
	let component :StructureFieldComponent;
	let fixture :ComponentFixture<StructureFieldComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StructureFieldComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StructureFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
