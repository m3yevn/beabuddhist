import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { FirebaseService } from '../../../services/firebase.service';
import { Routine } from 'src/app/classes/routine';

@Injectable()
export class ViewRoutineResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService,) { }

  resolve(route: ActivatedRouteSnapshot) {

    return new Promise((resolve, reject) => {
      let id = route.paramMap.get('id');
      this.firebaseService.getRoutineDetails(id).then(routine => {
        routine.subscribe( data => {
          data.id = id;
          resolve(data);
        })
      })
    })
  }
}
