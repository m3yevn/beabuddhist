import { ViewChild,Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router,ActivatedRoute} from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../classes/task'


@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.page.html',
  styleUrls: ['./create-routine.page.scss'],
})
export class CreateRoutinePage implements OnInit {
 public routineAvatarUrl = 'assets/icon/favicon.png';
  tasks: Array<Task>;

  validations_form: FormGroup;
  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public router: Router,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private taskService : TaskService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.resetFields();
    this.getTasks();
  }

  async getTasks(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.taskService.getTasks().subscribe(data=>{
      loading.dismiss();
      this.tasks = data;
    })
  }

  resetFields(){
    this.validations_form = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  onSubmit(value){
    let data = {
      title: value.title,
      description: value.description,
      imgurl: this.routineAvatarUrl
    }
    this.firebaseService.createRoutine(data)
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
