import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UrlShortnerRoutingModule } from './url-shortner-routing.module';
import { UrlCreatorComponent } from './url-creator/url-creator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';


@NgModule({
  declarations: [
    UrlCreatorComponent
  ],
  imports: [
    CommonModule,
    UrlShortnerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule
  ]
})
export class UrlShortnerModule { }
