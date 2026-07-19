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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppointmentsService, CreateAppointmentDto, UpdateAppointmentDto } from './appointments.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (customerId) filters.customerId = customerId;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    return this.appointmentsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      filters,
    );
  }

  @Get('statistics')
  getStatistics() {
    return this.appointmentsService.getStatistics();
  }

  @Get('export')
  async exportToExcel(@Res() res: Response) {
    const buffer = await this.appointmentsService.exportToExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="appointments_report.xlsx"',
    });
    res.send(buffer);
  }

  @Get('available-slots')
  getAvailableSlots(
    @Query('date') date: string,
    @Query('duration') duration?: string,
  ) {
    return this.appointmentsService.getAvailableSlots(
      new Date(date),
      duration ? parseInt(duration) : 30,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.appointmentsService.cancel(id, reason);
  }

  @Post(':id/send-confirmation')
  sendConfirmation(@Param('id') id: string) {
    return this.appointmentsService.sendConfirmationSMS(id);
  }

  @Post('send-reminders')
  sendReminders() {
    return this.appointmentsService.sendReminders();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
