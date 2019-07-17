import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class ProfileResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService,private afAuth: AngularFireAuth) { }

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise((resolve, reject) => {
      let uid = route.paramMap.get('uid');
      this.firebaseService.getProfile(uid)
      .then(profile => {
          resolve(profile);
      }, err => {
        reject(err);
      })
    })
  }
}
@Injectable()
export class UidResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise((resolve, reject) => {
      let uid = route.paramMap.get('uid');
      resolve(uid);
    })
  }
}

@Injectable()
export class RoutineResolver implements Resolve<any> {

  constructor(private firebaseService: FirebaseService) {}

  resolve(route: ActivatedRouteSnapshot) {
    let uid = route.paramMap.get('uid');
    return this.firebaseService.getRoutines(uid);
  }
}

@Injectable()
export class CourseResolver implements Resolve<any> {

  constructor(private firebaseService: FirebaseService) {}

  resolve(route: ActivatedRouteSnapshot) {
    let uid = route.paramMap.get('uid');
    return this.firebaseService.getCourses(uid);
  }
}

