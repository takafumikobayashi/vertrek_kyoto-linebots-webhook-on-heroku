export interface Webhook {
    destination:string;
    events:IEvent[];
}

interface IEvent {
    replyToken: string;
    type: string;
    mode: string;
    timestamp: number;
    source:{
        type: string;
        userid:string;
    };
    message: {
        id: string;
        type: string;
        text: string;
    }
}