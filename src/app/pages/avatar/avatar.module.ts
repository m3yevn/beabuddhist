import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarPage } from './avatar.page';
import { AvatarResolver,TitleResolver } from './avatar.resolver';

const routes: Routes = [
  {
    path: '',
    component: AvatarPage,
    resolve: {
      data: AvatarResolver,
      title:TitleResolver
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
  declarations: [AvatarPage],
  providers: [
    AvatarResolver,
    TitleResolver
  ]
})
export class AvatarPageModule {}
