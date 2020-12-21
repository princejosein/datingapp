import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private busyService:NgxSpinnerService) { }


  busy()
  {
    this.busyRequestCount++;
    this.busyService.show(undefined,{
      type:'pacman',
      bdColor:"rgba(255,255,255,1)",
      size:"medium",
      color:"#333333"
    })
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0)
    {
      this.busyRequestCount = 0;
      this.busyService.hide();
    }
  }
}
