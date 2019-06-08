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
  title:string;
  description:string;
  taskJSON:string;
  currentAvatar:string;
  option:string;
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
      this.packages.packageList.subscribe(data => {
        this.packageList = data;
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
