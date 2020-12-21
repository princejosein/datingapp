import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import Member from '../_models/Member';


@Injectable({
  providedIn: 'root'
})
export class MemberService implements OnInit {
  baseUrl: string = "https://localhost:5001/api/";

  members:Member[] = [];

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getMembers()
  }

  getMembers() {
    if(this.members.length>0)return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  }

  getMember(username:string)
  {
    const member = this.members.find(u => u.username === username);
    if(member !== undefined)return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member:Member)
  {
    return this.http.put(this.baseUrl+"users/", member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
