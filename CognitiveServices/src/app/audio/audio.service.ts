import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { domain } from "../../environments/environment";
import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
  TranslationRecognizer,
  SpeechTranslationConfig,
} from "microsoft-cognitiveservices-speech-sdk";
import { SPEECH_CONFIG } from "../../environments/environment";

@Injectable()
export class AudioService {
  constructor(private http: HttpClient) {}

  submitFormData(requestFile: File) {
    let fd = new FormData();
    fd.append("file", requestFile, requestFile.name);
    return this.http.post(`${domain}/api/audio/recognize`, fd);
  }

  initSpeechService(currentLanguage: string) {
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const speechConfig = SpeechConfig.fromSubscription(
      SPEECH_CONFIG.API_KEY,
      SPEECH_CONFIG.REGION
    );
    speechConfig.speechRecognitionLanguage = currentLanguage;
    speechConfig.enableDictation();
    return new SpeechRecognizer(speechConfig, audioConfig);
  }

  initTranslateService(sourceLanguage: string, targetLanguage: string) {
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const translateConfig = SpeechTranslationConfig.fromSubscription(
      SPEECH_CONFIG.API_KEY,
      SPEECH_CONFIG.REGION
    );
    translateConfig.speechRecognitionLanguage = sourceLanguage;
    translateConfig.addTargetLanguage(targetLanguage);
    translateConfig.enableDictation();
    return new TranslationRecognizer(translateConfig, audioConfig);
  }
}
