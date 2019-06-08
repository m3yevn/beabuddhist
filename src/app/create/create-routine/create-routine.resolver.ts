import { Injectable } from '@angular/core';
import { Resolve,ActivatedRouteSnapshot } from "@angular/router";
import { Routine } from '../../classes/routine'


@Injectable()
export class CreateRoutineResolver implements Resolve<any> {

  constructor() { }

  resolve(route: ActivatedRouteSnapshot) {

    return new Promise((resolve, reject) => {
      let avatar = route.paramMap.get('avatar');
      let title = route.paramMap.get('title');
      let description = route.paramMap.get('description');
      let tasks = JSON.parse(route.paramMap.get('tasks'));
      
      let routine = new Routine();
      routine.avatar = avatar;
      routine.title = title;
      routine.description = description;
      routine.tasks = tasks;
      resolve(routine);
      })
    }
  }