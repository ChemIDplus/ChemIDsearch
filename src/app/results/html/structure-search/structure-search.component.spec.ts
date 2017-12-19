import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureSearchComponent } from './structure-search.component';

describe('StructureSearchComponent', () => {
	let component :StructureSearchComponent;
	let fixture :ComponentFixture<StructureSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ StructureSearchComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StructureSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
