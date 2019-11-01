import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './utils/authguard/routeguard';
import { NgModule } from '@angular/core';
// import { CustomPreloader } from './CustomPreloader';

const appRoutes: Routes = [
	{
		path: 'rsb-modules/organization',
		loadChildren: './rsb-modules/organizations/organizations.module#OrganizationsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 1,
			"preload": true
		},
	},
	{
		path: 'rsb-modules/elements',
		loadChildren: './rsb-modules/elements/elements.module#ElementsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 2,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/spas',
		loadChildren: './rsb-modules/spas/spas.module#SpasModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 3,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/sk',
		loadChildren: './rsb-modules/sk/sk.module#SkModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 12,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/spms',
		loadChildren: './rsb-modules/spms/spms.module#SpmsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 6,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/sems',
		loadChildren: './rsb-modules/sems/sems.module#SemsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 9,
			"preload": true
		},
	},
	{
		path: 'rsb-modules/sfms',
		loadChildren: './rsb-modules/sfms/sfms.module#SfmsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 8,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/alms',
		loadChildren: './rsb-modules/alms/alms.module#AlmsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 4,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/ssms',
		loadChildren: './rsb-modules/ssms/ssms.module#SsmsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 7,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/ams',
		loadChildren: './rsb-modules/ams/ams.module#AmsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 5,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/homs',
		loadChildren: './rsb-modules/homs/homs.module#HomsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 11,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/sp',
		loadChildren: './rsb-modules/sp/sp.module#SpModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 13,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/vics',
		loadChildren: './rsb-modules/vics/vics.module#VicsModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 10,
            "preload": true
		},
	},
	{
		path: 'rsb-modules/lnr',
		loadChildren: './rsb-modules/lnr/lnr.module#LnrModule',
		canActivateChild: [AuthGuard],
		data: {
			"status": "module",
			"moduleId": 14,
            "preload": true
		},
	},
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
    {
        path: 'login',
        redirectTo: 'login',
        pathMatch: 'full'
    }
//    {
//        path: '**',
//        redirectTo: 'login',
//        pathMatch: 'full'
//    },
];

// export const routing = RouterModule.forRoot(appRoutes);


@NgModule({
	imports: [
		RouterModule.forRoot(
			appRoutes,
			// { enableTracing: false, preloadingStrategy: CustomPreloader } // <-- debugging purposes only
		)
	],
	exports: [
		RouterModule
	],
	// providers: [CustomPreloader]
})
export class routing { }
