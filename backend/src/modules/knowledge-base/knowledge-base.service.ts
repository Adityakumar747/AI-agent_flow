import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

export interface CreateKnowledgeBaseDto {
  question: string;
  answer: string;
  category: string;
  keywords?: string[];
  priority?: number;
}

export interface UpdateKnowledgeBaseDto {
  question?: string;
  answer?: string;
  category?: string;
  keywords?: string[];
  isActive?: boolean;
  priority?: number;
}

@Injectable()
export class KnowledgeBaseService {
  constructor(private prisma: PrismaService) {}

  async create(createKnowledgeBaseDto: CreateKnowledgeBaseDto) {
    return this.prisma.knowledgeBase.create({
      data: createKnowledgeBaseDto,
    });
  }

  async findAll(page: number = 1, limit: number = 20, category?: string, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' as const } },
        { answer: { contains: search, mode: 'insensitive' as const } },
        { keywords: { has: search } },
      ];
    }

    const [entries, total] = await Promise.all([
      this.prisma.knowledgeBase.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.knowledgeBase.count({ where }),
    ]);

    return {
      data: entries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const entry = await this.prisma.knowledgeBase.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException(`Knowledge base entry with ID ${id} not found`);
    }

    return entry;
  }

  async update(id: string, updateKnowledgeBaseDto: UpdateKnowledgeBaseDto) {
    await this.findOne(id);

    return this.prisma.knowledgeBase.update({
      where: { id },
      data: updateKnowledgeBaseDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.knowledgeBase.delete({
      where: { id },
    });

    return { message: 'Knowledge base entry deleted successfully' };
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const entries = await this.prisma.knowledgeBase.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return entries.map((entry) => entry.category);
  }

  /**
   * Search knowledge base by keywords
   */
  async searchByKeywords(keywords: string[]): Promise<any[]> {
    return this.prisma.knowledgeBase.findMany({
      where: {
        isActive: true,
        keywords: {
          hasSome: keywords,
        },
      },
      orderBy: {
        priority: 'desc',
      },
    });
  }

  /**
   * Get active entries by category
   */
  async getActiveByCategory(category: string): Promise<any[]> {
    return this.prisma.knowledgeBase.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: {
        priority: 'desc',
      },
    });
  }

  /**
   * Bulk import knowledge base entries
   */
  async bulkImport(entries: CreateKnowledgeBaseDto[]): Promise<{ imported: number; errors: string[] }> {
    let imported = 0;
    const errors: string[] = [];

    for (const entry of entries) {
      try {
        await this.create(entry);
        imported++;
      } catch (error) {
        errors.push(`Error importing "${entry.question}": ${error.message}`);
      }
    }

    return { imported, errors };
  }
}
