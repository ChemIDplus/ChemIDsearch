// https://stackoverflow.com/questions/42268268/angular2-typescript-print-pretty-xml#answer-44297150

import { Pipe, PipeTransform } from '@angular/core';

import * as vkbeautify from 'vkbeautify';

@Pipe({
	name: 'xml'
})
export class XmlPipe implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(value :string) :string {
		return vkbeautify.xml(value);
	}
}
