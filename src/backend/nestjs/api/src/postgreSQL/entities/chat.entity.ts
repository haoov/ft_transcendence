import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
	modeChannel: 'public' | 'private' | 'protected' | 'secret';
}