import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewPackagePage } from './view-package.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPackagePage
  }
];


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewPackagePage],
  providers: [
  ]
})
export class ViewPackagePageModule {}
