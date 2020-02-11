import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Webhook } from './webhook.interface';
import bodyParser = require('body-parser');  //  bodyParser

@Injectable()
export class LinebotsService {
    private readonly webhooks: Webhook[] = [];

    check(req: Request) {
        bodyParser.json();
        // X-Line-Signatureの検証
        const crypto = require('crypto');
        const channelSecret = process.env.SECRET_KEY; // Channel secret string
        const body = JSON.stringify(req.body); // Request body string
        const signature = crypto
            .createHmac('SHA256', channelSecret)
            .update(body).digest('base64');

        if(signature !== req.headers['x-line-signature']){
            return false;
        } else {
            return true;
        }
    }

    reply(webhook: Webhook) {

        // Replyメッセージ作成
        const line = require('@line/bot-sdk');
        const client = new line.Client({
        channelAccessToken: process.env.ACCESS_TOKEN
        });

        const message = {
        type: 'text',
        text: 'メッセージありがとうございます！ vertrek_kyotoのinstagram投稿から素敵な写真をお送りします！'
        };

        // webhookから受信した内容を標準出力に表示
        console.log('destination: ' + webhook.destination);

        if (webhook.events[0] !== undefined) {
            for (let n = 0; n < webhook.events.length; n++) {

                //message-typeならreply送信
                if (webhook.events[n].type === 'message'){
                    client.replyMessage(webhook.events[n].replyToken, message)
                        .then(() => {
                            
                        })
                        .catch((err) => {
                            // error handling
                        });
                }

                //console.log出力（デバッグ解析用）
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
