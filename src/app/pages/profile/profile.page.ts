import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Profile } from 'src/app/classes/profile';
import { Routine } from 'src/app/classes/routine';
import { AngularFireAuth } from '@angular/fire/auth'
import { ModalController } from '@ionic/angular';
import { ProfileSettingsPage } from '../profile-settings/profile-settings.page'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: Profile;
  routines: Array<any>;
  courses:Array<any>;
  isOwnProfile: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.getProfileDetails();
  }

  async presentModal(){
    var modal = await this.modal.create({
      component: ProfileSettingsPage,
      componentProps: {
        'profile': this.profile
      }
    });
    return await modal.present();
  }

  async getProfileDetails() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.route.data.subscribe(routeData => {
     routeData['profileData'].subscribe( data => {
       this.profile = data;
       loading.dismiss();
     })
     routeData['routineData'].subscribe( data => {
      this.routines = data;
      loading.dismiss();
    })
    routeData['courseData'].subscribe( data => {
      this.courses = data;
      loading.dismiss();
    })
      let uid = routeData['uidData'];
      if(!uid){
        this.isOwnProfile = true;
      }
      else{
        let currentUid = '';
        this.afAuth.user.subscribe( currentUser => {
          if(currentUser)
            currentUid = currentUser.uid;
        })
        if(uid == currentUid){
          this.isOwnProfile = true;
      }}
    })
}


  

  async presentLoading(loading) {
    return await loading.present();
  }

}
