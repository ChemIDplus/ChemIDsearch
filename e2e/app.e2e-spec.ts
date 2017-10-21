import { AppPage } from './app.po';

/* tslint:disable-next-line:typedef */
describe('ChemIDsearch App', function() {
	let page :AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should display welcome message', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('Welcome to app!');
	});
});
