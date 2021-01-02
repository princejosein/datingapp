import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Member from 'src/app/_models/Member';
import { MemberService } from 'src/app/_services/member.service';

import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MessageService } from 'src/app/_services/message.service';
import Message from 'src/app/_models/Message';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  @ViewChild("memberTabs", { static:true }) memberTabs: TabsetComponent;
  activeTab:TabDirective;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  member:Member;
  messages: Message[] = [];


  constructor(private memberService:MemberService, private route:ActivatedRoute,
      private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    })


    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent:100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false
      },
    ];

    this.galleryImages = this.loadImages()
  }

  loadImages():NgxGalleryImage[] {
    const galleryImages = [];
    this.member.photos.forEach(photo => {
      galleryImages.push({
        small:photo?.url,
        medium:photo?.url,
        big:photo?.url
      });
    });
    return galleryImages;
  }

  // loadMember()
  // {
  //   this.memberService.getMember(this.route.snapshot.paramMap.get("username")).subscribe(member =>
  //     {
  //       this.member = member
  //       this.galleryImages = this.loadImages()
  //     }

  //   );
  // }

  loadMessages()
  {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }

  onTabActivated(data:TabDirective)
  {
    this.activeTab = data;
    if(this.activeTab.heading === "Messages" && this.messages?.length === 0){
      this.loadMessages();
    }
  }

  selectTab(tabId:number)
  {
    this.memberTabs.tabs[tabId].active = true;
  }

}
