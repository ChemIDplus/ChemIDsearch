import { browser, by, element } from 'protractor';

/* tslint:disable:no-any */
export class AppPage {
	navigateTo() :any {
		return browser.get('/');
	}

	getParagraphText() :any {
		return element(by.css('app-root h1')).getText();
	}
}
