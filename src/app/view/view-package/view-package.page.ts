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

  packages:Packages;
  packageDetails: any;
  title:string;
  description:string;
  taskJSON:string;
  currentAvatar:string;
  option:string;
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
  
  async getData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.route.data.subscribe(routeData => {
      loading.dismiss();
      this.packages = routeData['packageData']
      if(this.packages.title)
      this.title = this.packages.title;
      else
      this.title = '';
      if(this.packages.description)
      this.description = this.packages.description;
      else
      this.description = '';
      if(this.packages.tasks)
      this.taskJSON = this.packages.tasks;
      else
      this.taskJSON = '';
      if(this.packages.currentAvatar)
      this.currentAvatar = this.packages.currentAvatar;
      else
      this.currentAvatar = '';
      if(this.packages.option)
      this.option = this.packages.option;
      else
      this.option = '';
      if(this.packages.id)
      this.id = this.packages.id;
      else
      this.id = '';
      if(this.packages.cat)
      this.cat = this.packages.cat;
      else
      this.cat = '';
      this.packages.packageDetails.subscribe(data => {
        this.packageDetails = data;
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
