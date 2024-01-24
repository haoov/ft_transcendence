import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity, UserEntity } from 'src/postgreSQL/entities';
import { Repository } from 'typeorm';
import { UserStat } from './interfaces';
import { GameStat } from './interfaces/gamestat.interface';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { User } from 'src/user/user.interface';

@Injectable()
export class HomeService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(GameEntity) private readonly gameRepository: Repository<GameEntity>,
		private readonly userSerivce: UserService
	  ) {}
	
	  // Get all user stats
	  async getAllUserStats(userId: number): Promise<UserStat[]> {
		// Extract all users with related games
		const usersWithGames = await this.userRepository.find({
			relations: ['games_won', 'games_lost'],
	
		});
		// Get all blocking users
		const blockingList = await this.userSerivce.getBlockingList(userId);
		const blockedList = (await this.userSerivce.getBlockedUsers(userId)).map((user) => user.id);
			
		// Map as UserStat type
		const userStats = usersWithGames.map((user) => {
			// Calculate win rate
			const game_count: number = user.games_won.length + user.games_lost.length;
			let rate: number;
			if (game_count)
				rate = Math.round((user.games_won.length / game_count) * 100);
			else
				rate = 0;
			// Check blocking
			let isBlocking: boolean = false;
			blockingList.forEach((blockingUser) => {
				if (blockingUser == user.id)
					isBlocking = true;
			});
			// Check blocked
			let isBlocked: boolean = false;
			blockedList.forEach((blockedUser) => {
				if (blockedUser == user.id)
					isBlocked = true;
			});

			return {
				id: user.id,
				username: user.username,
				avatar: user.avatar,
				status: user.status,
				wins: user.games_won.length,
				win_rate: rate,
				games: game_count,
				rank: 0,
				blocking: isBlocking,
				blocked: isBlocked,
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

	  // Get user stats according to their id
	  async getOneUserStats(id: number, req: Request): Promise<UserStat> {
		const userWatch = req.user as User;
		const userStats = await this.getAllUserStats(userWatch.id);
		const target = userStats.filter((user) => {
			return user.id == id});

		if (target.length)
			return target[0];
		else
			return null;
	  }

	  // Get user game history according to their id
	  async getUserGameHistory(id: number): Promise<GameStat[]> {
		const games = await this.gameRepository.createQueryBuilder('game')
			.leftJoinAndSelect('game.winner', 'winner')
			.leftJoinAndSelect('game.loser', 'loser')
			.where('game.winnerId = :id', { id })
			.orWhere('game.loserId = :id', { id })
			.orderBy('game.id', 'DESC')
			.getMany();
		const gameStats = games.map((game) => {
			if (game.winner.id == id) {
				return {
					id: game.id,
					date: game.date,
					mode: game.mode,
					winFlag : true,
					opponent : game.loser,
					userScore : game.winner_score,
					opponentScore : game.loser_score,
				}
			}
			else {
				return {
					id: game.id,
					date: game.date,
					mode: game.mode,
					winFlag : false,
					opponent : game.winner,
					userScore : game.loser_score,
					opponentScore : game.winner_score,
				}
			}
		});
		return gameStats;
	  }
}