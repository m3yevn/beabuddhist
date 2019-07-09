import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Browse } from '../../classes/browse';

@Injectable()
export class BrowseResolver implements Resolve<any> {

  constructor(private firebaseService: FirebaseService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise((resolve, reject) => {
      this.firebaseService.getCategories()
      .then(data => {
        let browse = new Browse();
        browse.categoryList = data;
        resolve(browse);
      }, err => {
        reject(err);
      })
    })
  }
}
