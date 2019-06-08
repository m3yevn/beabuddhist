import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { FirebaseService } from '../../services/firebase.service';
import { Avatar } from '../../classes/avatar-routine'

@Injectable()
export class AvatarResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService,) { }

  resolve(route: ActivatedRouteSnapshot) {

    return new Promise((resolve, reject) => {
      let title = route.paramMap.get('title');
      let description  = route.paramMap.get('description');
      let tasks  = route.paramMap.get('tasks');
      let currentAvatar  = route.paramMap.get('avatar');
      this.firebaseService.getAvatars('routine')
      .then(data => {
        let avatar = new Avatar();
        avatar.avatarList = data;
        avatar.title = title;
        avatar.description = description;
        avatar.tasks = tasks;
        avatar.currentAvatar = currentAvatar;
        resolve(avatar);
      }, err => {
        reject(err);
      })
    })
  }
}
