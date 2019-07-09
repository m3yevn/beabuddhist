import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { FirebaseService } from '../../services/firebase.service';
import { Packages } from '../../classes/packages';

@Injectable()
export class PackagesResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService,) { }

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise((resolve, reject) => {
      let id = route.paramMap.get('id');
      this.firebaseService.getPackages(id)
      .then(data => {
        let packages = new Packages();
        packages.id = id;
        packages.packageList = data;
        resolve(packages);
      }, err => {
        reject(err);
      })
    })
  }
}
