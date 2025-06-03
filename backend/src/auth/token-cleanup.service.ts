import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenCleanupService {
    constructor(private prismaService: PrismaService) {}
    private readonly logger = new Logger(TokenCleanupService.name);

    @Cron('0 30 8 * * *', {
        timeZone: 'Europe/Kyiv',
    })
    async handleCron() {
        this.logger.debug('test');
        const unix = moment().unix();
        await this.prismaService.token.deleteMany({
            where: {
                exp: { lt: unix },
            },
        });
    }
}
