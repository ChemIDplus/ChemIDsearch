import { Component, ChangeDetectionStrategy } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
	selector: 'app-regex-operator',
	templateUrl: './regex-operator.component.html',
	styleUrls: ['./regex-operator.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegexOperatorComponent {
	displayedColumns :string[] = ['description', 'regex', 'url'];
	dataSource :RegexExamplesDataSource = new RegexExamplesDataSource();
}

const regexExamples :string[][] = [
	['Name starts with "asp" and ends with "in"', '^asp.*in$', 'https://chem.nlm.nih.gov/api/data/name/regex/%5Easp.*in%24?data=totals', '%5Easp.*in%24'],
	['Name starts with "N" but not "NSC"', '^n([^s]|s[^c])', 'https://chem.nlm.nih.gov/api/data/name/regex/%5En(%5B%5Es%5D%7Cs%5B%5Ec%5D)?data=totals', '%5En(%5B%5Es%5D%7Cs%5B%5Ec%5D)'],
	['Name has "+/-" or "+-" anywhere in the term', '\\+/?-', 'https://chem.nlm.nih.gov/api/data/name/regex/%255C%2B%252F%3F-?data=totals', '%255C%2B%252F%3F-'],
	['Name ends with "USAN" and/or "INN" (and perhaps other terms) within square brackets', '\\[[^]]*(usan|inn)[^]]*]$', 'https://chem.nlm.nih.gov/api/data/name/regex/%255C%5B%5B%5E%5D%5D*(usan%7Cinn)%5B%5E%5D%5D*%5D%24?data=totals', '%255C%5B%5B%5E%5D%5D*(usan%7Cinn)%5B%5E%5D%5D*%5D%24']
];
/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class RegexExamplesDataSource extends DataSource<string[]> {
	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect() :Observable<string[][]> {
		return Observable.of(regexExamples);
	}

	disconnect() :void {
		// empty
	}
}
