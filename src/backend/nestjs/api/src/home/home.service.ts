import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity, UserEntity } from 'src/postgreSQL/entities';
import { Repository } from 'typeorm';
import { Leaders } from './interfaces';

@Injectable()
export class HomeService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(GameEntity) private readonly gameRepository: Repository<GameEntity>,
	  ) {}
	
	  async getLeaderboard(): Promise<Leaders[]> {
		// Extract all users with related games
		const usersWithGames = await this.userRepository.find({
			relations: ['games', 'games.winner', 'games.loser'],
	
		});
			
		// Filter with only won games
		const usersWithWonGames = usersWithGames.map((user) => {
			// user.games.forEach((game) => {
			// 	console.log(game);
			// })
			const wonGames = user.games.filter(
			(game) => game.winner && game.winner.id === user.id,
			);
			return {
			...user,
			games: wonGames,
			};
		});

	
		// Sort according to number of won games or id
		usersWithWonGames.sort(
		  (userA, userB) =>
			userB.games.length - userA.games.length || userB.id - userA.id,
		);
	
		// Slice the top 10 players
		const top10Users = usersWithWonGames.slice(0, 10).map((user) => ({
			id: user.id,
			username: user.username,
			avatar: user.avatar,
			wins: user.games.length
		}));
	
		return top10Users;
	  }

	  async getUserRank(username: string): Promise<number> {
		// Extract all users with related games
		const usersWithGames = await this.userRepository.find({
			relations: ['games', 'games.winner', 'games.loser'],
	
		});
			
		// Filter with only won games
		const usersWithWonGames = usersWithGames.map((user) => {
			const wonGames = user.games.filter(
			(game) => game.winner && game.winner.id === user.id,
			);
			return {
			...user,
			games: wonGames,
			};
		});

	
		// Sort according to number of won games or id
		usersWithWonGames.sort(
		  (userA, userB) =>
			userB.games.length - userA.games.length || userB.id - userA.id,
		);
	
		// Find the index of the target user in the sorted list
		const targetUserIndex = usersWithWonGames.findIndex((user) => user.username === username);

		if (targetUserIndex !== -1) {
			// Add 1 to get the rank (as indexing starts from 0)
			const userRank = targetUserIndex + 1;
			return userRank;
		}
		// If the user was not found, return a value indicating they're not ranked
		return -1;
	  }
}