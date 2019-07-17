import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewRoutineSettingsPage } from './view-routine-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ViewRoutineSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewRoutineSettingsPage]
})
export class ViewRoutineSettingsPageModule {}
