import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from 'src/user/user.interface';

@Entity()
export class MessageEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	senderId: number;

	@Column()
	channelId: number;

	@Column()
	text: string;

	@Column()
	datestamp: Date;

	@Column()
	timestamp: string;
}

@Entity()
export class ChannelEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	creatorId: number;

	@Column()
	mode: 'public' | 'private' | 'protected' | 'secret';

	@Column({ nullable: true}) 
	password: string;

	@ManyToMany(() => UserEntity) @JoinTable()
	users: User [];
}