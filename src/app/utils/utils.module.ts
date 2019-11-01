import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpService} from './services/http.service';
import {RequestOptions, XHRBackend} from '@angular/http';
import {SearchPipe} from './pipes/search.pipe';
import {MasterDataService} from './services/master-data.service';
import {FilterAreaComponent} from './components/filter-area/filter-area.component';
import {DevicePointComponent} from './components/device-point/device-point.component';
import {FormsModule} from '@angular/forms';
import {SvgService} from './services/svg.service';
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';
import {AuthGuard} from './authguard/routeguard';
import {ErrorMessageService} from '../error-message-service';
import {TranslateModule} from '@ngx-translate/core';
import {SelectRegionComponent} from './components/select-region/select-region.component';

export function httpServiceFactory(backend: XHRBackend, defaultOptions: RequestOptions, errorService: ErrorMessageService) {
    return new HttpService(backend, defaultOptions, errorService);
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MalihuScrollbarModule.forRoot(),
        TranslateModule,
    ],
    declarations: [SearchPipe, FilterAreaComponent, DevicePointComponent,SelectRegionComponent],
    exports: [FilterAreaComponent, DevicePointComponent],
    providers: [
        MasterDataService,
        AuthGuard,
        ErrorMessageService,
        HttpService, {
            provide: HttpService,
            useFactory: httpServiceFactory,
            deps: [XHRBackend, RequestOptions, ErrorMessageService]
        },
        MasterDataService,
        SvgService
    ],
    entryComponents: [DevicePointComponent,SelectRegionComponent]
})
export class UtilsModule {
}