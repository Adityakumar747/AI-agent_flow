import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { KnowledgeBaseService, CreateKnowledgeBaseDto, UpdateKnowledgeBaseDto } from './knowledge-base.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('knowledge-base')
@UseGuards(JwtAuthGuard)
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Post()
  create(@Body() createKnowledgeBaseDto: CreateKnowledgeBaseDto) {
    return this.knowledgeBaseService.create(createKnowledgeBaseDto);
  }

  @Post('bulk-import')
  bulkImport(@Body() entries: CreateKnowledgeBaseDto[]) {
    return this.knowledgeBaseService.bulkImport(entries);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.knowledgeBaseService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      category,
      search,
    );
  }

  @Get('categories')
  getCategories() {
    return this.knowledgeBaseService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.knowledgeBaseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKnowledgeBaseDto: UpdateKnowledgeBaseDto) {
    return this.knowledgeBaseService.update(id, updateKnowledgeBaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.knowledgeBaseService.remove(id);
  }
}
