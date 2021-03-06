export namespace LinebotsConst {

    /** アプリケーション名 */
    export const APPLICATION_NAME = 'vertrek_kyoto';

    /** API応答メッセージ */
    export namespace ResMessage {

        export const APP_INFO = 'This is Linebots webhook API from vertrek-kyoto';
        export const SUCCESS_MESSAGE = 'Reply from vertrek-kyoto successfully!';
        export const FAILED_MESSAGE = 'Reply from vertrek-kyoto failed!';
        
        export const APP_NAME_WEBHOOK = 'webhook';
        export const APP_NAME_LINEPUSH = 'insgtagram';

        export const API_RESPONSE_APP = 'linebots';
        export const API_RESPONSE_CODE = 0;
    }

    /** LINEBots関連定数 */
    export namespace  LineBotMessage {

        export const NOT_FOUND_PICUTURE = '...すみません、該当の写真はありませんでした。'
        export const BROADCAST_MESSAGE = 'こんにちは、本日の@vertrek_kyotoの最新投稿です！\n' + process.env.INSTA_MY_URL 
        export const INSTAGRAM_INFOMATION_MESSAGE = 'Instagramでは他にも写真があるので是非見て下さい！'
        export const NEW_POST_MESSAGE = '@vertrek_kyotoに新しい写真が投稿されました！'
        export const HASHTAG_PREFIX = 'vertrek'
        export const SEND_SUCCESS_LOG_MESSAGE = 'Message send Successfully!'
        export const INSTAGRAM_HASHSEARCH_URL = 'https://www.instagram.com/explore/tags/'
        export const WIKIPEDIA_URL = 'https://ja.wikipedia.org/wiki/'
    }

    /** Instagram関連定数 */
    export namespace  InstagramPrams {

        export const HASHTAG_SERCH_LIMIT = '5'
        export const USER_TOPMEDIA_LIMIT = '10'
        export const NOT_FOUND_HASHTAGID = 'hashtagId not found from instagram Graph API'
    }

    /** Twitter関連定数 */
    export namespace  TwitterParams {

        export const TWEET_SUCCESS = 'twitter post Successfully!'
        export const TWEET_TEXT = 'こんにちは、本日のvertrek_kyoto Instagramの最新投稿です！是非訪れてみて下さい！！'
    }

}