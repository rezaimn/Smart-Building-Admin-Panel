import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';
import {Ng2Webstorage} from 'ngx-webstorage';
import {UtilsModule} from './utils/utils.module';
import {AppCommonModule} from './common/common.module';
import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {AppService} from './app.service';
import {PaginationService} from './pagination-service';
import {MaintenanceErrorPageComponent} from './common/Maintenance-Error-page/Maintenance-Error-page.component';
import {ToastrModule} from 'ngx-toastr';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CalendarConverterService} from './calendar-converter-service';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {MaterialModuleNew} from './mat.module';
import {StompConfig , StompService } from '@stomp/ng2-stompjs';
import {PersianNumbersPipe} from './utils/pipes/persian-numbers.pipe';
import {NotificationsService, SimpleNotificationsModule} from 'angular2-notifications';
import {environment} from '../environments/environment';
//import {MaterialDesignFrameworkModule} from './angular2-json-schema-form-master/src/lib/src/framework-library';
//import {JsonSchemaFormModule} from './angular2-json-schema-form-master/src/lib';

/*  For Hanldling Translations
 *  Link: https://github.com/ngx-translate/core
 */
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};



const stompConfig: StompConfig = {
    // Which server?
    url: environment.wsUrl,

    // Headers
    // Typical keys: login, passcode, host
    headers: {
        // login: 'guest',
        // passcode: 'guest'
    },

    // How often to heartbeat?
    // Interval in milliseconds, set to 0 to disable
    heartbeat_in: 0, // Typical value 0 - disabled
    heartbeat_out: 5000, // Typical value 20000 - every 20 seconds
    // Wait in milliseconds before attempting auto reconnect
    // Set to 0 to disable
    // Typical value 5000 (5 seconds)
    reconnect_delay: 100,

    // Will log diagnostics on console
    debug: true
};

export function HttpLoaderFactory(httpClient: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-4/master/dist/assets_setup/i18n/', '.json');
    return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        MaintenanceErrorPageComponent,
        PersianNumbersPipe
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpModule,
        SimpleNotificationsModule.forRoot(),
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-full-width',
            closeButton: true,
            easing: 'ease-in',
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning',
            },
            tapToDismiss: true,
          preventDuplicates: true

        }),
        Ng2Webstorage,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AppCommonModule,
        MaterialModuleNew,
        routing,
        UtilsModule,
        NoopAnimationsModule,
        PerfectScrollbarModule,
       // MaterialDesignFrameworkModule,
        //JsonSchemaFormModule.forRoot(MaterialDesignFrameworkModule)
    ],
    providers: [
        AppService, PaginationService, CalendarConverterService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        StompService,
        {
            provide: StompConfig,
            useValue: stompConfig
        },
        NotificationsService,
    ],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
