import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class EnvService {

	get apiURL() :string {
		return environment.apiUrl;
	}
	get loggerLevel() :string {
		return environment.loggerLevel;
	}
}
