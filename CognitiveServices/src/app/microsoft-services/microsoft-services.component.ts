import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-microsoft-services',
  templateUrl: './microsoft-services.component.html',
  styleUrls: ['./microsoft-services.component.css']
})
export class MicrosoftServicesComponent implements OnInit {
  activeTab = "image";

  search(activeTab) {
    this.activeTab = activeTab;
  }

  result(activeTab) {
    this.activeTab = activeTab;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
