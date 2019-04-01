import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tasks = [
    ];
    const avatar = [{
      id:'default',
      imgurl:'assets/icon/favicon.png',
    }];
    return {tasks,avatar};
  }

}

