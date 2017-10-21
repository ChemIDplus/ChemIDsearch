import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchResultsComponent } from './batch-results.component';

describe('BatchResultsComponent', () => {
	let component :BatchResultsComponent;
	let fixture :ComponentFixture<BatchResultsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ BatchResultsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatchResultsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
