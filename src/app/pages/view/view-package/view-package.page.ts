import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Packages } from '../../../classes/packages';
import { AudioService } from 'src/app/services/audio.service';
import { Observable, Subject } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-view-package',
  templateUrl: './view-package.page.html',
  styleUrls: ['./view-package.page.scss'],
})
export class ViewPackagePage implements OnInit {
  packages: Packages;
  packageDetails: any;
  id:string;
  cat:string;
  isPlaying: boolean = false;
  duration: any = -1;
  position: any = 0;
  durationFormat: any;
  positionFormat: any;
  positionOb = new Subject<number>();
  packageList: Array<any>;
  currentIndex: number;
  isShuffled: boolean = false;
  isRepeated: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,private route: ActivatedRoute,private audioSrv: AudioService,
    private router: Router,private firebaseSrv: FirebaseService,private modal: ModalController
  ) {
  }

  ngOnInit() {
    this.initData();
  }


  play(){
    this.audioSrv.playAudio().subscribe( data => {
      this.position = data.currentTime;
      this.positionFormat = this.format(this.position);
      if(Math.floor(this.position) == Math.floor(this.duration)){
      if(this.currentIndex != this.packageList.length-1)
      this.next();
      else
      this.isPlaying = false;
      if(this.isRepeated){
        this.getData();
      }
      }
    });
    this.isPlaying = true;
  }

  pause(){
    this.audioSrv.pauseAudio().then( data => {
      this.position = data;
      this.positionFormat = this.format(this.position);
      this.isPlaying = false;
    });
  }

  next(){
    let nextIndex = 0;
    if(this.currentIndex != this.packageList.length-1)
     nextIndex = this.currentIndex+1;
    else
    nextIndex = this.currentIndex;
    this.audioSrv.removeAudio();
    if(this.isShuffled)
    nextIndex = this.blrand(0,this.packageList.length-1,[this.currentIndex])
    if(this.isRepeated)
    nextIndex = this.currentIndex;
    this.id = this.packageList[nextIndex].id;
    this.cat = this.packageList[nextIndex].cat;
    this.currentIndex = nextIndex;
    this.getData();
  }

  previous(){
    let prevIndex = 0;
    if(this.currentIndex != 0)
    prevIndex = this.currentIndex-1;
    else
    prevIndex = this.currentIndex;
    this.audioSrv.removeAudio();
    if(this.isShuffled)
    prevIndex = this.blrand(0,this.packageList.length-1,[this.currentIndex])
    if(this.isRepeated)
    prevIndex = this.currentIndex;
    this.id = this.packageList[prevIndex].id;
    this.cat = this.packageList[prevIndex].cat;
    this.currentIndex = prevIndex;
    this.getData();
  }

  blrand(min, max, blacklist) {
    if(!blacklist)
        blacklist = []
    let rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    let retv = 0;
    while(blacklist.indexOf(retv = rand(min,max)) > -1) { }
    return retv;
}

  back(){
    this.audioSrv.removeAudio();
    this.modal.dismiss({
      'dismissed': true
    })
  }

  setPosition(){
    this.positionOb.next(this.position);
    this.positionFormat = this.format(this.position);
  }

  shuffle(){
    this.isShuffled = true;
  }

  unshuffle(){
    this.isShuffled = false;
  }

  repeat(){
    this.isRepeated = true;
  }

  unrepeat(){
    this.isRepeated = false;
  }
  
  async initData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.getData();
    loading.dismiss();
  }

  async getData(){
    this.firebaseSrv.getPackageDetails(this.cat,this.id).then( data => {
      this.packages = data.subscribe( detail => {
        this.packageDetails = detail;
        this.audioSrv.createAudio(this.packageDetails.audiourl,this.positionOb).then( duration => {
          this.duration = duration;
          this.durationFormat = this.format(this.duration);
          this.play();
        })
      });
    })
  }

   format(time:number){
     let minute = 0;
     if(time > 60){
     minute = Math.floor(time / 60);
     }
     else{
      minute = 0;
     }
    let second = Math.floor((time - (minute*60)));
    let minuteStr = "", secondStr = "";
    if(second < 10)
    secondStr = "0"+second;
    else
    secondStr = second.toString();
    if(minute < 10)
    minuteStr = "0"+minute;
    else
    minuteStr = minute.toString();
    return minuteStr+":"+secondStr;
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  
}

