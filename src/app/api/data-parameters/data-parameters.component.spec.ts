import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataParametersComponent } from './data-parameters.component';

describe('DataParametersComponent', () => {
	let component :DataParametersComponent;
	let fixture :ComponentFixture<DataParametersComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ DataParametersComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DataParametersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
