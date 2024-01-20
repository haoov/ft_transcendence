export type GameMode = 'classic' | 'super';
export type GameType = 'singleplayer' | 'multiplayer';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameMap = 'classic' | 'tennis' | 'space' | 'random';

export interface GameParams {
	mode: string;
	type: string;
	difficulty: string;
	map: string;
}