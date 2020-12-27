import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ImageuploadComponent } from "./imageupload/imageupload.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ImageuploadService } from "./imageupload/imageupload.service";
import { HttpClientModule } from "@angular/common/http";
import { AudioComponent } from "./audio/audio.component";
import { AudioService } from "./audio/audio.service";
import { FileComponent } from './file/file.component';
import { FileService } from './file/file.service';
import { TextComponent } from './text/text.component';
import { MicrosoftServicesComponent } from './microsoft-services/microsoft-services.component';
import { CustommodelComponent } from './custommodel/custommodel.component';
import { ConvertJsonToCsvService } from './Services/convertJsonToCsv.service';

@NgModule({
  declarations: [AppComponent, ImageuploadComponent, AudioComponent, FileComponent, TextComponent, MicrosoftServicesComponent, CustommodelComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [ImageuploadService, AudioService, FileService, ConvertJsonToCsvService],
  bootstrap: [AppComponent],
})
export class AppModule { }
