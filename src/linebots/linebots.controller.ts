import { Controller, Get, Post, Body, Header, Res, Req } from '@nestjs/common';
import { WebhookDto } from './webhook.dto';
import { CommonresDto } from './commonres.dto';
import { LinebotsService } from './linebots.service';
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
            a.message = 'This is Linebots webhook API from vertrek-kyoto';
            res.send(JSON.stringify(a));
        }        

    // Webhook Reply
    @Header('content-type', 'application/json')
    @Post('/webhook')
        async reply(@Body() webhookDto: WebhookDto, @Res() res: Response, @Req() req: Request) {

            if (this.linebotsService.check(req) === true) {
                this.linebotsService.reply(webhookDto);
                a.message = 'Reply from vertrek-kyoto successfully!';
            } else {
                console.log('Reply from vertrek-kyoto failed!(X-Line-Signature)')
                a.message = 'Reply from vertrek-kyoto failed!';
            };
            res.status(200);
            res.send(JSON.stringify(a));
        }
}
