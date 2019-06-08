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
  title:string;
  description:string;
  taskJSON:string;
  currentAvatar:string;
  option:string;

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
      loading.dismiss();
      this.browse = routeData['browseData']
      if(this.browse.title)
      this.title = this.browse.title;
      else
      this.title = '';
      if(this.browse.description)
      this.description = this.browse.description;
      else
      this.description = '';
      if(this.browse.tasks)
      this.taskJSON = this.browse.tasks;
      else
      this.taskJSON = '[]';
      if(this.browse.currentAvatar)
      this.currentAvatar = this.browse.currentAvatar;
      else
      this.currentAvatar = '';
      if(this.browse.option)
      this.option = this.browse.option;
      else
      this.option = '';
      this.browse.categoryList.subscribe(data => {
        this.categoryList = data;
      })
    })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
