import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TimezonePreset } from './timezone-preset.entity';

@Entity('preset_timezones')
export class PresetTimezone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'preset_id' })
  presetId: string;

  @Column({ name: 'timezone_identifier' })
  timezoneIdentifier: string;

  @Column({ name: 'display_label', type: 'varchar', nullable: true })
  displayLabel: string | null;

  @Column({ default: 0 })
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => TimezonePreset, (preset) => preset.timezones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'preset_id' })
  preset: TimezonePreset;
}
