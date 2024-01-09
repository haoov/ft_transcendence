import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GameEntity } from './game.entity';

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

	@OneToMany(
		() => GameEntity,
		game => game.winner)
	games_won: GameEntity[]

	@OneToMany(
		() => GameEntity,
		game => game.loser)
	games_lost: GameEntity[]
}