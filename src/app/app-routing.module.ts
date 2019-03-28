import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'packages', loadChildren: './packages/packages.module#PackagesPageModule' },
  { path: 'create-routine', loadChildren: './create-routine/create-routine.module#CreateRoutinePageModule' },
  { path: 'edit-routine/:id', loadChildren: './edit-routine/edit-routine.module#EditRoutinePageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'view-routine/:id', loadChildren: './view-routine/view-routine.module#ViewRoutinePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
