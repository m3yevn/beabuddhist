import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule} from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewRoutinePage } from './view-routine.page';
import { ViewRoutineResolver, TasksResolver } from './view-routine.resolver';

const routes: Routes = [
  {
    path: '',
    component: ViewRoutinePage,
    resolve: {
      routineData: ViewRoutineResolver,
      taskData: TasksResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewRoutinePage],
  providers:[ViewRoutineResolver,TasksResolver]
})
export class ViewRoutinePageModule {}
