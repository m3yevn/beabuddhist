import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ){}

  getProfile(uid:string){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          if(!uid)
          uid = currentUser.uid;
          this.snapshotChangesSubscription = this.afs.doc<any>('people/' + uid + '/profile/personalinfo' ).valueChanges();  
            resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getAvatars(categoryId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('buddhism').doc('global').collection('avatars').doc('n59WzCUZ9qCVN7qxp1ge').collection(categoryId, ref => ref.orderBy('id')).snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getPackages(categoryId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('buddhism').doc('global').collection('packages').doc('kYsoUNpIYBQDphOtfn5R').collection(categoryId, ref => ref.orderBy('id')).snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getPackageDetails(catId,packageId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.doc<any>('buddhism/' + 'global' + '/packages/' + 'kYsoUNpIYBQDphOtfn5R'+'/'+catId+'/'+packageId).valueChanges();       
            resolve(this.snapshotChangesSubscription);
          }

      })
    });
  }

  getCategories(){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('buddhism').doc('global').collection('categories', ref => ref.orderBy('id')).snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getBanner(){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('buddhism').doc('global').collection('banner', ref => ref.orderBy('id')).snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getRoutines(uid:string){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          if(!uid)
          uid = currentUser.uid;
          this.snapshotChangesSubscription = this.afs.collection('people').doc(uid).collection('routines', ref => ref.orderBy('title')).snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  
  getCourses(uid:string){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          if(!uid)
          uid = currentUser.uid;
          this.snapshotChangesSubscription = this.afs.collection('people').doc(uid).collection('courses', ref => ref.orderBy('title')).snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getRoutineTasks(routineId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('routines').doc(routineId).collection('tasks', ref => ref.orderBy('id')).snapshotChanges(); 
            resolve(this.snapshotChangesSubscription);
          }
      })
    });
  }

  getRoutineDetails(routineId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.doc<any>('people/' + currentUser.uid + '/routines/' + routineId).valueChanges();  
            resolve(this.snapshotChangesSubscription);
          }
      })
    });
  }

  unsubscribeOnLogOut(){
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  updateRoutine(routineKey, value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('routines').doc(routineKey).set(value)
      .then(
        res => resolve(res), err => reject(err)
      )
    })
  }

  deleteRoutine(routineKey){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('routines').doc(routineKey).delete()
      .then(
        res => resolve(res), err => reject(err)
      )
    })
  }

  createRoutine(value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;

      this.afs.collection('people').doc(currentUser.uid).collection('routines').add({
        title: value.title,
        tasks: []
      })
      .then(
        res => resolve(res),err => reject(err),
      )
    })
  }

  addTask(routineKey,value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;

      this.afs.collection('people').doc(currentUser.uid).collection('routines').doc(routineKey).collection('tasks').add({
        catId: value.catId,
        packageId: value.packageId,
        id:value.id
      })
      .then(
        res => resolve(res),err => reject(err),
      )
    })
  }

  deleteTask(routineKey,taskKey){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;

      this.afs.collection('people').doc(currentUser.uid).collection('routines').doc(routineKey).
      collection('tasks').doc(taskKey).delete()
      .then(
        res => resolve(res),err => reject(err),
      )
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI, randomId){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })
    })
  }
}
