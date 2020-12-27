import { Component, Input, OnInit } from '@angular/core';
import { FileUploader, FileSelectDirective  } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import Member from 'src/app/_models/Member';
import Photo from 'src/app/_models/Photo';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member:Member;

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  baseUrl: string = "https://localhost:5001/api/";
  response:string;
  user:User;

  constructor(private accountService:AccountService, private memberService:MemberService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e:any)
  {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader()
  {
    this.uploader = new FileUploader({
      url:this.baseUrl+"users/add-photo",
      authToken:"Bearer "+this.user.token,
      isHTML5:true,
      allowedFileType:["image"],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10*1024*1024

    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) =>
    {
      if(response)
      {
        const photo:Photo = JSON.parse(response);
        this.member.photos.push(photo);
        if(photo.isMain)
        {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }

  setMainPhotoClick(photo:Photo)
  {
    this.memberService.setMainPhoto(photo.id).subscribe( () => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        p.isMain ? p.isMain = false : "";
        p.id == photo.id ? p.isMain = true : "";
      });
    }
    );
  }

  deletePhoto(photo:Photo)
  {
    this.memberService.deletePhoto(photo.id).subscribe(() => {
      this.member.photos = this.member.photos.filter( x => x.id !== photo.id)
    })
  }

}
