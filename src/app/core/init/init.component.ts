import { Component, OnInit } from '@angular/core';

import { AppService } from './../app.service';
import { LocalStorageService } from './../local-storage.service';

import { Logger } from './../logger';

@Component({
	selector: 'app-init',
	templateUrl: './init.component.html',
	styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

	constructor(readonly app :AppService){}

	ngOnInit() :void {
		Logger.debug('Init.onInit');
		LocalStorageService.removeAllIfOldVersion();
		let updated :boolean;
		if(location.search){
			const found :RegExpMatchArray = location.search.match(/loggerLevel=([^&]+)/);
			if(found){
				const loggerLevel :string = found[1].toUpperCase();
				if(loggerLevel === 'DEFAULT'){
					LocalStorageService.removeItem('loggerLevel');
				}else{
					updated = Logger.testResetLevel(loggerLevel);
					if(updated){
						LocalStorageService.setString('loggerLevel', loggerLevel);
					}
				}
			}
		}
		if(!updated){
			Logger.testResetLevel(LocalStorageService.getString('loggerLevel'));
		}
		this.app.initTypes();
		this.app.initSources();
	}
}
