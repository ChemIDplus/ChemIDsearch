import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFieldComponent } from './category-field.component';

describe('CategoryFieldComponent', () => {
	let component :CategoryFieldComponent;
	let fixture :ComponentFixture<CategoryFieldComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ CategoryFieldComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CategoryFieldComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
