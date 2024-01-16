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
	mode: string;

	@Column({ nullable: true}) 
	password: string;

	@ManyToMany(() => UserEntity) @JoinTable()
	users: User [];

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

}

export { MessageEntity, ChannelEntity };