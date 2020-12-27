import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { domain } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor(private http: HttpClient) { }

  getTranslation(data: string, targetLanguage: string) {
    let request = {
      text: data,
      language: targetLanguage
    }
    return this.http.post(`${domain}/api/text/translate`, request)
  }
}
