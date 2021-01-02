import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Message from '../_models/Message';
import { getPaginationHeaders, paginatedResult } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl: string = "https://localhost:5001/api/";

  constructor(private http:HttpClient) { }

  getMessages(pageNumber, pageSize, container)
  {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append("Container", container);

    return paginatedResult<Message[]>(this.baseUrl+'messages/', params, this.http);
  }

  getMessageThread(username:string)
  {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  sendMessage(username:string, content:string)
  {
    return this.http.post<Message>(this.baseUrl + 'messages',{recipientUsername:username, content});
  }

  deleteMessage(id:number)
  {
    return this.http.delete(this.baseUrl + 'messages/'+id);
  }
}
