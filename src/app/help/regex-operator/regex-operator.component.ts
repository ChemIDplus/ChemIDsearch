import { Component, ChangeDetectionStrategy } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { environment } from './../../../environments/environment';

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

class RegexExample {
	readonly url :string;

	constructor(readonly description :string, readonly regex :string, readonly urlEscapedRegex :string){
		this.url = environment.apiUrl + 'data/name/regex/' + urlEscapedRegex + '?data=totals';
	}
}

const regexExamples :RegexExample[] = [
	new RegexExample('Name starts with "asp" and ends with "in"', '^asp.*in$', '%5Easp.*in%24'),
	new RegexExample('Name starts with "N" but not "NSC"', '^n([^s]|s[^c])', '%5En(%5B%5Es%5D%7Cs%5B%5Ec%5D)'),
	new RegexExample('Name includes "+/-" or "+-" where "+" needs to be escaped', '\\+/?-', '%255C%2B%252F%3F-'),
	new RegexExample('Name ends with "USAN" and/or "INN" (and perhaps other terms) within square brackets', '\\[[^]]*(usan|inn)[^]]*]$', '%255C%5B%5B%5E%5D%5D*(usan%7Cinn)%5B%5E%5D%5D*%5D%24'),
	new RegexExample('Name includes "and" twice anywhere in the term', 'and.*and', 'and.*and'),
	new RegexExample('Name includes "and" twice, using backreference', '(and).*\\1', '(and).*%255C1')
];
/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class RegexExamplesDataSource extends DataSource<RegexExample> {
	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect() :Observable<RegexExample[]> {
		return Observable.of(regexExamples);
	}

	disconnect() :void {
		// empty
	}
}
