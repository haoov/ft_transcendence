export type GameMode = 'classic' | 'super' | undefined;
export type GameType = 'singleplayer' | 'multiplayer' | undefined;
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameMap = 'classic' | 'tennis' | 'space' | 'random';

export interface GameParams {
	mode: GameMode;
	type: GameType;
	difficulty: GameDifficulty;
	map: GameMap;
}