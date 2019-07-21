import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController, AlertController,ModalController,PopoverController } from '@ionic/angular';
import { ActivatedRoute,ActivatedRouteSnapshot, Router } from '@angular/router';
import { Routine } from 'src/app/classes/routine';
import { ViewRoutineSettingsPage } from '../view-routine-settings/view-routine-settings.page';
import { AddTasksPage } from '../../add/add-tasks/add-tasks.page';
import { ViewRoutineTaskSettingsPage } from '../view-routine-task-settings/view-routine-task-settings.page';
import { ViewPackagePage } from '../view-package/view-package.page';

@Component({
  selector: 'app-view-routine',
  templateUrl: './view-routine.page.html',
  styleUrls: ['./view-routine.page.scss'],
})
export class ViewRoutinePage implements OnInit {
  taskDetails: Array<any> = [];
  routine: Routine;
  load: boolean = false;
  packageIdList:Array<any> = [];

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private firebaseSrv: FirebaseService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.getData();
  }

  async presentSettingModal() {
    const modal = await this.modal.create({
      component: ViewRoutineSettingsPage,
      componentProps: {
        'routine':this.routine,
        'taskDetails':this.taskDetails,
        'packageList':this.packageIdList
      },
      cssClass: 'view-routine-settings-modal'
    })
    return await modal.present();
  }

  async presentAddTaskModal() {
    const modal = await this.modal.create({
      component: AddTasksPage,
      componentProps: {
        'routine':this.routine,
        'taskDetails':this.taskDetails,
        'packageList':this.packageIdList
      },
      cssClass: 'settings-modal'
    })
    return await modal.present();
  }

  async presentTaskSettingModal(task,index) {
    const modal = await this.modal.create({
      component: ViewRoutineTaskSettingsPage,
      componentProps: {
        'routine':this.routine,
        'taskDetails':this.taskDetails,
        'task':task,
        'index':index,
        'packageList':this.packageIdList
      },
      cssClass: 'view-routine-settings-modal'
    });
    return await modal.present();
  }

  async playRoutine(){
    const modal = await this.modal.create({
      component: ViewPackagePage,
      componentProps: {
        'cat':this.packageIdList[0].cat,
        'taskDetails':this.taskDetails,
        'id':this.packageIdList[0].id,
        'packageList':this.packageIdList,
        'currentIndex':0
      },
      cssClass: 'settings-modal'
    })
    return await modal.present();
  }

  async viewPackage(index){
    const modal = await this.modal.create({
      component: ViewPackagePage,
      componentProps: {
        'cat':this.packageIdList[index].cat,
        'taskDetails':this.taskDetails,
        'id':this.packageIdList[index].id,
        'packageList':this.packageIdList,
        'currentIndex':index
      },
      cssClass: 'settings-modal'
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
    let taskDetailList = [];
    routeData['taskData'].forEach( taskDetail => {
      let catId = taskDetail.payload.doc.data().catId; let packageId = taskDetail.payload.doc.data().packageId;
        this.firebaseSrv.getPackageDetails(catId,packageId).then( res => {
          res.subscribe( data => {
            data.taskId = taskDetail.payload.doc.id;
            let packageObj = { cat: catId,id:packageId};
            this.packageIdList.push(packageObj);
            taskDetailList.push(data);
            this.taskDetails = taskDetailList;
          })
        })
    })
    loading.dismiss();
      })
    }

  onSubmit(value){
    let data = {
      title: value.title,
      description: value.description,
    }
    this.firebaseSrv.updateRoutine(this.routine.id,data)
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
