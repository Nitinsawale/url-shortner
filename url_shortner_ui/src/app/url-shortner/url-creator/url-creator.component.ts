import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { lastValueFrom } from 'rxjs'
@Component({
  selector: 'app-url-creator',
  templateUrl: './url-creator.component.html',
  styleUrls: ['./url-creator.component.css']
})
export class UrlCreatorComponent {


  urlCreationForm!: FormGroup;
  maxHits:string="-";
  totalURLs:string="-";
  is_resp:boolean = true;
  is_resp_success:boolean = true;
  new_url:string = "testing";


  constructor(private apiRequest:ApiRequestService)
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


  }


  async generateShortUrl()
  {

    if(this.urlCreationForm.invalid)
      return
    let data = this.urlCreationForm.value;
    let resp = await lastValueFrom(this.apiRequest.post(ConstantsService.ENDPOINT_URL + 'short-url', data));
    this.urlCreationForm.reset();
    this.is_resp = true;
    this.is_resp_success = true;
    this.new_url = resp['short url']
  }


  copyToClipboard()
  {
    //this.clipboard
  }
}
