import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class GameEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	mode: string;

	@ManyToOne(() => UserEntity)
	winner: UserEntity;
	
	@ManyToOne(() => UserEntity)
	loser: UserEntity;
		
	@Column()
	winner_score: number;

	@Column()
	loser_score: number;

	@CreateDateColumn()
	created_at: Date;
}