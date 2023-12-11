import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ unique: true })
	username: string;
	@Column()
	avatar: string;
	@Column({ default: null })
	twofa_code: string;
	@Column({ default: false })
	twofa_enabled: boolean;
	@Column()
	email: string;
}