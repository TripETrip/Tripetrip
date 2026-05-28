import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../../../../../packages/constants/src/index';
import { apiResponse } from '../../common/http/api-response';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-traveler')
  async registerTraveler(@Body() body: unknown) {
    return apiResponse(await this.authService.registerTraveler(body));
  }

  @Post('register-provider')
  async registerProvider(@Body() body: unknown) {
    return apiResponse(await this.authService.registerProvider(body));
  }

  @Get('me')
  me() {
    return apiResponse({
      user: null,
      requiredRole: Roles.traveler,
      authenticated: false,
    });
  }
}
