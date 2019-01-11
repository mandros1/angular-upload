import { Component } from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  uploadUrl = 'https://jsonplaceholder.typicode.com/posts';  // URL to web api
  uploader = new FileUploader({url: this.uploadUrl});
  postList: any = [];
  csvData;

  fileToUpload: File = null;
  headers = new HttpHeaders({
    'Content-Type': 'application/vnd.ms-excel',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.uploader.onCompleteItem = (item , response, status, headers) => {
      this.postList.push(JSON.parse(response));
    };
  }

  uploadFile(fileAsStream) {
    const url = this.uploadUrl;
    console.log(`Upload => ${fileAsStream}`);
    console.log(this.csvData);
    return this.http.post(url, this.csvData, {headers: this.headers, responseType: 'blob' as 'json'});
  }

  handleFileInput(files: FileList) {
    this.changeListener(files);
    this.fileToUpload = files.item(0);
    this.uploadFile(this.fileToUpload).subscribe(
        data => {
          console.log(`Success -> ${this.fileToUpload.name} and ${this.fileToUpload.type} = ${this.fileToUpload.slice()}`);
        },
        err => {
          console.log('Error');
        }
    );
  }

  public changeListener(files: FileList) {
    console.log(files);
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.csvData = reader.result;
      };
    }
  }
}
