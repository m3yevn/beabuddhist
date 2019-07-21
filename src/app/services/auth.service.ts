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
       res => resolve(res),err => reject(err))
   })
  }

  doDeleteAccount(){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().currentUser.delete().then( () => {
        resolve()
      }).catch( err => {
        reject(err)
      })
   })
  }

  doCreateProfile(profile){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;

      this.afs.collection('people').doc(currentUser.uid).collection('profile').doc('personalinfo').set({
        name: profile.name,imgurl: '',followers: [],following: [],status: "Hello,I'm a new member.",gender: 'Undisclosed',
        email: profile.email,country: ''
      })
      .then(
        res => resolve(res),err => reject(err),
      )
    })
   }

   doDeleteProfile(){
    return new Promise<any>((resolve, reject) => {
      this.afs.doc<any>('people/' + firebase.auth().currentUser.uid+ '/profile/personalinfo').delete()
      .then( () => {
        resolve()
   })
  })
}

   doEditProfile(profile){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;

      this.afs.collection('people').doc(currentUser.uid).collection('profile').doc('personalinfo').set({
        name: profile.name,imgurl: profile.imgurl,followers: profile.followers,following: profile.following,status: profile.status,gender: profile.gender,
        email: profile.email,country: profile.country
      })
      .then(
        res => resolve(res),err => reject(err),
      )
    })
   }

  doLogin(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),err => reject(err))
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
