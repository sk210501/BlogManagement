import { Component } from '@angular/core';
import { BlogService } from '../../service/blog-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { Blog } from 'src/app/model/blog.model';

@Component({
  selector: 'app-admin-create-blog',
  templateUrl: './admin-create-blog.component.html',
  styleUrls: ['./admin-create-blog.component.css']
})
export class AdminCreateBlogComponent {
  category: number = 0;
  getCategoryList: any;
  postTitle: string = '';
  postContent: string = '';
  postImage: string = '';
  postId: string = '';
  isEditMode: boolean = false;
  createDate: string = '';
 
  constructor(
    private blogService: BlogService,
    private router: Router,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute
  ) {
    this.getCategoryList = this.blogService.getCategoryList();
    this.activateRoute.queryParams.subscribe((res: any) => {
      console.log('>>>>', res);
      if (res && res?.id) {
        this.postId = res?.id;
        console.log('###'+ this.postId);
        this.isEditMode = true;
        this.getPostDetailById();
      }
    });
  }

  createBlog(): void {
    const body: any = {
      postTitle: this.postTitle,
      postContent: this.postContent,
      postImage: this.postImage,
      category: this.category,
      postCreation: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      postUpdation: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      user: JSON.parse(this.blogService.getLoggedInUserInformation())
    }
    console.log('>>>>>>>>>>>>>', body)
    if (!this.isEditMode) {
      this.blogService.createBlog(body).pipe(take(1)).subscribe((res: any) => {
        if (res && res?.status && res?.status === 'success') {
          alert('Blog Added successfully');
          this.router.navigate(['/admin/blog-list'])
        }
      });
    } else {
        this.blogService.updateBlog(body, this.postId, 1).pipe(take(1)).subscribe((res: any) => {
          if (res && res?.status && res?.status === 'success') {
            alert('Blog Updated successfully');
            this.router.navigate(['/admin/blog-list'])
          }
        });
    }
  }

  getPostDetailById(): void {
    this.blogService.getBlogById(this.postId).pipe(take(1)).subscribe((res: any) => {
      console.log('###', res);
      if (res && res?.postId) {
        this.postTitle = res?.postTitle;
        this.postContent = res?.postContent;
        this.postImage = res?.postImage;
        this.category = this.blogService.getCategoryList().find((cate: any) => cate?.name.toString() === res?.category)?.value;
      }
    });
  }
}
