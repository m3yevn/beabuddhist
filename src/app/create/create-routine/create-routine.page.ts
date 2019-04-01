import { ViewChild,Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Router,ActivatedRoute} from '@angular/router';
import { TaskService,AvatarService } from '../../services/in-memory-api.service';
import { Task,Avatar } from '../../classes/in-memory'

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.page.html',
  styleUrls: ['./create-routine.page.scss'],
})
export class CreateRoutinePage implements OnInit {

  avatar: Avatar;
  tasks: Array<Task>;

  validations_form: FormGroup;
  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public router: Router,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private taskService : TaskService,
    private route : ActivatedRoute,
  ) { }

  ngOnInit() {
    this.resetFields();
    this.getTasks();
    this.getAvatar();
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

  async getAvatar(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.route.data.subscribe(routeData => {
      routeData['avatarData'].subscribe(data => {
        loading.dismiss();
        this.avatar = data;
      })
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
      imgurl: this.avatar.imgurl
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
