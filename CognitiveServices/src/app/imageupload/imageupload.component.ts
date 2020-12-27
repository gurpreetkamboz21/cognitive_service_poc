import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ImageuploadService } from "./imageupload.service";

@Component({
  selector: "app-imageupload",
  templateUrl: "./imageupload.component.html",
  styleUrls: ["./imageupload.component.css"],
})
export class ImageuploadComponent implements OnInit {
  loading: boolean = false;
  imageSrc: string;
  myForm = new FormGroup({
    file: new FormControl("", [Validators.required]),
    fileSource: new FormControl("", [Validators.required]),
  });
  showText: string;
  @ViewChild("urlInput") urlInput: ElementRef;
  @ViewChild("selectService") selectService: ElementRef;
  @ViewChild("selectRecognizeOption") recognizeMode: ElementRef;
  recognizeSelected: boolean = false;
  selectedFile: File;
  languageList = [
    {
      value: "en",
      text: "English"
    },
    {
      value: "hi",
      text: "Hindi"
    }
  ]
  selectedLanguage = "en";
  resultArray = [];

  constructor(private imageUploadService: ImageuploadService) { }

  ngOnInit(): void { }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.selectedFile = file;

      reader.onload = () => {
        this.imageSrc = reader.result as string;

        this.myForm.patchValue({
          fileSource: reader.result,
        });
      };
    }
  }

  submit() {
    this.loading = true;
    var subscription = this.imageUploadService
      .submitFormData(
        this.selectedLanguage,
        this.selectedFile,
        this.selectService ? this.selectService.nativeElement.value : "",
        this.recognizeMode ? this.recognizeMode.nativeElement.value : ""
      )
      .subscribe(
        (res: any) => {
          if (res.success) {
            if (typeof (res.data) == "string") {
              this.showText = res.data.toString();
            }
            else {
              this.resultArray = res.data;
            }

          } else {
            this.showText = res.userMessage;
          }
          subscription.unsubscribe();
          this.myForm.reset();
          this.imageSrc = "";
          this.loading = false;
        },
        (err) => {
          console.log(err["error"]);
          subscription.unsubscribe();
          this.loading = false;
        }
      );
  }

  submitURL() {
    this.loading = true;
    var subscription = this.imageUploadService
      .submitForm(
        this.selectedLanguage,
        this.urlInput ? this.urlInput.nativeElement.value : "",
        this.selectService ? this.selectService.nativeElement.value : "",
        this.recognizeMode ? this.recognizeMode.nativeElement.value : ""
      )
      .subscribe(
        (res: any) => {
          if (res.success) {
            if (typeof (res.data) == "string") {
              this.showText = res.data.toString();
            }
            else {
              this.resultArray = res.data;
            }

          } else {
            this.showText = res.userMessage;
          }
          subscription.unsubscribe();
          this.urlInput.nativeElement.value = "";
          this.loading = false;
        },
        (err) => {
          console.log(err["error"]);
          subscription.unsubscribe();
          this.loading = false;
        }
      );
  }

  reset() {
    this.showText = "";
    this.resultArray = [];
  }

  onServiceSelection() {
    if (this.selectService.nativeElement.value == "recognize") {
      this.recognizeSelected = true;
    } else {
      this.recognizeSelected = false;
    }
  }

  onLanguageChange(event: any) {
    this.selectedLanguage = event.target.value;
    this.recognizeSelected = false
  }
}
