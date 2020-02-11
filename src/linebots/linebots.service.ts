import { Injectable } from '@nestjs/common';
import { Webhook } from './webhook.interface';
import { Client, OAuth }  from '@line/bot-sdk';

@Injectable()
export class LinebotsService {
    private readonly webhooks: Webhook[] = [];
    private readonly line_client: Client[] = [];
    private readonly line_oauth: OAuth[] = [];

    reply(webhook: Webhook) {

        // webhookから受信した内容を標準出力に表示
        console.log('destination: ' + webhook.destination);

        if (webhook.events[0] !== undefined) {
            for (let n = 0; n < webhook.events.length; n++) {
                console.log('replytoken: ' + webhook.events[n].replyToken);
                console.log('type: ' + webhook.events[n].type);
                console.log('mode: ' + webhook.events[n].mode);
                console.log('timestamp: ' + webhook.events[n].timestamp);
                if (webhook.events[n].source !== undefined) {
                    console.log('source/type: ' + webhook.events[n].source.type);
                    console.log('source/userid: ' + webhook.events[n].source.userid);    
                }
                if (webhook.events[n].message !== undefined){
                    console.log('message/id: ' + webhook.events[n].message.id);
                    console.log('message/type: ' + webhook.events[n].message.type);
                    console.log('message/text: ' + webhook.events[n].message.text);    
                }
            }
        }
    }
}
