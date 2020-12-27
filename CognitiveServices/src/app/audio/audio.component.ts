import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AudioService } from "./audio.service";
import {
  ResultReason,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";

@Component({
  selector: "app-audio",
  templateUrl: "./audio.component.html",
  styleUrls: ["./audio.component.css"],
})
export class AudioComponent implements OnInit {
  loading: boolean = false;
  myForm = new FormGroup({
    file: new FormControl("", [Validators.required]),
    fileSource: new FormControl("", [Validators.required]),
  });
  selectedFile: File;
  showText: string;
  filename: string;
  speechProcessing: boolean = false;
  spokenText: string;

  recognizing: boolean = false;
  lastRecognized: string = "";
  recognizer: SpeechRecognizer;
  currentLanguage: string = "en-IN";
  @ViewChild("selectLanguage") selectLanguage: ElementRef;
  @ViewChild("targetLanguage") targetLanguage: ElementRef;
  languageList = [
    {
      value: "en-IN",
      text: "English (India)",
    },
    {
      value: "en-US",
      text: "English (United States)",
    },
    {
      value: "hi-IN",
      text: "Hindi (India)",
    },
    {
      value: "en-GB",
      text: "English (United Kingdom)",
    },
  ];

  targetLanguages = [
    {
      value: "en",
      text: "English",
    },
    {
      value: "hi",
      text: "Hindi",
    },
    {
      value: "pa",
      text: "Punjabi",
    },
  ];

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {}

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFile = file;
      this.filename = file.name;
    }
  }

  onLanguageChange() {
    this.currentLanguage = this.selectLanguage.nativeElement.value;
  }

  submit() {
    this.loading = true;
    var subscription = this.audioService
      .submitFormData(this.selectedFile)
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

  speechRecognizing() {
    if (this.recognizing) {
      this.recognizeSpeechStop();
    } else {
      this.recognizing = true;
      this.recognizeSpeechStart();
    }
  }

  recognizeSpeechStart() {
    this.recognizer = this.audioService.initSpeechService(this.currentLanguage);
    this.recognizer.recognizing = this.recognizer.recognized = this.recognizerCallback.bind(
      this
    );
    this.recognizer.startContinuousRecognitionAsync();
  }

  recognizeSpeechStop() {
    this.recognizer.stopContinuousRecognitionAsync(
      this.stopRecognizerCallback.bind(this),

      (err) => {
        this.stopRecognizerCallback.bind(this);
        console.error(err);
      }
    );
  }

  recognizerCallback(s, e) {
    const reason = ResultReason[e.result.reason];

    if (reason == "RecognizingSpeech") {
      this.showText = this.lastRecognized + e.result.text;
    }
    if (reason == "RecognizedSpeech") {
      this.lastRecognized += e.result.text + "\r\n";
      this.showText = this.lastRecognized;
    }
    if (reason == "NoMatch") {
    }
  }

  stopRecognizerCallback() {
    this.recognizer.close();
    this.recognizer = null;
    this.recognizing = false;
  }

  translateSpeechToText() {
    let recognizer = this.audioService.initTranslateService(
      this.currentLanguage,
      this.targetLanguage.nativeElement.value
    );

    recognizer.recognizeOnceAsync((evt) => {
      if (evt.reason == ResultReason.TranslatedSpeech) {
        this.spokenText = evt.text;
        this.showText = evt.translations.get(
          this.targetLanguage.nativeElement.value
        );
        recognizer.close();
      }
      if (evt.reason == ResultReason.NoMatch) {
        recognizer.close();
      }
    });
  }

  reset() {
    this.showText = "";
    this.lastRecognized = "";
    this.spokenText = "";
  }
}
