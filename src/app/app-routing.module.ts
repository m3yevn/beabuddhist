import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'avatar/:id', loadChildren: './pages/avatar/avatar.module#AvatarPageModule' },
  { path: 'packages/:id', loadChildren: './pages/packages/packages.module#PackagesPageModule' },
  { path: 'create-routine', loadChildren: './create/create-routine/create-routine.module#CreateRoutinePageModule' },
  { path: 'edit-routine/:id', loadChildren: './edit/edit-routine/edit-routine.module#EditRoutinePageModule' },
  { path: 'intro', loadChildren: './pages/intro/intro.module#IntroPageModule' },
  { path: 'view-routine/:id', loadChildren: './view/view-routine/view-routine.module#ViewRoutinePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
