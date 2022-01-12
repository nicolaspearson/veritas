import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity({ name: 'member' })
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @ManyToOne((_) => Organization, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'organization_id' })
  @Index('IDX_MEMBER_ORGANIZATION_ID')
  organization!: Organization;

  @ManyToOne((_) => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  @Index('IDX_MEMBER_USER_ID')
  user!: User;
}
