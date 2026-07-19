import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { phone: createCustomerDto.phone },
    });

    if (existingCustomer) {
      throw new BadRequestException('Customer with this phone number already exists');
    }

    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { calls: true, appointments: true },
          },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        calls: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        appointments: {
          orderBy: { dateTime: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    
    await this.prisma.campaignCustomer.deleteMany({ where: { customerId: id } });
    await this.prisma.call.deleteMany({ where: { customerId: id } });
    await this.prisma.appointment.deleteMany({ where: { customerId: id } });
    
    await this.prisma.customer.delete({
      where: { id },
    });

    return { message: 'Customer deleted successfully' };
  }

  async deleteAll() {
    await this.prisma.campaignCustomer.deleteMany({});
    await this.prisma.call.deleteMany({});
    await this.prisma.appointment.deleteMany({});
    const deleted = await this.prisma.customer.deleteMany({});
    return { message: `Successfully deleted ${deleted.count} customers` };
  }

  async importFromExcel(file: Express.Multer.File): Promise<{ imported: number; errors: string[]; skipped: number }> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (data.length === 0) {
      return { imported: 0, errors: ['File is empty or has no data rows'], skipped: 0 };
    }

    // Auto-detect columns by scanning headers
    const headers = Object.keys(data[0]);
    
    const findCol = (keywords: string[]): string | null => {
      return headers.find(h =>
        keywords.some(k => h.toLowerCase().replace(/[\s_-]/g, '').includes(k.toLowerCase().replace(/[\s_-]/g, '')))
      ) || null;
    };

    const phoneCol = findCol(['customermobile', 'mobile', 'phone', 'contact', 'phoneno', 'mobileno', 'cellphone', 'cell']);
    const phone2Col = findCol(['mobileno2', 'mobile2', 'phone2', 'altphone', 'alternatemobile']);
    const nameCol = findCol(['customername', 'name', 'clientname', 'fullname', 'customer']);
    const emailCol = findCol(['email', 'emailid', 'emailaddress', 'mail']);
    const cityCol = findCol(['city', 'town', 'district']);
    const areaCol = findCol(['area', 'locality', 'region', 'zone']);
    const addressCol = findCol(['address', 'addressline', 'addressli']);
    const modelCol = findCol(['model', 'vehiclemodel', 'carmodel']);
    const notesCol = findCol(['notes', 'remark', 'remarks', 'status', 'custcalling', 'callingnote']);
    const serviceCol = findCol(['dueservi', 'dueservice', 'service', 'servicetype']);

    if (!phoneCol && !phone2Col) {
      return { 
        imported: 0, 
        errors: [`Could not find a phone/mobile column. Available columns: ${headers.join(', ')}`],
        skipped: 0
      };
    }

    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;
    let rowIndex = 0;

    for (const row of data) {
      rowIndex++;
      try {
        // Get phone - try primary column first, then secondary
        const rawPhone = (phoneCol ? row[phoneCol] : '') || (phone2Col ? row[phone2Col] : '');
        const phone = this.normalizePhone(String(rawPhone || ''));

        if (!phone) {
          skipped++;
          errors.push(`Row ${rowIndex}: Skipped - invalid/missing phone "${rawPhone}"`);
          continue;
        }

        // Build name from available columns
        const rawName = nameCol ? row[nameCol] : '';
        const name = rawName ? String(rawName).trim() : `Customer ${rowIndex}`;

        // Build notes from multiple columns
        const notesParts: string[] = [];
        if (serviceCol && row[serviceCol]) notesParts.push(`Service: ${row[serviceCol]}`);
        if (modelCol && row[modelCol]) notesParts.push(`Vehicle: ${row[modelCol]}`);
        if (notesCol && row[notesCol]) notesParts.push(`Note: ${row[notesCol]}`);
        const notes = notesParts.join(' | ') || null;

        // Build address-based tags
        const tags: string[] = [];
        if (cityCol && row[cityCol]) tags.push(String(row[cityCol]).trim());
        if (areaCol && row[areaCol]) tags.push(String(row[areaCol]).trim());
        const filteredTags = tags.filter(t => t && t !== '' && t !== '0');

        const email = emailCol && row[emailCol] ? String(row[emailCol]).trim() : null;

        // Store extra fields as metadata
        const metadata: any = {};
        if (addressCol && row[addressCol]) metadata.address = String(row[addressCol]);
        if (modelCol && row[modelCol]) metadata.vehicle_model = String(row[modelCol]);
        if (serviceCol && row[serviceCol]) metadata.due_service = String(row[serviceCol]);

        await this.prisma.customer.upsert({
          where: { phone },
          update: { name, email, tags: filteredTags, notes, metadata },
          create: { phone, name, email: email || null, tags: filteredTags, notes, metadata },
        });

        imported++;
      } catch (error) {
        errors.push(`Row ${rowIndex}: ${error.message}`);
      }
    }

    return { imported, errors: errors.slice(0, 20), skipped }; // limit errors returned
  }

  async exportToExcel(): Promise<Buffer> {
    const customers = await this.prisma.customer.findMany({
      include: {
        calls: { orderBy: { createdAt: 'desc' }, take: 1 },
        appointments: { orderBy: { dateTime: 'desc' }, take: 1 },
      }
    });

    const data = customers.map(c => ({
      Name: c.name,
      Phone: c.phone,
      Email: c.email || '',
      Tags: c.tags.join(', '),
      Notes: c.notes || '',
      LatestCallStatus: c.calls.length > 0 ? c.calls[0].status : 'N/A',
      LatestAppointment: c.appointments.length > 0 ? c.appointments[0].dateTime.toLocaleString() : 'N/A',
      AppointmentStatus: c.appointments.length > 0 ? c.appointments[0].status : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  private normalizePhone(phone: string): string | null {
    if (!phone || phone.trim() === '' || phone === '0') return null;

    // Remove all non-digit characters except leading +
    const cleaned = phone.toString().replace(/[^\d+]/g, '').replace(/^\++/, '+');
    const digits = cleaned.replace(/\D/g, '');

    if (digits.length === 0) return null;

    // Indian mobile numbers: 10 digits starting with 6-9
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      return `+91${digits}`;
    }
    // With 91 country code: 12 digits
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+${digits}`;
    }
    // With +91 already: 12 digits
    if (cleaned.startsWith('+91') && digits.length === 12) {
      return `+${digits}`;
    }
    // US numbers: 10 digits
    if (digits.length === 10 && /^[2-9]/.test(digits)) {
      return `+1${digits}`;
    }
    // US with country code: 11 digits starting with 1
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    // Any other number with enough digits (international)
    if (digits.length >= 7 && digits.length <= 15) {
      return cleaned.startsWith('+') ? cleaned : `+${digits}`;
    }

    return null;
  }
}
