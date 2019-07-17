import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firebaseService: FirebaseService,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ){}

  doRegister(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

  doCreateProfile(name){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;

      this.afs.collection('people').doc(currentUser.uid).collection('profile').doc('personalinfo').set({
        name: name,
        imgurl: '',
        followers: [],
        following: [],
        status: ''
      })
      .then(
        res => resolve(res),
        err => reject(err),
      )
    })
   }

  doLogin(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
      .then(() => {
        this.firebaseService.unsubscribeOnLogOut();
        resolve();
      }).catch((error) => {
        console.log(error);
        reject();
      });
    })
  }
}
