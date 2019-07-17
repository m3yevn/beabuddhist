import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Injectable()
export class RoutineResolver implements Resolve<any> {

  constructor(private firebaseService: FirebaseService) {}

  resolve() {
    return this.firebaseService.getRoutines(null);
  }
}

@Injectable()
export class CourseResolver implements Resolve<any> {

  constructor(private firebaseService: FirebaseService) {}

  resolve() {
    return this.firebaseService.getCourses(null);
  }
}

@Injectable()
export class BannerResolver implements Resolve<any> {

  constructor(private firebaseService: FirebaseService) {}

  resolve() {
    return this.firebaseService.getBanner();
  }
}
