import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileService } from '../file/file.service';
import { ConvertJsonToCsvService } from '../Services/convertJsonToCsv.service';

@Component({
  selector: 'app-custommodel',
  templateUrl: './custommodel.component.html',
  styleUrls: ['./custommodel.component.css']
})
export class CustommodelComponent implements OnInit {
  loading: boolean = false;
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
    filePassword: new FormControl('', [Validators.required])
  });
  selectedFile: FileList;
  showText: object;
  jsonResult: object;
  filename = '';
  fileTypeSelected: string = 'pdf';
  isTypePdf = null;
  @ViewChild('urlInput') urlInput: ElementRef;
  @ViewChild('selectFileType') selectFileType: ElementRef;
  @ViewChild('responseTypeSelect') responseTypeSelect: ElementRef;
  fileTypeList = [
    {
      value: 'pdf',
      text: 'PDF'
    },
    {
      value: 'png',
      text: 'PNG'
    },
    {
      value: 'jpeg',
      text: 'JPG/JPEG'
    },
    {
      value: 'tiff',
      text: 'TIFF'
    }];

  responseTypeList = [
    {
      value: 'text',
      text: 'Get file text in reponse'
    },
    {
      value: 'json',
      text: 'Get raw JSON response'
    }
  ];

  constructor(private fileService: FileService, private appService: ConvertJsonToCsvService) { }

  exportToCsv() {
    if ( this.jsonResult !== null) {
      this.appService.downloadCSVFile(this.jsonResult, 'dataextraction');
    }
  }
  ngOnInit(): void {
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file  = event.target.files;
      this.selectedFile = file;

      for (const element of file) {
        this.filename += element.name + ', ';
      }
    }
  }

  onFileTypeChange() {
    this.fileTypeSelected = this.selectFileType.nativeElement.value;
    this.isTypePdf = this.fileTypeSelected !== 'pdf';
  }

  submit() {
    this.loading = true;
    const subscription = this.fileService
      .submitCustomModelFormData(this.selectedFile, this.myForm.value.filePassword,
                                  this.fileTypeSelected,
                                  'text')
      .subscribe(
        (res) => {
          this.jsonResult = res;
          this.showText = res;
          this.exportToCsv();
          subscription.unsubscribe();
          this.myForm.reset();
          this.selectedFile = null;
          this.filename = '';
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
    this.showText = null;
    this.jsonResult = null;
  }

}
