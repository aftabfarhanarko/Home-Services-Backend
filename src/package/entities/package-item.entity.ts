import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Package } from './package.entity';
import { NestedService } from '../../nested-service/entities/nested-service.entity';

@Entity('package_items')
export class PackageItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Package, (pkg: Package) => pkg.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @ManyToOne(() => NestedService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nested_service_id' })
  nestedService: NestedService;
}
