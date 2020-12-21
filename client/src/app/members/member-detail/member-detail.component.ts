import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Member from 'src/app/_models/Member';
import { MemberService } from 'src/app/_services/member.service';

import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  member:Member;

  constructor(private memberService:MemberService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
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

  loadMember()
  {
    this.memberService.getMember(this.route.snapshot.paramMap.get("username")).subscribe(member => 
      {
        this.member = member
        this.galleryImages = this.loadImages()
      }

    );
  }

}
