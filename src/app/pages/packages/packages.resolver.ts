import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { FirebaseService } from '../../services/firebase.service';
import { Packages } from '../../classes/packages';

@Injectable()
export class PackagesResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService,) { }

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise((resolve, reject) => {
      let option = route.paramMap.get('option');
      let title = route.paramMap.get('title');
      let description  = route.paramMap.get('description');
      let tasks  = route.paramMap.get('tasks');
      let currentAvatar  = route.paramMap.get('avatar');
      let id = route.paramMap.get('id');
      this.firebaseService.getPackages(id)
      .then(data => {
        let packages = new Packages();
        packages.packageList = data;
        packages.title = title;
        packages.description = description;
        packages.tasks = tasks;
        packages.option = option;
        packages.currentAvatar = currentAvatar;
        packages.id = id;
        resolve(packages);
      }, err => {
        reject(err);
      })
    })
  }
}
