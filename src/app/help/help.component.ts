import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-help',
	templateUrl: './help.component.html',
	styleUrls: ['./help.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpComponent {
	oneAtATime :boolean = true;
}
