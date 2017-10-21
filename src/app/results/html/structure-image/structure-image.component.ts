import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-structure-image',
	templateUrl: './structure-image.component.html',
	styleUrls: ['./structure-image.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureImageComponent {
	@Input() bytes :string; // Immutable
}
