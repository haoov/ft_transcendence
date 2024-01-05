import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from 'src/user/user.interface';

@Entity()
class ChannelEntity {
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

	@OneToMany(() => MessageEntity, message => message.channel)
	messages: MessageEntity [];
}

@Entity()
class MessageEntity {
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

	@ManyToOne(() => ChannelEntity, channel => channel.messages)
	channel: ChannelEntity;

}

export { MessageEntity, ChannelEntity };