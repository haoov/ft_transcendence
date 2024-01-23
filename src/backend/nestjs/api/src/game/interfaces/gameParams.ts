export type GameMode = 'classic' | 'super';
export type GameType = 'singleplayer' | 'multiplayer';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameMap = 'classic' | 'tennis' | 'space' | 'random';

export interface GameParams {
	mode: GameMode;
	type: GameType;
	difficulty?: GameDifficulty;
	map?: GameMap;
}