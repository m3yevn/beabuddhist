import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, ModalController, LoadingController } from '@ionic/angular';
import { Routine } from 'src/app/classes/routine';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { AddTasksPage } from '../../add/add-tasks/add-tasks.page';

@Component({
  selector: 'app-view-routine-settings',
  templateUrl: './view-routine-settings.page.html',
  styleUrls: ['./view-routine-settings.page.scss'],
})
export class ViewRoutineSettingsPage implements OnInit {
  routine: Routine;
  taskDetails:Array<any>;
  packageList:Array<any>;

  constructor(private alertCtrl:AlertController ,private navParams:NavParams,
    private firebaseSrv: FirebaseService, private router: Router,private modal: ModalController,
    private loading:LoadingController,private anotherModal:ModalController) {  }

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
            this.firebaseSrv.deleteRoutine(this.routine.id)
            .then(
              res => {
                this.modal.dismiss({
                  'dismissed': true
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
  
  async addTasks(){
    const modal = await this.anotherModal.create({
      component: AddTasksPage,
      componentProps: {
        'routine':this.routine,
        'taskDetails':this.taskDetails,
        'packageList':this.packageList,
      },
      cssClass: 'settings-modal'
    })
    this.modal.dismiss({
      'dismissed':true
    })
    return await modal.present();
  }

  async removeAllTasks(){
    const loading = await this.loading.create({
      message: 'Please wait...'
    })
    loading.present();
    let count = 0; let taskDetailLength = this.taskDetails.length;
    this.taskDetails.forEach( taskDetail => {
      this.firebaseSrv.deleteTask(this.routine.id,taskDetail.taskId)
      .then( res => {
        this.taskDetails.splice(0,1);
        this.packageList.splice(0,1);
        count++;
        if(count == taskDetailLength){
        this.modal.dismiss({
          'dismissed':true
        }).then(() => { loading.dismiss();})
      }
      })
    })
  }

}
