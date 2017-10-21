import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes :Routes = [
	{ path: '', redirectTo: 'search', pathMatch: 'full'}
// 	{ path: 'crisis', loadChildren: 'app/crisis/crisis.module#CrisisModule' },
// 	{ path: 'heroes', loadChildren: 'app/hero/hero.module#HeroModule' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes
		// , { enableTracing: true } // <-- debugging purposes only
	)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
