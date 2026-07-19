import { UserRole } from '@prisma/client';

export class LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}
