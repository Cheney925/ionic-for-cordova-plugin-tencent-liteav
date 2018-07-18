import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  playType: string;
  urls: string[] = [
    'rtmp://live.hkstv.hk.lxdns.com/live/hks',
    'http://fms.cntv.lxdns.com/live/flv/channel179.flv',
    '',
    'http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8',
    'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    'rtmp://live.hkstv.hk.lxdns.com/live/hks',
    'file://'
  ];
  url: string;

  constructor(
    public navCtrl: NavController,
    private modal: ModalController
  ) {
    this.playType = '0';
    this.changeType(this.playType);
  }

  // 播放类型切换
  changeType(type: string) {
    this.url = this.urls[type];

    if (type == '2') {
      alert('iOS下精简版SDK暂不支持flv点播');
    }
  }

  // 跳转播放
  goToPlayerPage() {
    if (this.url) {
      let modal = this.modal.create('player', {
        url: this.url,
        playType: this.playType
      });
      modal.present();
    }
  }

}
