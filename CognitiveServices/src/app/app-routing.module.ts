import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MicrosoftServicesComponent } from './microsoft-services/microsoft-services.component';
import { FileComponent } from './file/file.component';
import { CustommodelComponent } from './custommodel/custommodel.component';


const routes: Routes = [
  { path: 'microsoftservices', component: MicrosoftServicesComponent },
  { path: 'formrecognizer', component: FileComponent },
  { path: 'custommodel', component: CustommodelComponent },
  { path: '', redirectTo: '/microsoftservices', pathMatch: 'full' },
  { path: '**', redirectTo: '/microsoftservices', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
