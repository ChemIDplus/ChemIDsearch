import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrSearchEventComponent } from './tr-search-event.component';

describe('TrSearchEventComponent', () => {
	let component :TrSearchEventComponent;
	let fixture :ComponentFixture<TrSearchEventComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TrSearchEventComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TrSearchEventComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
