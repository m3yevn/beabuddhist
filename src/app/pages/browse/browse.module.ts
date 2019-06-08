import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowsePage } from './browse.page';
import { BrowseResolver } from './browse.resolver';

const routes: Routes = [
  {
    path: '',
    component: BrowsePage,
    resolve: {
      browseData: BrowseResolver
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
  declarations: [BrowsePage],
  providers: [
    BrowseResolver
  ]
})
export class BrowsePageModule {}
