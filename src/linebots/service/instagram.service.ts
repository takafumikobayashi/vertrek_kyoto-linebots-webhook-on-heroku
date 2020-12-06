import { Injectable } from '@nestjs/common';
import { LinebotsConst } from '../const/common.const';
import { Fbapi } from '../interface/fbapi.interface';
import { ReplaySubject } from 'rxjs';
import { callbackify } from 'util';
let FB = require('fb')


@Injectable()
export class InstagramService {
    
    async hashtagSearch(hashtag: string): Promise<string> {
        
        return new Promise ((resolve, reject) => {
            // 受け取ったキーワードでhashtag Search
            FB.api(
                '/ig_hashtag_search',
                'GET',
                {'access_token':process.env.INSTA_ACCESS_TOKEN,'user_id':process.env.INSTA_USER_ID,'q':'vertrek' + hashtag},
                function (response) {
                    console.log('#### 1 ### hashtagId =' + response)
                    if (response.data !== undefined) {
                        resolve(response.data[0].id)
                    } else {
                        reject()
                    }
                }
            )
        })
    }

    topMediaByHashtagId(hashtagId: string): Fbapi[] {

        // ハッシュタグIDのTOP-Media取得
        return FB.api(
            '/' + hashtagId + '/top_media',
            'GET',
            {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url,permalink','limit':LinebotsConst.InstagramPrams.HASHTAG_SERCH_LIMIT,'user_id':process.env.INSTA_USER_ID},
            function(response) {

                var resjson  = []
                response.data.forEach(data => {
                    resjson['like_count'] = data.like_count
                    resjson['media_url'] = data.media_url
                    resjson['permalink'] = data.permalink
                })
                return resjson
            }
        )
        //return resjson
    }

    topMediaByUserId(): Fbapi[] {

        // ユーザーIDのTOP-Media取得
        return FB.api(
            '/' + process.env.INSTA_USER_ID + '/media',
            'GET',
            {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url,permalink','limit':LinebotsConst.InstagramPrams.USER_TOPMEDIA_LIMIT,'user_id':process.env.INSTA_USER_ID},
            function(response) {
                var resjson  = []
                response.data.forEach(data => {
                    resjson['like_count'] = data.like_count
                    resjson['media_url'] = data.media_url
                    resjson['permalink'] = data.permalink
                })
                return resjson
            }
        )
    }
}