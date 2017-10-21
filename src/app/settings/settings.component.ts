import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Preferences } from './../domain/preferences';
import { RM, ResultMode } from './../domain/result-mode';

import { Logger } from './../core/logger';

import { LocalStorageService } from './../core/local-storage.service';
import { AppService } from './../core/app.service';


@Component({
	selector: 'app-setting',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class SettingsComponent implements OnInit {

	form :FormGroup;
	ctrlResultPage :FormControl;
	ctrlAutoCompleteResult :FormControl;
	ctrlResultMode :FormControl;
	ctrlFldOpAbbr :FormControl;
	private subscriptions :Subscription[] = [];

	constructor(
		readonly app :AppService,
		readonly formBuilder :FormBuilder,
		readonly cdr :ChangeDetectorRef
	) { }

	ngOnInit() :void {
		Logger.debug('SettingsForm.onInit');

		this.ctrlResultPage = new FormControl(this.app.maxResultPageRows);
		this.ctrlAutoCompleteResult = new FormControl(this.app.maxAutoCompleteRows);
		this.ctrlResultMode = new FormControl(this.app.rm);
		this.ctrlFldOpAbbr = new FormControl(this.app.useFieldOperatorAbbreviations ? 'abbr' : 'full');

		this.form = this.formBuilder.group(
			{
				'ctrlResultPage':this.ctrlResultPage,
				'ctrlAutoCompleteResult':this.ctrlAutoCompleteResult,
				'ctrlResultMode':this.ctrlResultMode,
				'ctrlFldOpAbbr':this.ctrlFldOpAbbr
			});

		this.subscriptions.push(this.form.valueChanges.subscribe( () => this.onFormChanges() ));
	}

	/** onFormChanges - called on everything! */
	onFormChanges() :void {
		Logger.trace('SettingsForm.onFormChanges');
		this.app.setPreferences(new Preferences(+this.ctrlResultPage.value, +this.ctrlAutoCompleteResult.value, this.ctrlFldOpAbbr.value === 'abbr', +this.ctrlResultMode.value));
		this.cdr.detectChanges();
	}
	/** rms called at least once per change, keep it quick! */
	get rms() :RM[] {
		Logger.trace('SettingsForm.rms');
		return ResultMode.getRMs();
	}

	/** getResultModeDisplay called 3 times per change */
	getResultModeDisplay(rm :RM) :string {
		Logger.trace('SettingsForm.getResultModeDisplay');
		return ResultMode.getDisplay(rm);
	}

}
