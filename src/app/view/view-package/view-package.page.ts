import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-package',
  templateUrl: './view-package.page.html',
  styleUrls: ['./view-package.page.scss'],
})
export class PackagesPage implements OnInit {

  items: Array<any>;
  title :string;

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
      routeData['data'].subscribe(data => {
        loading.dismiss();
        this.items = data;
      })
      this.title  = routeData['title'].title;
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
