import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Webhook } from '../interface/webhook.interface';
import { FirebaseService } from './firebase.service';
import bodyParser = require('body-parser');  //  bodyParser
import { LinebotsConst } from '../const/common.const';

@Injectable()
export class LinebotsService {
    private readonly webhooks: Webhook[] = [];
    constructor(
        private readonly firebaseService: FirebaseService
    ){};

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
        text: LinebotsConst.LineBotMessage.NOT_FOUND_PICUTURE
        }; 

        // webhookから受信した内容を標準出力に表示
        console.log('destination: ' + webhook.destination);

        // ユーザーアクティブチェック(Firebase更新)
        this.firebaseService.userActiveCheck(webhook);

        if (webhook.events[0] !== undefined) {
            for (let n = 0; n < webhook.events.length; n++) {

                //message-typeならreply送信
                if (webhook.events[n].type === 'message'){

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
                                    {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url,permalink','limit':'5','user_id':process.env.INSTA_USER_ID},
                                    function(response) {
                                        
                                        if (response.data !== undefined) {
                                            var image_carousel = {type: 'template', altText: webhook.events[n].message.text + 'の写真をお送りします！'};
                                            var template = {"type": "image_carousel"};
                                            var columns = [];

                                            //画像カルーセルで表示
                                            response.data.forEach(data => {
                                                var columns_elements = {imageUrl: data.media_url}
                                                var action ={type: 'uri', label: 'Like:' + data.like_count, uri: data.permalink}
                                                columns_elements['action'] = action
                                                columns.push(columns_elements);
                                            })

                                            template['columns']=columns
                                            image_carousel['template']=template

                                            const wikimessage = {
                                                type: 'text',
                                                text: 'https://ja.wikipedia.org/wiki/' + webhook.events[n].message.text
                                            };
                                            
                                            const instamessage = {
                                                type: 'text',
                                                text: 'Instagramでは他にも写真があるので是非見て下さい！\n https://www.instagram.com/explore/tags/' + LinebotsConst.LineBotMessage.HASHTAG_PREFIX + webhook.events[n].message.text + '/',
                                            };

                                            //Linebotsに返信
                                            client.replyMessage(webhook.events[n].replyToken, [image_carousel, wikimessage, instamessage])
                                            .then(() => {
                                                console.log(LinebotsConst.LineBotMessage.SEND_SUCCESS_LOG_MESSAGE + '[ type: reply, result: HashTag Search]');
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                        }
                                    }
                                );
                            } else {

                                const instamessage = {
                                    type: 'text',
                                    text: 'Instagramでは他にも写真があるので是非見て下さい！\n https://www.instagram.com/explore/tags/' + LinebotsConst.LineBotMessage.HASHTAG_PREFIX + webhook.events[n].message.text + '/',
                                };

                                client.replyMessage(webhook.events[n].replyToken, [message, instamessage])
                                .then(() => {
                                    console.log(LinebotsConst.LineBotMessage.SEND_SUCCESS_LOG_MESSAGE + '[ type: reply, result: Not Found KEYWORD]');
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            }
                        }
                    );
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

    lineBroadcast() { 

        //Firebaseに接続する    
        var admin = require('firebase-admin');
        let db = admin.firestore();

        // LINE BroadCastメッセージ作成
        const FB = require('fb');
        const line = require('@line/bot-sdk');
        const client = new line.Client({
        channelAccessToken: process.env.ACCESS_TOKEN
        }); 

        //FB.api - 最新の投稿を表示
        FB.api(
            '/' + process.env.INSTA_USER_ID + '/media',
            'GET',
            {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url,permalink','limit':'10','user_id':process.env.INSTA_USER_ID},
            function(response) {
                if (response.data !== undefined) {

                    var image_carousel = {type: 'template', altText: '@vertrek_kyotoに新しい写真が投稿されました！'};
                    var template = {"type": "image_carousel"};
                    var columns = [];

                    //画像カルーセルで表示
                    response.data.forEach(data => {
                        var columns_elements = {imageUrl: data.media_url}
                        var action ={type: 'uri', label: 'Like:' + data.like_count, uri: data.permalink}
                        columns_elements['action'] = action
                        columns.push(columns_elements);
                    })

                    template['columns']=columns
                    image_carousel['template']=template

                    //Helloメッセージ
                    const message = {
                        type: 'text',
                        text: LinebotsConst.LineBotMessage.BROADCAST_MESSAGE
                    };
                                
                    client.broadcast([image_carousel, message], false)
                        .then(() => {
                            console.log(LinebotsConst.LineBotMessage.SEND_SUCCESS_LOG_MESSAGE + '[ type: broadcast, result: Post notice]');
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } 
            }
        );
    }
}
