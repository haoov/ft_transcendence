import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class GameEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	mode: string;

	@ManyToOne(
		() => UserEntity,
		winner => winner.games)
	winner: UserEntity;
	
	@ManyToOne(
		() => UserEntity,
		winner => winner.games)
	loser: UserEntity;
		
	@Column()
	winner_score: number;

	@Column()
	loser_score: number;

	@CreateDateColumn()
	date: Date;
}