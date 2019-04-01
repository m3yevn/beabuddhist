import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { FirebaseService } from '../../services/firebase.service';

@Injectable()
export class PackagesResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService,) { }

  resolve(route: ActivatedRouteSnapshot) {

    return new Promise((resolve, reject) => {
      let itemId = route.paramMap.get('id');
      let catId = route.paramMap.get('cat');
      this.firebaseService.getPackageDetails(catId,itemId)
      .then(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }
}

export class TitleResolver implements Resolve<any> {

    constructor() { }
  
    resolve(route: ActivatedRouteSnapshot) {
  
      return new Promise((resolve, reject) => {
        let itemId = route.paramMap.get('id');
        let data = { title :''};
        data.title = itemId;
        resolve(data);
      })
    }
  }
