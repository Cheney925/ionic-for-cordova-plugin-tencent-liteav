import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	url: string = 'rtmp://live.hkstv.hk.lxdns.com/live/hks';

  constructor(
    public navCtrl: NavController,
    private modal: ModalController
  ) {

  }

  // 跳转播放
  goToPlayerPage() {
    let modal = this.modal.create('player', {
      url: this.url
    });
    modal.present();
  }

}
