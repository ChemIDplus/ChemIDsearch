import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueCountsComponent } from './value-counts.component';

describe('ValueCountsComponent', () => {
	let component :ValueCountsComponent;
	let fixture :ComponentFixture<ValueCountsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ValueCountsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ValueCountsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
