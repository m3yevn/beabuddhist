import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'avatar-routine', loadChildren: './pages/avatar-routine/avatar-routine.module#AvatarPageModule' },
  { path: 'packages/:id', loadChildren: './pages/packages/packages.module#PackagesPageModule' },
  { path: 'edit-routine', loadChildren: './pages/edit/edit-routine/edit-routine.module#EditRoutinePageModule' },
  { path: 'intro', loadChildren: './pages/intro/intro.module#IntroPageModule' },
  { path: 'view-routine/:id', loadChildren: './pages/view/view-routine/view-routine.module#ViewRoutinePageModule' },
  { path: 'view-package', loadChildren: './pages/view/view-package/view-package.module#ViewPackagePageModule' },
  { path: 'create-routine', loadChildren: './pages/create/create-routine/create-routine.module#CreateRoutinePageModule' },
  { path: 'courses', loadChildren: './pages/courses/courses.module#CoursesPageModule' },
  { path: 'profile/:uid', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'profile-settings', loadChildren: './pages/profile-settings/profile-settings.module#ProfileSettingsPageModule' },
  { path: 'edit-profile', loadChildren: './pages/edit/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'search-user', loadChildren: './pages/search/search-user/search-user.module#SearchUserPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
