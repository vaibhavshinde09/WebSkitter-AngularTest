import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowProductComponent } from './show-product/show-product.component';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  // {
  //     path: '',
  //     component: ShowProductComponent,
  //     pathMatch: 'full'
  // },
   {
    path: 'show-product',
    component: ShowProductComponent,
    pathMatch: 'full'
  },
  {
    path: 'add-product', 
    component:AddProductComponent
  },
  {
    path: 'edit-product/:id', 
    component:AddProductComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [AddProductComponent, ShowProductComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
  
})
export class UserModule { }
