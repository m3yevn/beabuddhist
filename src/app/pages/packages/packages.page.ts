import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Packages } from 'src/app/classes/packages';
import { ViewPackagePage } from '../view/view-package/view-package.page'

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {

  packages:any;
  packageList: Array<any>;
  packageIdList: Array<any> = [];
  id:string;

  constructor(
    public loadingCtrl: LoadingController,private route: ActivatedRoute,private router: Router,
    private modal:ModalController
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
      this.packages = routeData['packageData']
      if(this.packages.id)
      this.id = this.packages.id;
      this.packages.packageList.subscribe(data => {
        this.packageList = data;
        this.packageList.forEach( value => {
          let packageObj = { cat: this.id,id:value.payload.doc.id}
          this.packageIdList.push(packageObj)
        })
        loading.dismiss();
      })
    })
  }

  back(){
    this.router.navigateByUrl("/tabs/browse");
  }

  async viewPackage(packageId:string,index:number){
    const modal = await this.modal.create({
      component: ViewPackagePage,
      componentProps:{
        'cat':this.id,
        'id':packageId,
        'packageList':this.packageIdList,
        'currentIndex':index
      },
      cssClass: 'settings-modal'
    })
    modal.present();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
