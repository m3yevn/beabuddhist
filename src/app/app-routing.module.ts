import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'browse/:option/:avatar/:title/:description/:tasks', loadChildren: './pages/browse/browse.module#BrowsePageModule' },
  { path: 'avatar-routine/:avatar/:title/:description/:tasks', loadChildren: './pages/avatar-routine/avatar-routine.module#AvatarPageModule' },
  { path: 'packages/:id/:option/:avatar/:title/:description/:tasks', loadChildren: './pages/packages/packages.module#PackagesPageModule' },
  { path: 'create-routine/:avatar/:title/:description/:tasks', loadChildren: './create/create-routine/create-routine.module#CreateRoutinePageModule' },
  { path: 'edit-routine/:avatar/:title/:description/:tasks', loadChildren: './edit/edit-routine/edit-routine.module#EditRoutinePageModule' },
  { path: 'intro', loadChildren: './pages/intro/intro.module#IntroPageModule' },
  { path: 'view-routine/:avatar/:title/:description/:tasks', loadChildren: './view/view-routine/view-routine.module#ViewRoutinePageModule' },
  { path: 'view-package/:cat/:id/:option/:avatar/:title/:description/:tasks', loadChildren: './view/view-package/view-package.module#ViewPackagePageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
