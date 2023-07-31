import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {

  public constructor(private readonly userService: UsersService) {}

  // Here we are storing the information of the user whose call got connected to his/her manager and then
  //he/she should be able to interact/talk with the manager

  private async getRecordingSid(callSid: string) {
    try {
      const twilioBaseUrl = 'https://api.twilio.com';
      const accountSid = process.env.ACCOUNT_SID;
      const authToken = process.env.ACCOUNT_TOKEN;
      const axios = require('axios');
      const response = await axios.get(
        `${twilioBaseUrl}/2010-04-01/Accounts/${accountSid}/Calls/${callSid}.json`,
        {
          auth: {
            username: accountSid,
            password: authToken,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error('Error fetching recording SID:', error.message);
      return null;
    }
  }

  // Here we are storing the information of the user who is leaving a voice mail for his/her manager.

  async getRecordingData(callSid: string, flag: boolean){
    const axios = require('axios');

    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.ACCOUNT_TOKEN;
    
    // Replace with the call SID you want to access the recording for
    //const callSid = 'CA68710791abd74b4b1ec954761b0dfe33';

    if (!flag) {

      let JSONData = await this.getRecordingSid(callSid);
      let user_data: User = JSONData as User;
      user_data.call_sid = JSONData["sid"];
      user_data.media_url = "N/A";

      this.userService.create(user_data);

      return;

    }
    
    // Twilio API base URL
    const twilioBaseUrl = 'https://api.twilio.com';
    
    // Get the list of recordings for the call and extract the first recording SID
    axios.get(`${twilioBaseUrl}/2010-04-01/Accounts/${accountSid}/Calls/${callSid}/Recordings.json`, {
      auth: {
        username: accountSid,
        password: authToken,
      },
    })
      .then((response) => {

        if(response.data.recordings[0]) {}
        const recordingSid = response.data.recordings[0].sid;
    
        // Get the details of the specific recording using its SID
        return axios.get(`${twilioBaseUrl}/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.json`, {
          auth: {
            username: accountSid,
            password: authToken,
          },
        });
      })
      .then((recordingResponse) => {
        
        const recordingUrl = recordingResponse.data.uri;
    
        // Print the recording URL
        console.log(`Recording URL: ${recordingUrl}`);
    
        // Send request to recording URL and console out the data
        axios.get("https://api.twilio.com/" + recordingUrl)
          .then((recordingDataResponse) => {
            console.log('Recording Data:', recordingDataResponse.data);

            let user_data: User = recordingDataResponse.data as User;

            this.userService.create(user_data);
          })
          .catch((error) => {
            console.error('Error fetching recording data:', error.message);
          });
      })
      .catch((error) => {
        console.error('Error:', error.message);
        // Handle the error
      });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
