import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeOperatorsComponent } from './like-operators.component';

describe('LikeOperatorsComponent', () => {
	let component :LikeOperatorsComponent;
	let fixture :ComponentFixture<LikeOperatorsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ LikeOperatorsComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LikeOperatorsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
