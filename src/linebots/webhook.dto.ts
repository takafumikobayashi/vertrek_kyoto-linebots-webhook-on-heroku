import { Webhook } from './webhook.interface';

export class WebhookDto implements Webhook {
    readonly destination: string;
    readonly events: Events[];
}

export class Events {
    readonly replyToken: string;
    readonly type: string;
    readonly mode: string;
    readonly timestamp: number;
    source:{
        readonly type: string;
        readonly userId:string;
    };
    message: {
        readonly id: string;
        readonly type: string;
        readonly text: string;
    }
  }