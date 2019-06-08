import { ViewChild,Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Router,ActivatedRoute} from '@angular/router';
import { Routine } from '../../classes/routine'

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.page.html',
  styleUrls: ['./create-routine.page.scss'],
})
export class CreateRoutinePage implements OnInit {

  routine: Routine;
  tasks: Array<any>;
  taskJSON: string;


  validations_form: FormGroup;
  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public router: Router,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private route : ActivatedRoute,
  ) { }

  ngOnInit() {
    this.resetFields();
    this.getRoutine();
  }

  async getRoutine(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.route.data.subscribe(routeData => {
    loading.dismiss();
    this.routine = routeData['routineData'];
    this.tasks = this.routine.tasks;
    this.taskJSON =JSON.stringify(this.tasks);
    this.validations_form = this.formBuilder.group({
          title: new FormControl(this.routine.title, Validators.required),
          description: new FormControl(this.routine.description, Validators.required)
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
      imgurl: this.routine.avatar,
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
