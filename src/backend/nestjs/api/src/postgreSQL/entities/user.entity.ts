import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserStatus } from "../../user/enum/userStatus.enum"

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
	@Column({ default: "undefined"})
	status: string;
}