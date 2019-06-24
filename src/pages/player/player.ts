import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { StatusBar } from '@ionic-native/status-bar';

declare var window: any;

@IonicPage({
  name: 'player',
  segment: 'player'
})
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {

  url: string;
  playType: number;

  playing: boolean = false;

  micLinked: boolean = false;

  playMode: number = 0; // 横屏模式
  // playMode: number = 1; // 竖屏模式

  windowWidth: number = window.innerWidth;

  // 横屏模式下播放器高度
  playerHeight: number = this.windowWidth;
  // 竖屏模式下播放器高度
  // playerHeight: number = this.windowWidth * 9/16;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private screenOrientation: ScreenOrientation,
    private ref: ChangeDetectorRef,
    private statusBar: StatusBar
  ) {
    this.init();
    this.start();
  }

  // 初始化
  init() {
    console.log('[CLiteAV] 初始化...');

    this.url = this.navParams.get('url');
    this.playType = this.navParams.get('playType');

    document.body.classList.add('video-play');

    this.initPlayHandler();
  }

  // 监听播放事件
  initPlayHandler() {
    document.addEventListener('CLiteAV.onNetStatusChange', (netStatus) => {
      console.log(`[CLiteAV WEB] 网络状态：${netStatus}`);
    });

    document.addEventListener('CLiteAV.onPlayEvent', (data: any) => {
      console.log(`[CLiteAV WEB] 播放事件：${data.eventID} - ${data.params}`);
    });
  }

  // 开始播放
  start() {
    console.log('[CLiteAV] 准备播放...');
    try {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(() => {
        window.CLiteAV.startPlay({
          url: this.url,
          playType: this.playType,
          playMode: 0 // 横屏模式
        }, (msgSuccess) => {
          console.log(msgSuccess);
          console.log('[CLiteAV WEB] 播放成功');
          
          // 横屏时
          this.statusBar.hide();

          // 竖屏时，按默认16:9的视频尺寸设置播放器高度，宽度为100%
          // this.statusBar.show();
          // this.statusBar.overlaysWebView(false);
          // this.statusBar.styleLightContent();
          // this.statusBar.backgroundColorByName('black');
        }, (msgError) => {
          console.log(msgError);
          console.log('[CLiteAV WEB] 播放失败');
        });
      });

      this.playing = true;

      // this.screenOrientation.unlock();
    } catch(e) {
      console.log(e);
    }
  }

  // 停止播放
  pause() {
    try {
      window.CLiteAV.pause();
      this.playing = false;
    } catch(e) {
      console.log(e);
    }
  }

  // 恢复播放
  resume() {
    try {
      window.CLiteAV.resume();
      this.playing = true;
    } catch(e) {
      console.log(e);
    }
  }

  // 退出播放
  close() {
    try {
      this.statusBar.show();
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault();

      this.playing = false;
      this.viewCtrl.dismiss();
      document.body.classList.remove('video-play');

      window.CLiteAV.stopPlay();

      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    } catch(e) {
      console.log(e);
    }
  }

  // 横竖屏切换
  changePlayMode() {
    try {
      if (this.playMode == 1) {
        this.playMode = 0;
        this.playerHeight = this.windowWidth;
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(() => {
          window.CLiteAV.setPlayMode(0);
          this.statusBar.hide();
        });
      } else {
        this.playMode = 1;
        this.playerHeight = this.windowWidth * 9/16;
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then(() => {
          window.CLiteAV.setPlayMode(1);
          this.statusBar.show();
          this.statusBar.overlaysWebView(false);
          this.statusBar.styleLightContent();
          this.statusBar.backgroundColorByName('black');
        });
      }
      this.ref.detectChanges();
    } catch(e) {
      console.log(e);
    }
  }

  // 连麦
  startMic() {
    this.micLinked = true;
    window.CLiteAV.startLinkMic({
      url: 'rtmp://192.168.1.23:1935/live/cheney'
    });
  }

  // 连麦
  stopMic() {
    this.micLinked = false;
    window.CLiteAV.stopLinkMic();
  }

}
