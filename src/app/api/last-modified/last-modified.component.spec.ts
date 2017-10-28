import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastModifiedComponent } from './last-modified.component';

describe('LastModifiedComponent', () => {
	let component :LastModifiedComponent;
	let fixture :ComponentFixture<LastModifiedComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ LastModifiedComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LastModifiedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
