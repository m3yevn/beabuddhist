import { Component, OnInit, } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import { AvatarService } from '../../services/in-memory-api.service';
import { Avatar } from '../../classes/in-memory'
import { setCheckNoChangesMode } from '@angular/core/src/render3/state';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage implements OnInit {

  items: Array<any>;
  title: string;
  originalAvatar: Avatar;

  constructor(
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private avatarService: AvatarService,
    private location : Location,
    private router : Router,
  ) { }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getData();
    }
  }

  async selectAvatar(id,imgurl){
    let selectedAvatar = new Avatar();
    selectedAvatar.id = id;
    selectedAvatar.imgurl = imgurl;

        this.avatarService.addAvatar(selectedAvatar).subscribe(data=>{
          this.router.navigate(['/tabs/home']);
          this.router.navigate(['/create-routine',data.id]);
        });
    }
  
  async getData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.route.data.subscribe(routeData => {
      routeData['data'].subscribe(data => {
        loading.dismiss();
        this.items = data;
      })

      routeData['currentAvatar'].subscribe(data => {
        loading.dismiss();
        this.originalAvatar = data[0];
      })
    
      this.title  = routeData['title'].title;
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
