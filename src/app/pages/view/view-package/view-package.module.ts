import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PackagesPage } from './view-package.page';

const routes: Routes = [
  {
    path: '',
    component: PackagesPage
  }
];


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PackagesPage],
  providers: [
  ]
})
export class ViewPackagePageModule {}
