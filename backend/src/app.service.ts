import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'AI Voice Calling Agent API is running! 🤖📞';
  }
}
