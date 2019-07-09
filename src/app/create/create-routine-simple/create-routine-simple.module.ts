import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateRoutineSimplePage } from './create-routine-simple.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRoutineSimplePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateRoutineSimplePage]
})
export class CreateRoutineSimplePageModule {}
