import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-routine',
  templateUrl: './edit-routine.page.html',
  styleUrls: ['./edit-routine.page.scss'],
})
export class EditRoutinePage implements OnInit {

  validations_form: FormGroup;
  image: any;
  item: any;
  load: boolean = false;
  title:any;
  description:any;
  id:any;
  avatar:any;

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
    this.validations_form = this.formBuilder.group({
      title: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required)
    });
    this.getData();
  }

  getData(){
    this.route.data.subscribe(routeData => {
      this.id = routeData['data'].id;
     routeData['data'].subscribe(data => {
     if (data) {
       this.item = data;
       this.title = this.item.title;
       this.description = this.item.description;
       this.avatar = this.item.imgurl;
       this.validations_form = this.formBuilder.group({
        title: new FormControl(this.title,Validators.required),
        description: new FormControl(this.description,Validators.required)
      });
        }
      })
    })
  }

  onSubmit(value){
    let data = {
      title: value.title,
      description: value.description,
    }
    this.firebaseService.updateRoutine(this.id,data)
    .then(
      res => {
        this.router.navigate(["/tabs/home"]);
      }
    )
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you want to delete ' + this.title + '?',
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
            this.firebaseService.deleteRoutine(this.id)
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
