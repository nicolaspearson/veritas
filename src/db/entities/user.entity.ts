import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @Column({ name: 'email', type: 'varchar', unique: true })
  @Index('IDX_USER_EMAIL')
  email!: Email;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'auth0_id', type: 'varchar' })
  auth0Id!: Auth0Id;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
  deletedAt?: Date | null;
}
