import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import {  CreateRoutinePage } from './create-routine.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRoutinePage
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
  providers: [Location],
  declarations: [CreateRoutinePage]
})
export class CreateRoutinePageModule {}



