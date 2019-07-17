import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController, AlertController,ModalController,PopoverController } from '@ionic/angular';
import { ActivatedRoute,ActivatedRouteSnapshot, Router } from '@angular/router';
import { Routine } from 'src/app/classes/routine';
import { ViewRoutineSettingsPage } from '../view-routine-settings/view-routine-settings.page';

@Component({
  selector: 'app-view-routine',
  templateUrl: './view-routine.page.html',
  styleUrls: ['./view-routine.page.scss'],
})
export class ViewRoutinePage implements OnInit {

  routine: Routine;
  load: boolean = false;

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.getData();
  }

  async presentModal() {
    const modal = await this.modal.create({
      component: ViewRoutineSettingsPage,
      componentProps: {
        'routine':this.routine
      },
      cssClass: 'view-routine-settings-modal'
    })
    return await modal.present();
  }

  async getData(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.route.data.subscribe(routeData => {
    this.routine = routeData['routineData'];
    loading.dismiss();
      })
    }

  onSubmit(value){
    let data = {
      title: value.title,
      description: value.description,
    }
    this.firebaseService.updateRoutine(this.routine.id,data)
    .then(
      res => {
        this.router.navigate(["/tabs/home"]);
      }
    )
  }


  async presentLoading(loading) {
    return await loading.present();
  }

}
