import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Preferences } from './../domain/preferences';
import { RM, ResultMode } from './../domain/result-mode';
import { Srt, Sort } from './../domain/sort';
import { DM, DataMode } from './../domain/data-mode';

import { AppService } from './../core/app.service';

import { Logger } from './../core/logger';

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
	ctrlSortBy :FormControl;
	ctrlSimPercent :FormControl;
	ctrlStructures :FormControl;
	ctrlDmChoice :FormControl;
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
		this.ctrlSortBy = new FormControl(this.app.srt);
		this.ctrlFldOpAbbr = new FormControl(this.app.useFieldOperatorAbbreviations ? 'abbr' : 'full');
		this.ctrlSimPercent = new FormControl(this.app.simPercent);
		this.ctrlStructures = new FormControl(this.app.viewStructures);
		this.ctrlDmChoice = new FormControl(this.app.dm);

		this.form = this.formBuilder.group(
			{
				'ctrlResultPage':this.ctrlResultPage,
				'ctrlAutoCompleteResult':this.ctrlAutoCompleteResult,
				'ctrlResultMode':this.ctrlResultMode,
				'ctrlFldOpAbbr':this.ctrlFldOpAbbr,
				'ctrlSortBy':this.ctrlSortBy,
				'ctrlSimPercent':this.ctrlSimPercent,
				'ctrlStructures':this.ctrlStructures,
				'ctrlDmChoice' :this.ctrlDmChoice
			});

		this.subscriptions.push(this.form.valueChanges.subscribe( () => this.onFormChanges() ));
	}

	/** onFormChanges - called on everything! */
	onFormChanges() :void {
		Logger.trace('SettingsForm.onFormChanges');
		this.app.setPreferences(new Preferences(+this.ctrlResultMode.value, +this.ctrlAutoCompleteResult.value, this.ctrlFldOpAbbr.value === 'abbr', +this.ctrlResultPage.value, +this.ctrlSortBy.value, +this.ctrlSimPercent.value, this.ctrlStructures.value, +this.ctrlDmChoice.value));
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

	get srts() :ReadonlyArray<Srt>{
		Logger.trace('SettingsForm.srts');
		return Sort.srts.filter((s :Srt) => s !== Srt.similarity);
	}

	getSortDisplay(srt :Srt) :String{
		Logger.trace('SettingsForm.getSortDisplay');
		return Sort.getDisplay(srt);
	}

	get dms() :ReadonlyArray<DM>{
		Logger.trace('SettingsForm.dms');
		return DataMode.DMs.filter( (dm :DM) => dm !== DM.totals && dm !== DM.valueCounts);

	}

	getDataModeDisplay(dm :DM) :String{
		Logger.trace('SettingsForm.getDataModeDisplay');
		return DM[dm];
	}


}
