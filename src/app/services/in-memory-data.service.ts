import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Task } from '../classes/task';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tasks = [
    ];
    return {tasks};
  }

}

