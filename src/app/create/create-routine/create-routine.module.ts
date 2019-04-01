import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {  CreateRoutinePage } from './create-routine.page';
import { AvatarResolver } from './create-routine.resolver'

const routes: Routes = [
  {
    path: '',
    component: CreateRoutinePage,
    resolve:{
      avatarData : AvatarResolver,
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    Location,
  AvatarResolver,
],
  declarations: [CreateRoutinePage ]
})
export class CreateRoutinePageModule {}



