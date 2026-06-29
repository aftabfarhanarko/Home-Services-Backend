import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const newContact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(newContact);
  }

  async findAll() {
    return await this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.findOne(id);
    Object.assign(contact, updateContactDto);
    return await this.contactRepository.save(contact);
  }

  async remove(id: number) {
    const contact = await this.findOne(id);
    return await this.contactRepository.remove(contact);
  }
}
