import { Component, OnInit, } from '@angular/core';
import { LoadingController, NavParams, AlertController } from '@ionic/angular'
import { Router,ActivatedRoute, Data } from '@angular/router';
import { Profile } from 'src/app/classes/profile';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from '../edit/edit-profile/edit-profile.page';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AboutPage } from '../about/about.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { SupportPage } from '../support/support.page';

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
  }

  async editProfile() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    let modal = await this.anotherModal.create({
      component: EditProfilePage,
      cssClass: 'settings-modal',
      componentProps: {
        'profile': this.profile
      }
    });
    return await modal.present().then( () => {
      loading.dismiss();
    });
  }

  async deleteAccount() {
    const alert = await this.alert.create({
      header: 'Delete Account',
      message: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {}
        },
        {
          text: 'Yes',
          cssClass: 'confirm-button',
          handler: () => {
            this.authSrv.doDeleteProfile()
            .then( () => {
              this.modal.dismiss({
                'dismissed': true,
              })
              this.authSrv.doDeleteAccount().then( () => {
                this.router.navigate(["/tabs/home"]);
              })
              },
              err => console.log(err)
            )
          }
        }
      ]
    });
    await alert.present();
  }


async logoutConfirm() {
  const alert = await this.alert.create({
    header: 'Logout Confirmation',
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
          this.logout();
          this.modal.dismiss();
        }
      }
    ]
  });

  await alert.present();
}

async showAbout(){
  const loading = await this.loadingCtrl.create({
    message: 'Please wait...'
  });
  this.presentLoading(loading);
  let modal = await this.anotherModal.create({
    component: AboutPage,
    cssClass: 'settings-modal',
  });
  return await modal.present().then( () => {
    loading.dismiss();
  });
}

async showPP(){
  const loading = await this.loadingCtrl.create({
    message: 'Please wait...'
  });
  this.presentLoading(loading);
  let modal = await this.anotherModal.create({
    component: PrivacyPolicyPage,
    cssClass: 'settings-modal',
  });
  return await modal.present().then( () => {
    loading.dismiss();
  });
}

async showSupport_InProgress() {
  const loading = await this.loadingCtrl.create({
    message: 'Please wait...'
  });
  this.presentLoading(loading);
  let modal = await this.anotherModal.create({
    component: SupportPage,
    cssClass: 'settings-modal',
  });
  return await modal.present().then( () => {
    loading.dismiss();
  });
}

async showSupport(){
  window.open("https://www.patreon.com/meyven", "_blank");
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
