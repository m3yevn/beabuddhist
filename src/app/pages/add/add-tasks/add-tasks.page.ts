import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Routine } from 'src/app/classes/routine';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.page.html',
  styleUrls: ['./add-tasks.page.scss'],
})
export class AddTasksPage implements OnInit {
  categories:Array<any>;
  taskDetails: Array<any>;
  sliderConfig = {
    slidesPerView:1.05,
    centeredSlides:false,
  }
  packageList: Array<any>;
  routine: Routine;

  constructor(private modal:ModalController,private route:ActivatedRoute,private loading:LoadingController
    ,private firebaseSrv:FirebaseService) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loading.create({
      message: 'Please wait...'
    })
    loading.present();
    this.firebaseSrv.getCategories().then( res => {
      res.subscribe( data => {
        this.categories = data;
        this.categories.forEach( category => {
          this.firebaseSrv.getPackages(category.payload.doc.data().name).then( res => {
            res.subscribe( data => {
              if(data.length > 0)
              category.packageList = data;
              loading.dismiss();
            })
          })
        })
      })
    })
  }

  async addTask(catObj,packageObj,index:number) {
    const loading = await this.loading.create({
      message: 'Please wait...'
    })
    loading.present();
    let seqId = this.taskDetails.length+1;
    let newTask = {catId:catObj.payload.doc.data().name,packageId:packageObj.payload.doc.id,id:seqId};
    this.firebaseSrv.addTask(this.routine.id,newTask)
    .then( res => {
      let taskId = res.id;
      this.firebaseSrv.getPackageDetails(newTask.catId,newTask.packageId).then( res => {
        res.subscribe( data => {
          let packageObj = { cat: newTask.catId,id:newTask.packageId}
          this.packageList.push(packageObj)
          data.taskId = taskId;
          this.taskDetails.push(data);
        })
      })
      catObj.packageList.splice(index,1);
      loading.dismiss();
    })
  }

  back(){
    this.modal.dismiss({
      'dismissed': true
    });
  }
}
