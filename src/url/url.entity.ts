import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Url')
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column()
  expireAt: Date;
}
