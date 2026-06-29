import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const data = await this.contactService.create(createContactDto);
    return { success: true, message: 'Message sent successfully', data };
  }

  @Get()
  async findAll() {
    const data = await this.contactService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.contactService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateContactDto: UpdateContactDto) {
    const data = await this.contactService.update(id, updateContactDto);
    return { success: true, message: 'Contact updated successfully', data };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.contactService.remove(id);
    return { success: true, message: 'Contact deleted successfully' };
  }
}
