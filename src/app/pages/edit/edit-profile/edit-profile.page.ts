import { Component, OnInit } from '@angular/core';
import { ModalController,LoadingController, AlertController } from '@ionic/angular';
import { CountryService } from 'src/app/services/country.service';
import { Profile } from 'src/app/classes/profile';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  profile:Profile;

  constructor(private modal: ModalController, private countrySrv: CountryService,
     private authSrv:AuthService, private loadingCtrl:LoadingController,private alertCtrl:AlertController
     ,private router:Router) { }
  countries:Array<any>;
  genders: Array<any> = [
    {value : "Male"},
    {value : "Female"},
    {value : "Undisclosed"},
  ]


  ngOnInit() {
    this.preparePage();
  }

  
  async preparePage(){
    this.countrySrv.getAllCountries().then( res => {
      this.countries = res;
    }).catch( err => {
      console.log(err);
    })
  }

  async selectCountry(country){
    this.profile.country = country.name;
  }

  async selectGender(gender){
    this.profile.gender = gender.value;
  }

  async back() {
    this.modal.dismiss({
      'dismissed': true
    });
  }
  
  async save() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.authSrv.doEditProfile(this.profile).then( res => {
      this.modal.dismiss({
        'dismissed': true
      }).then( res => {
        loading.dismiss();
      });
    })
  }


  async presentLoading(loading) {
    return await loading.present();
  }
}
