import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audio = new Audio();
  constructor() { }

  createAudio(audioUrl:string,positionOb:Subject<number>){
    positionOb.subscribe( data => {
      this.audio.currentTime = data;
    })
    return new Promise<any>( (resolve,reject) => {
      this.audio.src = audioUrl;
      this.audio.load();
      this.audio.onloadedmetadata = (event) => resolve(this.audio.duration) ;
    })
  }
  playAudio(){
    return new Observable<HTMLAudioElement> (subscriber => {
      this.audio.play();
      this.audio.ontimeupdate = (event) => subscriber.next(this.audio) ;
    })
  }

  pauseAudio(){
    return new Promise<any> ((resolve,reject) => {
      this.audio.pause();
      this.audio.onpause = (event) => resolve(this.audio.currentTime) ;
    })
  }

  removeAudio(){
    return new Promise<any> ((resolve,reject) => {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = "";
      this.audio.load();
    })
  }
}
