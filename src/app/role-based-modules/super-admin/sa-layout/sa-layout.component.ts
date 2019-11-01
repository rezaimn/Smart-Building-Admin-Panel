import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sa-layout',
  templateUrl: './sa-layout.component.html',
  styleUrls: ['./sa-layout.component.scss']
})

export class SaLayoutComponent implements OnInit {

  public loadURL: string;

  constructor() { }

  ngOnInit() {
    this.loadURL = "../../assets/images/loader/bg_img_10.png";
  }

}
