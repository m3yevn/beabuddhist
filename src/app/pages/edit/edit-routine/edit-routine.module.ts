import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule} from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditRoutinePage } from './edit-routine.page';
import { EditRoutineResolver } from './edit-routine.resolver';

const routes: Routes = [
  {
    path: '',
    component: EditRoutinePage,
    resolve: {
      data: EditRoutineResolver
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
  declarations: [EditRoutinePage],
  providers:[EditRoutineResolver]
})
export class EditRoutinePageModule {}
