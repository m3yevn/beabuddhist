import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarPage } from './avatar-routine.page';
import { AvatarResolver } from './avatar-routine.resolver';

const routes: Routes = [
  {
    path: '',
    component: AvatarPage,
    resolve: {
      avatarData: AvatarResolver,
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
  ]
})
export class AvatarPageModule {}
