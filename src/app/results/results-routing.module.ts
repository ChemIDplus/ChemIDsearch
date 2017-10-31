import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ResultsComponent } from './results.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'results', component: ResultsComponent },
		{
			path: 'results/tox/:tox1',
			component: ResultsComponent
		},
		{
			path: 'results/toxicity/:tox1',
			component: ResultsComponent
		},
		{
			path: 'results/tox/:tox1/:tox2',
			component: ResultsComponent
		},
		{
			path: 'results/toxicity/:tox1/:tox2',
			component: ResultsComponent
		},
		{
			path: 'results/tox/:tox1/:tox2/:tox3',
			component: ResultsComponent
		},
		{
			path: 'results/toxicity/:tox1/:tox2/:tox3',
			component: ResultsComponent
		},
		{
			path: 'results/tox/:tox1/:tox2/:tox3/:tox4',
			component: ResultsComponent
		},
		{
			path: 'results/toxicity/:tox1/:tox2/:tox3/:tox4',
			component: ResultsComponent
		},
		{
			path: 'results/tox/:tox1/:tox2/:tox3/:tox4/:tox5',
			component: ResultsComponent
		},
		{
			path: 'results/toxicity/:tox1/:tox2/:tox3/:tox4/:tox5',
			component: ResultsComponent
		},
		{
			path: 'results/tox/:tox1/:tox2/:tox3/:tox4/:tox5/:tox6',
			component: ResultsComponent
		},
		{
			path: 'results/toxicity/:tox1/:tox2/:tox3/:tox4/:tox5/:tox6',
			component: ResultsComponent
		},
		{
			path: 'results/pp/:ppf/:op/:value',
			component: ResultsComponent
		},
		{
			path: 'results/physicalproperty/:ppf/:op/:value',
			component: ResultsComponent
		},
		{
			path: 'results/pp/:ppf/:ppmt/:op/:value',
			component: ResultsComponent
		},
		{
			path: 'results/physicalproperty/:ppf/:ppmt/:op/:value',
			component: ResultsComponent
		},
		{
			path: 'results/:fld/:op/:value',
			component: ResultsComponent
		}
	])],
	exports: [RouterModule]
})
export class ResultsRoutingModule {}
