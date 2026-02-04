import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('timezones')
export class Timezone {
  @PrimaryColumn({ name: 'identifier', type: 'varchar', length: 50 })
  identifier: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  region: string | null;

  @Column({ name: 'utc_offset_minutes', type: 'int' })
  utcOffsetMinutes: number;

  @Column({ name: 'is_popular', type: 'boolean', default: false })
  isPopular: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
