import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ unique: true })
	username: string;
	@Column()
	avatar: string;
	@Column()
	email: string;
}