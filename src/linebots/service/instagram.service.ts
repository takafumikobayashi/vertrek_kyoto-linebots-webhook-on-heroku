import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { LinebotsConst } from '../const/common.const';
import { LinebotsService } from './linebots.service';


@Injectable()
export class InstagramService {
    
    constructor(
        @Inject(forwardRef(() => LinebotsService))
        private readonly FB = require('fb')
    ){};

    async hashtagSearch(hashtag) {
        
        // 受け取ったキーワードでhashtag Search
        this.FB.api(
            '/ig_hashtag_search',
            'GET',
            {'access_token':process.env.INSTA_ACCESS_TOKEN,'user_id':process.env.INSTA_USER_ID,'q':'vertrek' + hashtag},
            function(response) {
                if (response.data !== undefined) {
                    return response.data[0].id
                }
            }
        )
    }

    async topMediaByHashtagId(hashtagId) {

        // ハッシュタグIDのTOP-Media取得
        this.FB.api(
            '/' + hashtagId + '/top_media',
            'GET',
            {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url,permalink','limit':LinebotsConst.InstagramPrams.HASHTAG_SERCH_LIMIT,'user_id':process.env.INSTA_USER_ID},
            function(response) {
                return response
            }
        )
    }

    async topMediaByUserId() {

        // ユーザーIDのTOP-Media取得
        this.FB.api(
            '/' + process.env.INSTA_USER_ID + '/media',
            'GET',
            {'access_token':process.env.INSTA_ACCESS_TOKEN,'fields':'like_count,media_url,permalink','limit':LinebotsConst.InstagramPrams.USER_TOPMEDIA_LIMIT,'user_id':process.env.INSTA_USER_ID},
            function(response) {
                return response
            }
        )
    }

}