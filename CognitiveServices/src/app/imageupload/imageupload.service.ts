import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { domain } from "../../environments/environment";

var service = {
  ocr: "ocr",
  recognize: "recognize",
  batchanalyze: "batchAnalyze",
};

@Injectable()
export class ImageuploadService {
  constructor(private http: HttpClient) { }

  submitFormData(language: string, requestFile: File, selectedService: string, recognizeMode: string = "") {
    if (language == "hi") {
      return this.tesseractImageProcess(requestFile);
    } else {
      return this.cognitiveServieImageProcess(requestFile, selectedService, recognizeMode);
    }
  }

  submitForm(
    language: string,
    requestFile: string,
    selectedService: string,
    recognizeMode: string = ""
  ) {
    if (language == "hi") {
      return this.tesseractRemoteImageProcess(requestFile);
    } else {
      return this.cognitiveServiceRemoteImageProcess(requestFile, selectedService, recognizeMode)
    }
  }

  cognitiveServieImageProcess(
    requestFile: File,
    selectedService: string,
    recognizeMode: string = ""
  ) {
    let fd = new FormData();
    fd.append("file", requestFile, requestFile.name);
    fd.append("recognizeMode", recognizeMode);

    return this.http.post(
      `${domain}/api/image/${service[selectedService]}/local`,
      fd
    );
  }

  tesseractImageProcess(requestFile: File) {
    let fd = new FormData();
    fd.append("file", requestFile, requestFile.name);

    return this.http.post(
      `${domain}/api/ocr/hindi/imagelocal`,
      fd
    );
  }

  cognitiveServiceRemoteImageProcess(requestFile: string, selectedService: string, recognizeMode: string = "") {
    let data = {
      image: requestFile,
      recognizeMode,
    };

    return this.http.post(
      `${domain}/api/image/${service[selectedService]}`,
      data
    );
  }

  tesseractRemoteImageProcess(requestFile: string) {
    let data = {
      image: requestFile
    };

    return this.http.post(
      `${domain}/api/ocr/hindi/imageremote`,
      data
    );
  }

}




