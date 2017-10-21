import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
	canDeactivate :() => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
	canDeactivate(component :CanComponentDeactivate) :Observable<boolean> | Promise<boolean> | boolean {
		return component.canDeactivate ? component.canDeactivate() : true;
	}
}
