import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import Member from '../_models/Member';
import { PaginatedResult } from '../_models/Pagination';
import { User } from '../_models/User';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';
import { getPaginationHeaders, paginatedResult } from './PaginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MemberService implements OnInit {
  baseUrl: string = "https://localhost:5001/api/";

  members:Member[] = [];
  memberCache = new Map();
  user:User;
  userParams:UserParams;

  constructor(private http:HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe( user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  ngOnInit(): void {

  }

  getUserParams() {
      return this.userParams;
  }

  setUserParams(params:UserParams)
  {
    this.userParams = params;
  }

  resetUserParams()
  {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams:UserParams) {

    var response = this.memberCache.get(Object.values(userParams).join("-"));
    if(response)
    {
      return of(response);
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append("minAge", userParams.minAge.toString());
    params = params.append("maxAge", userParams.maxAge.toString());
    params = params.append("gender", userParams.gender);
    params = params.append("orderBy", userParams.orderBy);


    return paginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join("-"), response);
        return response;
      }));
  }



  getMember(username:string)
  {
    // const member = this.members.find(u => u.username === username);
    // if(member !== undefined)return of(member);
    const member = [...this.memberCache.values()]
      .reduce((arr, element) => arr.concat(element.result),[])
      .find((member:Member) => member.username === username);
    if(member)
    {
      return of(member);
    }
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

  setMainPhoto(photoId: number)
  {
    return this.http.put(this.baseUrl+"users/set-main-photo/"+photoId, {});
  }

  deletePhoto(photoId: number)
  {
    return this.http.delete(this.baseUrl + 'users/delete-photo/'+photoId,);
  }

  addLike(username:string)
  {
    return this.http.post(this.baseUrl + 'likes/'+username, {});
  }

  getLikes(predicate:string, pageNumber:number, pageSize:number)
  {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return paginatedResult<Partial<Member[]>>(this.baseUrl+'likes/', params, this.http);
  }
}
