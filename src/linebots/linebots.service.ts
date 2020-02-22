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
        return true;
    }

    reply(webhook: Webhook) {
        // Replyメッセージ作成
        const FB = require('fb');
        const line = require('@line/bot-sdk');
        const client = new line.Client({
        channelAccessToken: process.env.ACCESS_TOKEN
        });

        const message = {
        type: 'text',
        text: '...すみません、該当の写真はありませんでした。'
        }; 

        // webhookから受信した内容を標準出力に表示
        console.log('destination: ' + webhook.destination);

        if (webhook.events[0] !== undefined) {
            for (let n = 0; n < webhook.events.length; n++) {

                //message-typeならreply送信
                if (webhook.events[n].type === 'message'){

                    if (webhook.events[n].message.text === '今日の写真'){
                        //FB.api - 最新の投稿を表示
                        FB.api(
                            '/' + process.env.INSTA_USER_ID + '/media',
                            'GET',
                            {'access_token':process.env.INSTA_ACCESS_TOKEN,'limit':'1','user_id':process.env.INSTA_USER_ID},
                            function(response) {
                                if (response.data !== undefined) {
                                    //FB.api - 投稿情報取得
                                    FB.api(
                                        '/' + response.data[0].id ,
                                        'GET',
                                        {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url','user_id':process.env.INSTA_USER_ID},
                                        function(response) {
                                            if (response !== undefined) {
                                                //該当ハッシュタグの画像URl取得
                                                console.log(response)
                                                const imageurl = {
                                                    type: 'image',
                                                    originalContentUrl: response.media_url,
                                                    previewImageUrl: response.media_url
                                                }; 
    
                                                //Linebotsに返信
                                                client.replyMessage(webhook.events[n].replyToken, imageurl)
                                                    .then(() => {
                                                        
                                                    })
                                                    .catch((err) => {
                                                        // error handling
                                                    });
                                            }
                                        }
                                    );
                                } else {
                                    client.replyMessage(webhook.events[n].replyToken, message)
                                    .then(() => {
                                        
                                    })
                                    .catch((err) => {
                                        // error handling
                                    });
                                }
                            }
                        );

                    } else {
                        //FB.api - ハッシュタグサーチ
                        FB.api(
                            '/ig_hashtag_search',
                            'GET',
                            {'access_token':process.env.INSTA_ACCESS_TOKEN,'user_id':process.env.INSTA_USER_ID,'q':'vertrek' + webhook.events[n].message.text}, // + webhook.events[n].message.text},
                            function(response) {
                                if (response.data !== undefined) {
                                    //FB.api - 投稿情報取得
                                    FB.api(
                                        '/' + response.data[0].id + '/top_media',
                                        'GET',
                                        {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url','limit':'1','user_id':process.env.INSTA_USER_ID},
                                        function(response) {
                                            if (response.data !== undefined) {
                                                //該当ハッシュタグの画像URl取得
                                                console.log(response)
                                                const imageurl = {
                                                    type: 'image',
                                                    originalContentUrl: response.data[0].media_url,
                                                    previewImageUrl: response.data[0].media_url
                                                }; 
    
                                                //Linebotsに返信
                                                client.replyMessage(webhook.events[n].replyToken, imageurl)
                                                    .then(() => {
                                                        
                                                    })
                                                    .catch((err) => {
                                                        // error handling
                                                    });
                                            }
                                        }
                                    );
                                } else {
                                    client.replyMessage(webhook.events[n].replyToken, message)
                                    .then(() => {
                                        
                                    })
                                    .catch((err) => {
                                        // error handling
                                    });
                                }
                            }
                        );
                    }
                }

                //console.log出力（デバッグ解析用）
                console.log('replytoken: ' + webhook.events[n].replyToken);
                console.log('type: ' + webhook.events[n].type);
                console.log('mode: ' + webhook.events[n].mode);
                console.log('timestamp: ' + webhook.events[n].timestamp);
                if (webhook.events[n].source !== undefined) {
                    console.log('source/type: ' + webhook.events[n].source.type);
                    console.log('source/userId: ' + webhook.events[n].source.userId);    
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
