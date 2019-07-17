import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsPageModule } from './pages/tabs/tabs.module';
import { AvatarPageModule } from './pages/avatar-routine/avatar-routine.module'
import { ProfileSettingsPageModule } from './pages/profile-settings/profile-settings.module'
import { EditProfilePageModule } from './pages/edit/edit-profile/edit-profile.module'
import { ViewRoutineSettingsPageModule } from './pages/view/view-routine-settings/view-routine-settings.module'



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,HttpClientModule,
    AvatarPageModule,IonicModule.forRoot(),AppRoutingModule,FormsModule,TabsPageModule,ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),AngularFirestoreModule,
    AngularFireAuthModule, AngularFireStorageModule,ProfileSettingsPageModule,EditProfilePageModule,
    ViewRoutineSettingsPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: FirestoreSettingsToken, useValue: {} },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
