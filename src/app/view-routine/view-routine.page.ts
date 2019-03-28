import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-routine',
  templateUrl: './view-routine.page.html',
  styleUrls: ['./view-routine.page.scss'],
})
export class ViewRoutinePage implements OnInit {

  title: any;
  description: any;
  image: any;
  item: any;
  load: boolean = false;

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.route.data.subscribe(routeData => {
     let data = routeData['data'];
     if (data) {
       this.item = data;
       this.image = this.item.image;
     }
    })
      this.title = this.item.title;
      this.description = this.item.description;
  }

  onSubmit(value){
    let data = {
      title: value.title,
      description: value.description,
    }
    this.firebaseService.updateRoutine(this.item.id,data)
    .then(
      res => {
        this.router.navigate(["/tabs/home"]);
      }
    )
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you want to delete ' + this.item.title + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.firebaseService.deleteRoutine(this.item.id)
            .then(
              res => {
                this.router.navigate(["/tabs/home"]);
              },
              err => console.log(err)
            )
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
