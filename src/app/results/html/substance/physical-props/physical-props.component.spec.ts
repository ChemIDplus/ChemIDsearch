import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalPropsComponent } from './physical-props.component';

describe('PhysicalPropsComponent', () => {
	let component :PhysicalPropsComponent;
	let fixture :ComponentFixture<PhysicalPropsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ PhysicalPropsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PhysicalPropsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
