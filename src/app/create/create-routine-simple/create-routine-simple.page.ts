import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Routine } from 'src/app/classes/routine';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-routine-simple',
  templateUrl: './create-routine-simple.page.html',
  styleUrls: ['./create-routine-simple.page.scss'],
})
export class CreateRoutineSimplePage implements OnInit {

  routineName: string = "";

  constructor(private firebaseService:FirebaseService,private router:Router) { }

  ngOnInit() {
  }

  createRoutine(){
    let routine = new Routine();
    routine.title = this.routineName;
    this.firebaseService.createRoutine(routine).then( res => {
      this.router.navigateByUrl('/tabs/home');
    }).catch( err => {
      console.log(err);
    })
  }
}
