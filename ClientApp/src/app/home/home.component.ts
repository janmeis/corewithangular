import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message = '';

  constructor(@Inject('MESSAGE') message: string) {
    this.message = message;
  }

  ngOnInit(): void {
  }

}
