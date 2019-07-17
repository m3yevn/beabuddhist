import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, ModalController } from '@ionic/angular';
import { Routine } from 'src/app/classes/routine';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-routine-settings',
  templateUrl: './view-routine-settings.page.html',
  styleUrls: ['./view-routine-settings.page.scss'],
})
export class ViewRoutineSettingsPage implements OnInit {
  routine: Routine;

  constructor(private alertCtrl:AlertController ,private navParams:NavParams,
    private firebaseService: FirebaseService, private router: Router,private modal: ModalController) {  }

  ngOnInit() {
    this.getRoutineData();
  }

  getRoutineData() {
    this.routine = this.navParams.get('routine');
  }


  async deleteRoutine() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Routine',
      message: 'Confirm you want to delete ' + this.routine.title + '?',
      cssClass: 'dark-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {}
        },
        {
          text: 'Yes',
          cssClass: 'confirm-button',
          handler: () => {
            this.firebaseService.deleteRoutine(this.routine.id)
            .then(
              res => {
                this.modal.dismiss({
                  'dismiss': true
                })
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

}
