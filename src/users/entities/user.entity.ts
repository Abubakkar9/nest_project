import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  media_url: string

  @Column()
  duration: string;

  @Column()
  status: string;

  @Column()
  call_sid: string;
}
