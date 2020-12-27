import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { domain, CUSTOMMODEL_CONFIG } from '../../environments/environment';

@Injectable()
export class FileService {

  constructor(private http: HttpClient) { }

  submitFormData(requestFile: File, filePassword: string, fileType: string, resultType: string = "text") {
    let fd = new FormData();
    fd.append("file", requestFile, requestFile.name);
    fd.append("fileType", fileType);
    fd.append("filePassword", filePassword);
    fd.append("resultType", resultType);
    return this.http.post(`${domain}/api/form/analyze/local`, fd);
  }

  submit(
    requestFile: string, resultType: string = "text"
  ) {
    let data = {
      file: requestFile,
      resultType
    };

    return this.http.post(
      `${domain}/api/form/analyze`,
      data
    );
  }

  submitCustomModelFormData(requestFile: FileList, filePassword: string, fileType: string, resultType: string = 'text') {
    const fd = new FormData();
    for (let i = 0; i < requestFile.length; i++ ) {
      fd.append('file', requestFile[i]);
    }

    fd.append('fileType', fileType);
    fd.append('filePassword', filePassword);
    fd.append('resultType', resultType);
    fd.append('modelid', CUSTOMMODEL_CONFIG.MODEL_ID);
    return this.http.post(`${domain}/api/form/custommodel/local`, fd);
  }

  submitCustomModel(requestFile: string, resultType: string = 'text') {
    const data = {
      file: requestFile,
      resultType
    };

    return this.http.post(
      `${domain}/api/form/custommodel`,
      data
    );
  }
}
