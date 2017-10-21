import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingUrlsComponent } from './generating-urls.component';

describe('GeneratingUrlsComponent', () => {
	let component :GeneratingUrlsComponent;
	let fixture :ComponentFixture<GeneratingUrlsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ GeneratingUrlsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GeneratingUrlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
