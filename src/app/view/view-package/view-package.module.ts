import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PackagesPage } from './view-package.page';
import { PackagesResolver} from './view-package.resolver';

const routes: Routes = [
  {
    path: '',
    component: PackagesPage,
    resolve: {
      packageData: PackagesResolver,
    }
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
    PackagesResolver,
  ]
})
export class ViewPackagePageModule {}
