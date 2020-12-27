import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileService } from './file.service';
import { viewClassName } from '@angular/compiler';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  loading: boolean = false;
  myForm = new FormGroup({
    file: new FormControl("", [Validators.required]),
    fileSource: new FormControl("", [Validators.required]),
    filePassword: new FormControl("", [Validators.required])
  });
  selectedFile: File;
  showText: string;
  filename: string;
  fileTypeSelected: string = "pdf";
  @ViewChild('urlInput') urlInput: ElementRef;
  @ViewChild('selectFileType') selectFileType: ElementRef;
  @ViewChild('responseTypeSelect') responseTypeSelect: ElementRef;
  fileTypeList = [
    {
      value: "pdf",
      text: "PDF"
    },
    {
      value: "png",
      text: "PNG"
    },
    {
      value: "jpeg",
      text: "JPG/JPEG"
    },
    {
      value: "tiff",
      text: "TIFF"
    },
  ]

  responseTypeList = [
    {
      value: "text",
      text: "Get file text in reponse"
    },
    {
      value: "json",
      text: "Get raw JSON response"
    }
  ]

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFile = file;
      this.filename = file.name;
    }
  }

  onFileTypeChange() {
    this.fileTypeSelected = this.selectFileType.nativeElement.value;
  }

  submit() {
    this.loading = true;
    var subscription = this.fileService
      .submitFormData(this.selectedFile, this.myForm.value.filePassword, this.fileTypeSelected, this.responseTypeSelect.nativeElement.value)
      .subscribe(
        (res) => {
          this.showText = res ? res.toString() : "";
          subscription.unsubscribe();
          this.myForm.reset();
          this.selectedFile = null;
          this.filename = "";
          this.loading = false;
        },
        (err) => {
          console.log(err);
          subscription.unsubscribe();
          this.loading = false;
        }
      );
  }

  submitURL() {
    this.loading = true;
    var subscription = this.fileService
      .submit(this.urlInput.nativeElement.value, this.responseTypeSelect.nativeElement.value)
      .subscribe(
        (res) => {
          this.showText = res ? res.toString() : "";
          subscription.unsubscribe();
          this.urlInput.nativeElement.value = "";
          this.loading = false;
        },
        (err) => {
          console.log(err);
          subscription.unsubscribe();
          this.loading = false;
        }
      );
  }

  reset() {
    this.showText = "";
  }

}
