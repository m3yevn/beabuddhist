import { Component, OnInit, } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import { Avatar } from '../../classes/avatar-routine'

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar-routine.page.html',
  styleUrls: ['./avatar-routine.page.scss'],
})
export class AvatarPage implements OnInit {
  avatar:Avatar;
  avatarList: Array<any>;
  title:string;
  description:string;
  tasks:string;
  currentAvatar:string;


  constructor(
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router : Router,
  ) { }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getData();
    }
  }

  
  async getData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.route.data.subscribe(routeData => {
      this.avatar = routeData['avatarData']
      this.avatar.avatarList.subscribe(data => {
        this.avatarList = data;
        loading.dismiss();
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
