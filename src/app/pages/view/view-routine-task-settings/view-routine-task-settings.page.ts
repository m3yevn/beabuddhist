import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Routine } from 'src/app/classes/routine';
import { ViewPackagePage } from '../view-package/view-package.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-routine-task-settings',
  templateUrl: './view-routine-task-settings.page.html',
  styleUrls: ['./view-routine-task-settings.page.scss'],
})
export class ViewRoutineTaskSettingsPage implements OnInit {
  routine: Routine;
  taskDetails:Array<any>;
  task:any;
  index:number;
  packageList:Array<any>;

  constructor(private firebaseSrv:FirebaseService,private loading:LoadingController,
    private modal:ModalController,private anotherModal:ModalController,private router:Router) { }

  ngOnInit() {
  }

  async removeTask(){
    const loading = await this.loading.create({
      message: 'Please wait...'
    })
    loading.present();
    this.firebaseSrv.deleteTask(this.routine.id,this.task.taskId)
    .then( res => {
      this.taskDetails.splice(this.index,1);
      this.packageList.splice(this.index,1);
      loading.dismiss();
      this.modal.dismiss({
        'dismissed':true
      })
    })
  }

  async viewCategory(){
    this.modal.dismiss({
      'dismissed':true
    })
    this.router.navigateByUrl('/packages/'+this.packageList[this.index].cat)
  }



  async viewTask(){
      const modal = await this.anotherModal.create({
        component: ViewPackagePage,
        componentProps: {
          'cat':this.packageList[this.index].cat,
          'taskDetails':this.taskDetails,
          'id':this.packageList[this.index].id,
          'packageList':this.packageList,
          'currentIndex':this.index
        },
        cssClass: 'settings-modal'
      })
      this.modal.dismiss({
        'dismissed':true
      })
      return await modal.present();
    }
}
