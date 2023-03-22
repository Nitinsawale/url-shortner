import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlCreatorComponent } from './url-creator/url-creator.component';

const routes: Routes = [
  {
    path:"",
    component:UrlCreatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UrlShortnerRoutingModule { }
