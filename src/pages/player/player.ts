import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

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

	playing: boolean = false;

	playMode: number = 1; // 默认竖屏模式

  playerHeight: number = 0; // 播放器高度

  windowWidth: number = window.innerWidth;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private statusBar: StatusBar,
  	private viewCtrl: ViewController,
    private screenOrientation: ScreenOrientation,
    private ref: ChangeDetectorRef
  ) {
    this.init();
    this.start();
  }

  // 初始化
  init() {
    console.log('[CLiteAV] 初始化...');

    this.statusBar.hide();

  	this.url = this.navParams.get('url');
  	document.body.classList.add('video-play');

    this.initScreenHandler();

    // this.initPlayHandler();

    // 按默认16:9的视频尺寸设置播放器高度，宽度为100%
    this.playerHeight = this.windowWidth * 9/16;
  }

  // 监听播放事件
  initPlayHandler() {
    document.addEventListener('CLiteAV.onNetStatus', function(netStatus) {
      console.log('监听到“CLiteAV.onNetStatus”事件');
      console.log(netStatus);
    });
  }

  // 监听设置屏幕变化
  initScreenHandler() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.screenOrientation.onChange().subscribe(() => {
      console.log('[CLiteAV] 屏幕横竖屏发生变化');
      console.log(this.screenOrientation.type);
      let type = this.screenOrientation.type;
      if (type.indexOf('portrait') != -1) {
        this.playMode = 1;
        this.playerHeight = this.windowWidth * 9/16;
        window.CLiteAV.setPlayMode(1);
        this.screenOrientation.unlock();
      } else {
        this.playMode = 0;
        this.playerHeight = this.windowWidth;
        window.CLiteAV.setPlayMode(0);
      }
      this.ref.detectChanges();
    });
  }

  // 开始播放
  start() {
    console.log('[CLiteAV] 准备播放...');
  	try {
	  	window.CLiteAV.startPlay({
	      url: this.url,
	      playType: window.CLiteAV.PLAY_TYPE.LIVE_RTMP
	    }, (msgSuccess) => {
	      console.log(msgSuccess);
        console.log('[CLiteAV WEB] 播放成功');
		  }, (msgError) => {
	      console.log(msgError);
        console.log('[CLiteAV WEB] 播放失败');
		  });

	  	this.playing = true;

      this.screenOrientation.unlock();
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
		  this.playing = false;
	  	this.viewCtrl.dismiss();

	  	this.statusBar.show();
	  	document.body.classList.remove('video-play');

	  	window.CLiteAV.stopPlay();
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
	  		window.CLiteAV.setPlayMode(0);
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  		} else {
  			this.playMode = 1;
        this.playerHeight = this.windowWidth * 9/16;
	  		window.CLiteAV.setPlayMode(1);
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  		}
      this.ref.detectChanges();
	  } catch(e) {
  		console.log(e);
  	}
  }

}
