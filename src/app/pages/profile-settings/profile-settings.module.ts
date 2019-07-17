import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileSettingsPage } from './profile-settings.page';


const routes: Routes = [
  {
    path: '',
    component: ProfileSettingsPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileSettingsPage],
  providers:[]
})
export class ProfileSettingsPageModule {}
