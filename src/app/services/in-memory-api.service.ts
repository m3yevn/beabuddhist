import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Task,Avatar } from '../classes/in-memory';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksUrl = 'api/tasks';  // URL to web api
  constructor(
    private http: HttpClient) { }
  /** GET tasks from the server */
  getTasks (): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl)
      .pipe(
        catchError(this.handleError<Task[]>('getTasks', []))
      );
  }
  /** GET task by id. Will 404 if id not found */
  getTask(id: number): Observable<Task> {
    const url = `${this.tasksUrl}/${id}`;
    return this.http.get<Task>(url).pipe(
      catchError(this.handleError<Task>(`getTask id=${id}`))
    );
  }
  //////// Save methods //////////
  /** POST: add a new task to the server */
  addTask (task: Task): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, task, httpOptions).pipe(
      catchError(this.handleError<Task>('addTask'))
    );
  }
  /** DELETE: delete the task from the server */
  deleteTask (task: Task | number): Observable<Task> {
    const id = typeof task === 'number' ? task : task.id;
    const url = `${this.tasksUrl}/${id}`;

    return this.http.delete<Task>(url, httpOptions).pipe(
      catchError(this.handleError<Task>('deleteTask'))
    );
  }
  /** PUT: update the task on the server */
  updateTask(task: Task): Observable<any> {
    return this.http.put(this.tasksUrl, task, httpOptions).pipe(
      catchError(this.handleError<any>('updateTask'))
    );
}

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead


      return of(result as T);
    };
  }
}

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private avatarUrl = 'api/avatar';  // URL to web api
  constructor(
    private http: HttpClient) { }
  /** GET avatar from the server */
  getAvatars (){
    return new Promise<any>((resolve) => {
          resolve(this.http.get<Avatar[]>(this.avatarUrl));
        })
  }
  //////// Save methods //////////
    /** POST: add a new avatar to the server */
    addAvatar (avatar: Avatar): Observable<Avatar> {
      return this.http.post<Avatar>(this.avatarUrl, avatar, httpOptions).pipe(
        catchError(this.handleError<Avatar>('addAvatar'))
      );
    }
      /** GET avatar by id. Will 404 if id not found */
  getAvatar(avatar: Avatar | number){
    const id = typeof avatar === 'number' ? avatar : avatar.id;
    const url = `${this.avatarUrl}/${id}`;
    return new Promise<any>((resolve) => {
      resolve(this.http.get<Avatar>(url,httpOptions));
    })
  }
    /** DELETE: delete the avatar from the server */
    deleteAvatar (avatar: Avatar | number): Observable<Avatar> {
      const id = typeof avatar === 'number' ? avatar : avatar.id;
      const url = `${this.avatarUrl}/${id}`;
  
      return this.http.delete<Avatar>(url, httpOptions).pipe(
        catchError(this.handleError<Avatar>('deleteAvatar'))
      );
    }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}

