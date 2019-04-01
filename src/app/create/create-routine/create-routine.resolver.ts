import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot } from "@angular/router";
import { AvatarService } from '../../services/in-memory-api.service';
import { Avatar } from '../../classes/in-memory'


@Injectable()
export class AvatarResolver implements Resolve<any> {

  constructor(public avatarService: AvatarService,) { }

  resolve(route: ActivatedRouteSnapshot) {

    return new Promise((resolve, reject) => {
      let avatarId = route.paramMap.get('avatar');
      let avatar = new Avatar();
      avatar.id = avatarId;
        this.avatarService.getAvatar(avatar)
        .then(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
      })
    }
  }