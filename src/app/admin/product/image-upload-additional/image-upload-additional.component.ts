import {Component, EventEmitter, Input, OnInit, Output,OnChanges} from '@angular/core';
import { ImageUploadPreviewService } from "../../../shared/components/image-upload-preview/image-upload-preview.service";
import { S3UploaderService } from "../../../shared/services/s3-upload/s3-upload.service";

import { HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-product-image-upload-additional',
  templateUrl: './image-upload-additional.component.html',
  styleUrls: ['./image-upload-additional.component.css']
})
export class ImageUploadAdditionalComponent implements OnInit {

  @Input() previewImgFile: any[] = new Array(5);
  @Output() previewImgFileChange: EventEmitter<any[]> = new EventEmitter();

  @Input() previewImgSrcs: any[] = new Array(5);

  loading: any = [0,0,0,0,0];

  upload: boolean[] = [false,false,false,false,false];

  closeLoading: any = [true,true,true,true,true];

  closeAnimate: any = [false,false,false,false,false];

  constructor(
    public previewImageService: ImageUploadPreviewService,
    public s3UploaderService: S3UploaderService
  ) {

  }

  ngOnInit() {

  }

  ngOnChanges() {

  }

  previewPic(event, index) {
    if(!event.target.files[0]) {
      return;
    }
    let that = this;
    that.loading[index] = 0;
    that.closeLoading[index] = false;
    that.closeAnimate[index] = false;

    this.previewImageService.readAsDataUrl(event.target.files[0]).then(function(result) {

      that.previewImgSrcs[index]=result;
      let file = event.target.files[0];

      let image = new Image();
      image.onload = function(){
        let width = image.width;
        let height = image.height;

        that.s3UploaderService.upload({
          type: 'COLLECTOR_PRODUCT_COVER',
          fileName: file.name,
          use: 'cover',
          width: width,
          height: height
        }).then((data) => {
          let src = data.url + '/' + data.key;

          that.s3UploaderService.uploadToS3(file, data).subscribe((event) => {
            // Via this API, you get access to the raw event stream.
            // Look for upload progress events.
            if (event.type === HttpEventType.UploadProgress) {
              // This is an upload progress event. Compute and show the % done:
              that.loading[index] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              that.previewImgFile[index] = src;
              that.previewImgFileChange.emit(that.previewImgFile);

            }
          });
        });
      };
      image.src = window.URL.createObjectURL(file);

      that.upload[index] = true;
    });

  }

  loadingChange(event, index) {
    if(event) {
      this.closeAnimate[index] = true;
      this.closeLoading[index] = true;
    }
  }


}
