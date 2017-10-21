/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			declarations: [
				AppComponent
			]
		}).compileComponents();
	}));

	/* tslint:disable:no-any */
	it('should create the app', async(() => {
		const fixture :any = TestBed.createComponent(AppComponent);
		const app :any = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));

	it(`should have as title 'app'`, async(() => {
		const fixture :any = TestBed.createComponent(AppComponent);
		const app :any = fixture.debugElement.componentInstance;
		expect(app.title).toEqual('app');
	}));

	it('should render title in a h1 tag', async(() => {
		const fixture :any = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled :any = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
	}));
});
