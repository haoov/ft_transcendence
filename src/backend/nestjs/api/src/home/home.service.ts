import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity, UserEntity } from 'src/postgreSQL/entities';
import { Repository } from 'typeorm';
import { UserStat } from './interfaces';

@Injectable()
export class HomeService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(GameEntity) private readonly gameRepository: Repository<GameEntity>,
	  ) {}
	
	  // Get top best 5 players
	  async getLeaderboard(): Promise<UserStat[]> {
		// Get total user stats
		let userStats = await this.getAllUserStats();

		// Slice the top 5 players
		return userStats.slice(0, 5);
	  }

	  // Get user stats according to their username
	  async getOneUserStats(username: string): Promise<UserStat> {
		// Get total user stats
		const userStats = await this.getAllUserStats();
	
		// Find the corresponding user
		const target = userStats.filter((user) => {
			return user.username === username});

		if (target.length)
			return target[0];
		else
			return null;
	  }

	  // Get all user stats
	  async getAllUserStats(): Promise<UserStat[]> {
		// Extract all users with related games
		const usersWithGames = await this.userRepository.find({
			relations: ['games', 'games.winner', 'games.loser'],
	
		});
			
		// Map as UserStat type
		const userStats = usersWithGames.map((user) => {
			// Filter won games
			console.log("for user " + user.username + ", id: " + user.id);
			const wonGames = user.games.filter(
			(game) => {
				// A CREUSER
				return game.winner && game.winner.id === user.id}
			);

			// Calculate win rate
			let rate: number;
			if (user.games.length)
				rate = Math.round((wonGames.length / user.games.length) * 100);
			else
				rate = 0;

			return {
				id: user.id,
				username: user.username,
				avatar: user.avatar,
				wins: wonGames.length,
				win_rate: rate,
				games: user.games.length,
				rank: 0
			};
		});

		// Sort users based on wins or win rate
		userStats.sort((a, b) => b.wins - a.wins || b.win_rate - a.win_rate || a.id - b.id);

		// Assign ranks based on the sorted order
		userStats.forEach((user, index) => {
			user.rank = index + 1;
		});
		
		return userStats;
	  }
}