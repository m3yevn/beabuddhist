import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { ProfileResolver, UidResolver,CourseResolver,RoutineResolver } from './profile.resolver';


const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    resolve: {
      profileData: ProfileResolver,
      routineData: RoutineResolver,
      courseData: CourseResolver,
      uidData: UidResolver
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
  declarations: [ProfilePage],
  providers:[
    ProfileResolver,
    RoutineResolver,
    CourseResolver,
    UidResolver
  ]
})
export class ProfilePageModule {}
