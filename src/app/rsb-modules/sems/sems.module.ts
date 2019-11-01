
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { ConfirmModalComponent } from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';


// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { SwitchModule } from './switch/switch.module';
import { StatusModule } from 'app/rsb-modules/sems/status/status.module';
import { HvacModule } from 'app/rsb-modules/sems/hvac/hvac.module';
import { LightningModule } from 'app/rsb-modules/sems/lightning/lightning.module';
import { PlugModule } from 'app/rsb-modules/sems/plug/plug.module';


@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SwitchModule,
    SubsidiaryListModule,
    StatusModule,
    HvacModule,
    LightningModule,
    SwitchModule,
    PlugModule,
    AppCommonModule,
  ],
  declarations: [],
  entryComponents: [ConfirmModalComponent],
  exports: []
})
export class SemsModule { }


