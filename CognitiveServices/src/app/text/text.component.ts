import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TextService } from './text.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {

  loading: boolean = false;
  myForm = new FormGroup({
    sourceText: new FormControl("", [Validators.required]),
    targetLanguage: new FormControl("", [Validators.required]),
  });
  selectedLanguage = "en";
  showText: string = "";
  resultObject = null;
  targetLanguages = [
    {
      value: "en",
      text: "English"
    },
    {
      value: "hi",
      text: "Hindi"
    },
    {
      value: "pa",
      text: "Punjabi"
    }
  ]

  constructor(private textService: TextService) { }

  ngOnInit(): void {
  }

  submit() {
    this.loading = true;
    var subscription = this.textService.getTranslation(this.myForm.value.sourceText, this.selectedLanguage)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.resultObject = res.data;

          } else {
            this.showText = res.userMessage;
          }
          this.loading = false;
          subscription.unsubscribe();
        },
        (err: any) => {
          console.log(err);
          this.loading = false;
          subscription.unsubscribe();
        });
  }

  reset() {
    this.showText = "";
    this.resultObject = null;
  }

  getLanguageName() {
    return this.targetLanguages.find(x => x.value == this.selectedLanguage).text;
  }

}
