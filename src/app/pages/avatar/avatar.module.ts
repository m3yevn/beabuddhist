import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarPage } from './avatar.page';
import { AvatarResolver,TitleResolver, CurrentAvatarResolver } from './avatar.resolver';

const routes: Routes = [
  {
    path: '',
    component: AvatarPage,
    resolve: {
      data: AvatarResolver,
      title:TitleResolver,
      currentAvatar: CurrentAvatarResolver,
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
    TitleResolver,
    CurrentAvatarResolver,
  ]
})
export class AvatarPageModule {}
