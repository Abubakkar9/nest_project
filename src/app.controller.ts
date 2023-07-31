import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(): Promise<any> {
    return undefined
  }


  //callback to store dialed user information
  @Post("/dial-ivr")
  getDialResponse (@Req() req, @Body('CallSid') callSid: string, @Res() res) {

    this.appService.getRecordingData(callSid, false)
    console.log(callSid)
    res.sendStatus(200);
 }


 //callback to store dialed voice mail
  @Post("/voice-ivr")
  getVoiceResponse (@Req() req, @Body('CallSid') callSid: string, @Res() res) {

    this.appService.getRecordingData(callSid, true)
    res.sendStatus(200);
 }


 //entry point where the inbound call will be initiated
  @Post("/twilio-callback")
  redirect(@Res() res) {
    return res.redirect('https://voice-ivr-6954-xgyjf6.twil.io/voice-ivr');
  };
}

