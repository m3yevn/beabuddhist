import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewRoutineTaskSettingsPage } from './view-routine-task-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ViewRoutineTaskSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewRoutineTaskSettingsPage]
})
export class ViewRoutineTaskSettingsPageModule {}
