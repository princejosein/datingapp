import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import Member from 'src/app/_models/Member';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editProfile:NgForm;
  member:Member;
  user:User;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any)
  {
    if(this.editProfile.dirty)
    {
      $event.returnValue = true;
    }
  }

  constructor(private accountService:AccountService, private memberService: MemberService,
      private toastrService:ToastrService) {
    accountService.currentUser$.pipe(take(1)).subscribe( user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember()
  {
    this.memberService.getMember(this.user.username).subscribe( member => this.member = member);
  }

  saveChanges()
  {
    console.log(this.member);
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastrService.success("Profile updated");
      this.editProfile.reset(this.member);
    });
  }

}
