import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerPage } from './player';

@NgModule({
  declarations: [
    PlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerPage),
  ],
})
export class PlayerPageModule {}
