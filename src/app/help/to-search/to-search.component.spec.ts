import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToSearchComponent } from './to-search.component';

describe('ToSearchComponent', () => {
	let component :ToSearchComponent;
	let fixture :ComponentFixture<ToSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ToSearchComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ToSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
