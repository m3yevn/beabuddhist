import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Packages } from '../../classes/packages';

@Component({
  selector: 'app-view-package',
  templateUrl: './view-package.page.html',
  styleUrls: ['./view-package.page.scss'],
})
export class PackagesPage implements OnInit {
  packages: Packages;
  packageDetails: any;
  id:string;
  cat:string;

  constructor(
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getData();
    }
  
  }

  play(audiourl:string){
  }

  pause(){
  }
  
  
  async getData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.route.data.subscribe(routeData => {
      loading.dismiss();
      this.packages = routeData['packageData']
      this.cat = this.packages.cat;
      this.id = this.packages.id;
      this.packages.packageDetails.subscribe(data => {
        this.packageDetails = data;
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  
}

