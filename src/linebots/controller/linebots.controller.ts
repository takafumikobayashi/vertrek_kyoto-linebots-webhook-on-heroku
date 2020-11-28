import { Controller, Get, Post, Body, Header, Res, Req } from '@nestjs/common';
import { WebhookDto } from '../interface/webhook.dto';
import { CommonresDto } from '../interface/commonres.dto';
import { LinebotsConst } from '../const/common.const';
import { LinebotsService } from '../service/linebots.service';
import { Request, Response } from 'express';


@Controller('linebots')
export class LinebotsController {
    private responseDto = new CommonresDto();
    constructor(
        private readonly linebotsService: LinebotsService
        ) {
            this.responseDto.app = LinebotsConst.ResMessage.API_RESPONSE_APP;
            this.responseDto.code = LinebotsConst.ResMessage.API_RESPONSE_CODE;
        }

    // About This API
    @Header('content-type', 'application/json')
    @Get()
        aboutapi(@Res() res: Response) {
            this.responseDto.message = LinebotsConst.ResMessage.APP_INFO;
            res.send(JSON.stringify(this.responseDto));
        }        

    // Webhook Reply
    @Header('content-type', 'application/json')
    @Post('/webhook')
        async reply(@Body() webhookDto: WebhookDto, @Res() res: Response, @Req() req: Request) {

            if (this.linebotsService.check(req) === true) {
                this.linebotsService.reply(webhookDto);
                this.responseDto.message = LinebotsConst.ResMessage.SUCCESS_MESSAGE;
            } else {
                console.log('Reply from vertrek-kyoto failed!(X-Line-Signature)')
                this.responseDto.message = LinebotsConst.ResMessage.FAILED_MESSAGE;
            };
            res.status(200);
            res.send(JSON.stringify(this.responseDto));
        }
    
    // LINE Push message from Webhooks
    @Post('/instagram')
        async linepush(@Res() res: Response) {

            this.linebotsService.lineBroadcast();
            this.responseDto.message = LinebotsConst.ResMessage.SUCCESS_MESSAGE;
            res.status(200);
            res.send(JSON.stringify(this.responseDto));
        }

}
