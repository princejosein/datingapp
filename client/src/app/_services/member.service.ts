import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Member from '../_models/Member';


@Injectable({
  providedIn: 'root'
})
export class MemberService implements OnInit {
  baseUrl: string = "https://localhost:5001/api/";

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getMembers()
  }

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users')
  }

  getMember(username:string)
  {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
}
