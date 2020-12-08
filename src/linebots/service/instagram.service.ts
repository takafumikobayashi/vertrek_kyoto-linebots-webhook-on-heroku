import { Injectable } from '@nestjs/common';
import { LinebotsConst } from '../const/common.const';
import { Fbapi } from '../interface/fbapi.interface';
let FB = require('fb')


@Injectable()
export class InstagramService {
    
    async hashtagSearch(hashtag: string): Promise<string> {
        
        // 受け取ったキーワードでhashtag Search
        return new Promise ((resolve, reject) => {
            FB.api(
                '/ig_hashtag_search',
                'GET',
                {'access_token':process.env.INSTA_ACCESS_TOKEN,'user_id':process.env.INSTA_USER_ID,'q':'vertrek' + hashtag},
                function (response) {
                    if (response.data !== undefined) {
                        resolve(response.data[0].id)
                    } else {
                        reject(LinebotsConst.InstagramPrams.NOT_FOUND_HASHTAGID)
                    }
                }
            )
        })
    }

    topMediaByHashtagId(hashtagId: string): Promise<Fbapi[]> {

        // ハッシュタグIDのTOP-Media取得
        return new Promise ((resolve) => {
            FB.api(
                '/' + hashtagId + '/top_media',
                'GET',
                {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url,permalink','limit':LinebotsConst.InstagramPrams.HASHTAG_SERCH_LIMIT,'user_id':process.env.INSTA_USER_ID},
                function(response) {
                    let resjson  = new Array
                    response.data.forEach(data => {
                        let resobj = {}
                        resobj['like_count'] = data.like_count
                        resobj['media_url'] = data.media_url
                        resobj['permalink'] = data.permalink
                        resjson.push(resobj)
                    })
                    resolve(resjson)
                }
            )
        })        
    }

    topMediaByUserId(): Promise<Fbapi[]> {

        // ユーザーIDのTOP-Media取得
        return new Promise ((resolve) => {
            FB.api(
                '/' + process.env.INSTA_USER_ID + '/media',
                'GET',
                {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url,permalink','limit':LinebotsConst.InstagramPrams.USER_TOPMEDIA_LIMIT,'user_id':process.env.INSTA_USER_ID},
                function(response) {
                    let resjson  = new Array
                    response.data.forEach(data => {
                        let resobj = {}
                        resobj['like_count'] = data.like_count
                        resobj['media_url'] = data.media_url
                        resobj['permalink'] = data.permalink
                        resjson.push(resobj)
                    })
                    resolve(resjson)
                }
            )
        })
    }
}