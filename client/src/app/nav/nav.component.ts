import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}

  constructor(public accountService:AccountService, private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {

  }

  login(){
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
      console.log(response);
      this.toastrService.success("Login Successfully", "Success");
    });
    // console.log(this.model);
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toastrService.success("Loggedout Successfully", "Success");
  }

  // getCurrentUser()
  // {
  //   this.accountService.currentUser$.subscribe(user => {
  //     this.loggedIn = !!user;
  //   }, error => {
  //     console.log(error);
  //   })
  // }

}
