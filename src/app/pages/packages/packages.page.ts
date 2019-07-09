import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Packages } from 'src/app/classes/packages';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {

  packages:Packages;
  packageList: Array<any>;
  id:string;

  constructor(
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
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
      loading.dismiss();
      this.packages = routeData['packageData']
      if(this.packages.id)
      this.id = this.packages.id;
      else
      this.id = '';
      this.packages.packageList.subscribe(data => {
        this.packageList = data;
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
