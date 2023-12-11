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
	message: string;

	@Column()
	datestamp: Date;

	@Column()
	timestamp: number;
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
	modeChanel: string;
}