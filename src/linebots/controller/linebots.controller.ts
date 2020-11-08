import { Controller, Get, Post, Body, Header, Res, Req } from '@nestjs/common';
import { WebhookDto } from '../interface/webhook.dto';
import { CommonresDto } from '../interface/commonres.dto';
import { LinebotsConst } from '../const/common.const';
import { LinebotsService } from '../service/linebots.service';
import { Request, Response } from 'express';

// 共通レスポンス作成
const a = new CommonresDto();
a.app = 'linebots';
a.code = 0;

@Controller('linebots')
export class LinebotsController {
    constructor(private readonly linebotsService: LinebotsService) {}

    // About This API
    @Header('content-type', 'application/json')
    @Get()
        aboutapi(@Res() res: Response) {
            a.message = LinebotsConst.ResMessage.APP_INFO;
            res.send(JSON.stringify(a));
        }        

    // Webhook Reply
    @Header('content-type', 'application/json')
    @Post('/webhook')
        async reply(@Body() webhookDto: WebhookDto, @Res() res: Response, @Req() req: Request) {

            if (this.linebotsService.check(req) === true) {
                this.linebotsService.reply(webhookDto);
                a.message = LinebotsConst.ResMessage.SUCCESS_MESSAGE;
            } else {
                console.log('Reply from vertrek-kyoto failed!(X-Line-Signature)')
                a.message = LinebotsConst.ResMessage.FAILED_MESSAGE;
            };
            res.status(200);
            res.send(JSON.stringify(a));
        }
    
    // LINE Push message from Webhooks
    @Post('/instagram')
        async linepush(@Res() res: Response) {

            this.linebotsService.lineBroadcast();
            a.message = LinebotsConst.ResMessage.SUCCESS_MESSAGE;
            res.status(200);
            res.send(JSON.stringify(a));
        }

}
