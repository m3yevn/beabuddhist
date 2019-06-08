import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Browse } from '../../classes/browse';

@Injectable()
export class BrowseResolver implements Resolve<any> {

  constructor(private firebaseService: FirebaseService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise((resolve, reject) => {
      let option = route.paramMap.get('option');
      let title = route.paramMap.get('title');
      let description  = route.paramMap.get('description');
      let tasks  = route.paramMap.get('tasks');
      let currentAvatar  = route.paramMap.get('avatar');
      this.firebaseService.getCategories()
      .then(data => {
        let browse = new Browse();
        browse.categoryList = data;
        browse.title = title;
        browse.description = description;
        browse.tasks = tasks;
        browse.option = option;
        browse.currentAvatar = currentAvatar;
        resolve(browse);
      }, err => {
        reject(err);
      })
    })
  }
}
