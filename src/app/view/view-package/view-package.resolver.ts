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
      let cat = route.paramMap.get('cat');
      this.firebaseService.getPackageDetails(cat,id)
      .then(data => {
        let packages = new Packages();
        packages.packageDetails = data;    
        packages.cat = cat;
        packages.id = id;
        resolve(packages);
      }, err => {
        reject(err);
      })
    })
  }
}
