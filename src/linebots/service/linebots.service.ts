import { Request, response } from 'express';
import { Injectable } from '@nestjs/common';
import { Webhook } from '../interface/webhook.interface';
import { Fbapi } from '../interface/fbapi.interface';
import { FirebaseService } from './firebase.service';
import { InstagramService } from './instagram.service';
import { LinebotsConst } from '../const/common.const';
import bodyParser = require('body-parser');  //  bodyParser
let Twitter = require('twitter');


@Injectable()
export class LinebotsService {
    private readonly webhooks: Webhook[] = [];
    
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly instagramService: InstagramService,
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
    }

    async reply(webhook: Webhook) {

        // Replyメッセージ作成
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

        for (let n = 0; n < webhook.events.length; n++) {

            //message-typeならreply送信
            if (webhook.events[n].type === 'message'){

                // ハッシュタグサーチ開始
                const hashtagSearch: Promise<string> = this.instagramService.hashtagSearch(webhook.events[n].message.text)
                hashtagSearch.then(hashtagId => {

                    const topMediaByHashtagId: Promise<Fbapi[]> =  this.instagramService.topMediaByHashtagId(hashtagId)
                    topMediaByHashtagId.then(response => {

                        if (response !== undefined) {
                            let image_carousel = {type: 'template', altText: webhook.events[n].message.text + 'の写真をお送りします！'};
                            let template = {"type": "image_carousel"};
                            let columns = [];
        
                            //画像カルーセルで表示
                            response.forEach(data => {
                                let columns_elements = {imageUrl: data.media_url}
                                let action ={type: 'uri', label: data.like_count + 'Likes!' , uri: data.permalink}
                                columns_elements['action'] = action
                                columns.push(columns_elements);
                            })

                            template['columns']=columns
                            image_carousel['template']=template
        
                            const wikimessage = {
                                type: 'text',
                                text: LinebotsConst.LineBotMessage.WIKIPEDIA_URL + webhook.events[n].message.text
                            };
                            
                            const instamessage = {
                                type: 'text',
                                text:  LinebotsConst.LineBotMessage.INSTAGRAM_INFOMATION_MESSAGE + '\n' + LinebotsConst.LineBotMessage.INSTAGRAM_HASHSEARCH_URL + LinebotsConst.LineBotMessage.HASHTAG_PREFIX + webhook.events[n].message.text + '/',
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
                    })

                }).catch(notFoundMessage => {

                    console.log(notFoundMessage)
                    const instamessage = {
                        type: 'text',
                        text: LinebotsConst.LineBotMessage.INSTAGRAM_INFOMATION_MESSAGE + '\n' + LinebotsConst.LineBotMessage.INSTAGRAM_HASHSEARCH_URL + LinebotsConst.LineBotMessage.HASHTAG_PREFIX + webhook.events[n].message.text + '/',
                    };

                    client.replyMessage(webhook.events[n].replyToken, [message, instamessage])
                    .then(() => {
                        console.log(LinebotsConst.LineBotMessage.SEND_SUCCESS_LOG_MESSAGE + '[ type: reply, result: Not Found KEYWORD]');
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                })
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

    lineBroadcast() { 

        // LINE BroadCastメッセージ作成
        const line = require('@line/bot-sdk');
        const client = new line.Client({
        channelAccessToken: process.env.ACCESS_TOKEN
        }); 

        //FB.api - 最新の投稿を表示
        const topMediaByUserId: Promise<Fbapi[]> =  this.instagramService.topMediaByUserId()
        topMediaByUserId.then(response => {
            if (response !== undefined) {

                let image_carousel = {type: 'template', altText: LinebotsConst.LineBotMessage.NEW_POST_MESSAGE};
                let template = {"type": "image_carousel"};
                let columns = [];

                //Twitterに投稿
                this.TwitterPost(response[0].media_url, response[0].permalink)

                //画像カルーセルで表示
                response.forEach(data => {
                    let columns_elements = {imageUrl: data.media_url}
                    let action ={type: 'uri', label: data.like_count + 'Likes!', uri: data.permalink}
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
        })        
    }

    TwitterPost(media_url: string, url: string) {

        const text = LinebotsConst.TwitterParams.TWEET_TEXT + '\n' + url + '\n\n' + process.env.TWITTER_HASHTAG
        const client = new Twitter({
            consumer_key        : process.env.TWITTER_CONSUMER_KEY,
            consumer_secret     : process.env.TWITTER_CONSUMER_KEY_SECRET,
            access_token_key    : process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        async function getMedia() {
            let request = require('request')
            request(
                {method: 'GET', url: media_url, encoding: null}, function (error, response, body){
                    if(!error && response.statusCode === 200){
                        var data = new Uint8Array(require('fs').readFileSync(body))
                        console.log(data)
                        return data
                    }
                }
            )
        }

        getMedia()
        .then(data => {
            (async () => {
                //画像のアップロード
                const media = await client.post('media/upload', {media: data})
                console.log(media);
                
               //Twitterに投稿
                const status = {
                status: text,
                   media_ids: media.media_id_string // Pass the media id string
                }
                const response = await client.post('statuses/update', status)
                    console.log(response);
            })();
        })
        .catch(err => {
            console.log(err);
        });
    }    
}
