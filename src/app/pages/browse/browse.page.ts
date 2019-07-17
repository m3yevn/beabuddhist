import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Browse } from '../../classes/browse';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit {

  browse:Browse;
  categoryList: Array<any>;

  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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
      this.browse = routeData['browseData']
      this.browse.categoryList.subscribe(data => {
        this.categoryList = data;
        loading.dismiss();
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
