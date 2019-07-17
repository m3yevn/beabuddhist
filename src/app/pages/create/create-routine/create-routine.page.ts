import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Routine } from 'src/app/classes/routine';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.page.html',
  styleUrls: ['./create-routine.page.scss'],
})
export class CreateRoutinePage implements OnInit {

  routineName: string = "";

  constructor(private firebaseService:FirebaseService,private router:Router) { }

  ngOnInit() {
  }

  createRoutine(){
    let routine = new Routine();
    routine.title = this.routineName;
    this.firebaseService.createRoutine(routine).then( res => {
      this.router.navigateByUrl('/view-routine/'+res.id);
    }).catch( err => {
      console.log(err);
    })
  }
}
