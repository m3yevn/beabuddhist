import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { BannerResolver, RoutineResolver, CourseResolver } from './home.resolver';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
    resolve: {
      bannerdata: BannerResolver,
      routinedata: RoutineResolver,
      coursedata: CourseResolver
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
  declarations: [HomePage],
  providers: [
    BannerResolver,
    RoutineResolver,
    CourseResolver
  ]
})
export class HomePageModule {}
