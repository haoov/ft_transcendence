import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from 'src/user/user.interface';
import { Message } from 'src/chat/chat.interface';

@Entity()
class ChannelEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	creatorId: number;

	@Column()
	mode: string;

	@Column({ nullable: true}) 
	password: string;

	@ManyToMany(() => UserEntity) @JoinTable()
	users: User [];

	@ManyToMany(() => UserEntity)
	@JoinTable()
	bannedUsers: User [];

	@ManyToMany(() => UserEntity)
	@JoinTable()
	admins: User [];

	@ManyToMany(() => MessageEntity) @JoinTable()
	messages: Message[];
}

@Entity()
class MessageEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'senderId' })
	sender: User;

	@Column()
	channelId: number;

	@Column()
	text: string;

	@Column()
	datestamp: string;
}

export { MessageEntity, ChannelEntity };