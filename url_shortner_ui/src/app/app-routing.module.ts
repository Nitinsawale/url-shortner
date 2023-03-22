import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    redirectTo:"url-creator",
    pathMatch:'full'
  },
  {
    "path":"url-creator",
    loadChildren: () => import('./url-shortner/url-shortner.module').then(m => m.UrlShortnerModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
