import { Component, OnInit, } from '@angular/core';
import { LoadingController, NavParams, AlertController } from '@ionic/angular'
import { Router,ActivatedRoute, Data } from '@angular/router';
import { Profile } from 'src/app/classes/profile';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from '../edit/edit-profile/edit-profile.page';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {

  constructor(private router:Router, private route:ActivatedRoute,private loadingCtrl:LoadingController,
    private navParams: NavParams, private modal: ModalController,private anotherModal:ModalController,
    private alert: AlertController,private authSrv:AuthService) { }
  
    profile: Profile;

  ngOnInit() {
    this.getProfileData();
  }

  async editProfile() {
    let modal = await this.anotherModal.create({
      component: EditProfilePage,
      componentProps: {
        'profile': this.profile
      }
    });
    return await modal.present();
  }

  async getProfileData() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.profile = this.navParams.get('profile');
    loading.dismiss();
}

async logoutConfirm() {
  const alert = await this.alert.create({
    header: 'Confirm to logout',
    message: 'Are you sure to logout?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
        }
      }, {
        text: 'Proceed',
        handler: () => {
          this.modal.dismiss();
         this.logout();
        }
      }
    ]
  });

  await alert.present();
}


logout(){
  this.authSrv.doLogout()
  .then(res => {
    this.router.navigate(["/login"]);
  }, err => {
    console.log(err);
  })
}

  async presentLoading(loading) {
    return await loading.present();
  }

  back(){
    this.modal.dismiss({
      'dismissed': true
    });
  }
}
