import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummariesSortComponent } from './summaries-sort.component';

describe('SummariesSortComponent', () => {
	let component :SummariesSortComponent;
	let fixture :ComponentFixture<SummariesSortComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SummariesSortComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SummariesSortComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
