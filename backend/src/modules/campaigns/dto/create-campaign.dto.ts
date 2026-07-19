import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsInt, Min, Max, MinLength } from 'class-validator';
import { CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  aiScript: string;

  @IsString()
  @IsOptional()
  aiVoice?: string;

  @IsString()
  @IsOptional()
  aiLanguage?: string;

  @IsString()
  @IsOptional()
  aiPersonality?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  maxAttempts?: number;

  @IsInt()
  @Min(15)
  @IsOptional()
  retryDelay?: number;

  @IsString()
  @IsOptional()
  callWindowStart?: string;

  @IsString()
  @IsOptional()
  callWindowEnd?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  goalType?: string;

  @IsArray()
  @IsOptional()
  customerIds?: string[];

  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;
}
