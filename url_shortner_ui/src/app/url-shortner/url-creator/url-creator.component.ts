import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { lastValueFrom } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-url-creator',
  templateUrl: './url-creator.component.html',
  styleUrls: ['./url-creator.component.css']
})
export class UrlCreatorComponent {


  urlCreationForm!: FormGroup;
  searchQrForm!:FormGroup;
  maxHits:string="-";
  totalURLs:string="-";
  is_resp:boolean = false;
  is_resp_success:boolean = false;
  new_url:string = "testing";
  imageInBytes:any;
  searchedQr:any;



  constructor(private apiRequest:ApiRequestService, private sanitization:DomSanitizer)
  {

  }


  ngOnInit(){
    this.createUrlForm();
    this.getDashboardData()
  }


  async getDashboardData()
  {
    let url = ConstantsService.ENDPOINT_URL + 'get-dashboard-data';
    let respData = await lastValueFrom(this.apiRequest.get(url));
    this.maxHits = respData['maxHits']
    this.totalURLs = respData['totalUrls']
  }


  createUrlForm()
  {
    this.urlCreationForm = new FormGroup({
      long_url:new FormControl("",[Validators.required]),
      domain:new FormControl({value:"st.ly",disabled:true},[Validators.required]),
      back_half:new FormControl("", [])
  });

  this.searchQrForm = new FormGroup({
    "short_url":new FormControl("", [Validators.required])
  });


  }


  async generateShortUrl()
  {

    if(this.urlCreationForm.invalid)
      return
    let data = this.urlCreationForm.value;
    try
    {
      let resp = await lastValueFrom(this.apiRequest.post(ConstantsService.ENDPOINT_URL + 'short-url', data));
      this.urlCreationForm.reset();
      this.is_resp = true;
      this.is_resp_success = true;
      this.new_url = resp['short url']
      let imgcode = 'data:image/png;base64,' + resp["qr_image"];
      this.imageInBytes =  this.sanitization.bypassSecurityTrustUrl(imgcode);
    }
    catch(e:any)
    {
      if(e?.error.detail=='back half not available')
      {
          this.urlCreationForm.get("back_half")?.setErrors({"not_available":true});
      }
      else
      {
        this.is_resp = true;
        this.is_resp_success = false;
      }
    }



  }


  async searchQrCode()
  {
    if(this.searchQrForm.invalid)
      return

    let data = this.searchQrForm.value.short_url.split("/");
    let url_hash = data[data.length - 1]
    try
    {
      let resp = await lastValueFrom(this.apiRequest.get(ConstantsService.ENDPOINT_URL + 'search-qr/' + url_hash));
      let imgcode = 'data:image/png;base64,' + resp['qr_image'] ;
      this.searchedQr =  this.sanitization.bypassSecurityTrustUrl(imgcode);
    }
    catch(e:any){
      if(e.error.detail == "Invalid Url")
      {
        this.searchQrForm.get('short_url')?.setErrors({"invalid_url":true})
      }
    }

  }

}
