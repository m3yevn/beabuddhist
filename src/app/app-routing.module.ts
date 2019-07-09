import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'avatar-routine', loadChildren: './pages/avatar-routine/avatar-routine.module#AvatarPageModule' },
  { path: 'packages/:id', loadChildren: './pages/packages/packages.module#PackagesPageModule' },
  { path: 'edit-routine', loadChildren: './edit/edit-routine/edit-routine.module#EditRoutinePageModule' },
  { path: 'intro', loadChildren: './pages/intro/intro.module#IntroPageModule' },
  { path: 'view-routine/:id', loadChildren: './view/view-routine/view-routine.module#ViewRoutinePageModule' },
  { path: 'view-package/:cat/:id', loadChildren: './view/view-package/view-package.module#ViewPackagePageModule' },
  { path: 'create-routine-simple', loadChildren: './create/create-routine-simple/create-routine-simple.module#CreateRoutineSimplePageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
