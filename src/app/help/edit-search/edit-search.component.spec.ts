import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSearchComponent } from './edit-search.component';

describe('EditSearchComponent', () => {
	let component :EditSearchComponent;
	let fixture :ComponentFixture<EditSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ EditSearchComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EditSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
