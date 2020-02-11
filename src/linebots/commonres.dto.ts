import { Commonres } from './commonres.interface';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CommonresDto implements Commonres {
    @IsNotEmpty()
    @IsNumber()
    code: number;
    
    @IsNotEmpty()
    @IsString()
    app: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}