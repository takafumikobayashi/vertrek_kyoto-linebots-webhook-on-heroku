export namespace LinebotsConst {

    /** アプリケーション名 */
    export const APPLICATION_NAME = 'vertrek_kyoto';

    /** API応答メッセージ */
    export namespace ResMessage {

        export const APP_INFO = 'This is Linebots webhook API from vertrek-kyoto';
        export const SUCCESS_MESSAGE = 'Reply from vertrek-kyoto successfully!';
        export const FAILED_MESSAGE = 'Reply from vertrek-kyoto failed!';
        
        export const APP_NAME_WEBHOOK = 'webhook';
        export const APP_NAME_LINEPUSH = 'nsgtagram';
    }

    /** LINEBots関連定数 */
    export namespace  LineBotMessage {

        export const NOT_FOUND_PICUTURE = '...すみません、該当の写真はありませんでした。'
        export const BROADCAST_MESSAGE = 'こんにちは、本日の@vertrek_kyotoの最新投稿です！\n' + process.env.INSTA_MY_URL 
        export const HASHTAG_PREFIX = 'vertrek'
        export const SEND_SUCCESS_LOG_MESSAGE = 'Message send Successfully!'
    }
}