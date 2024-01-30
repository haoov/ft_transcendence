<script setup lang="ts">

import axios from "axios";
import { useRouter } from "vue-router";
import offline from '../assets/images/status-offline-32.png';
import online from '../assets/images/status-online-32.png';
import playing from '../assets/images/status-playing-32.png';
import blocked from '../assets/images/status-blocked-32.png';
import { type UserStat, type User, type GameStat, ServerEvents } from "@/utils";
import { computed, inject, onMounted, ref } from "vue";
import { socketManager } from "@/SocketManager";
import notify from "@/notify/notify";
import { chat } from "@/chat";

const router = useRouter();
const players = ref<UserStat[]>([]);
const imagesLoaded = ref<boolean>(false);
const me = ref<User>();
const myStats = ref<UserStat>();
const myGames = ref<GameStat[]>([]);
const search = ref('');
const options = ['All', 'Friends'];
const selectedOption = ref('All');

const $data : any = inject('$data');

const playersDisplayed = computed(() => {
		if (search.value.length === 0) {
				return players.value;
		} else {
				return players.value.filter((user: UserStat) => {
						return user.username.toLowerCase().startsWith(search.value.toLowerCase());
				});
		}
});

socketManager.addEventListener("user", ServerEvents.dataChanged, async (user: User) => {
	await fetchLeaderboard(selectedOption.value);
});

// FETCHING DATA
async function fetchData() {
	await fetchMe();
	await fetchLeaderboard(selectedOption.value);
	loadAllImages();
}

async function fetchLeaderboard(option: string) {
	selectedOption.value = option;
	let query: string = '';
	if (selectedOption.value == 'Friends')
		query = '?friends=true';
	await axios
		.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/stats/leaderboard${query}`)
		.then(data => { players.value = data.data; });
}

async function fetchMe() {
	await axios
		.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`)
		.then( (data) => {
			me.value = data.data;
			// Fetch my stats
			const url1: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/stats/user/${data.data.id}`;
				axios.get(url1).then( data => {
				myStats.value = data.data;})
			// Fetch my games
			const url2: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/stats/game-history/${data.data.id}`;
			axios.get(url2).then( data => {
				myGames.value = data.data;
				updatePieAnimation();})
			});
}

function loadAllImages() {
			let loadPromises = players.value.map(player => {
				return new Promise((resolve, reject) => {
					let img = new Image();
					img.src = player.avatar;
					img.onload = resolve;
					img.onerror = reject;
				});
			});

			Promise.all(loadPromises)
				.then(() => { imagesLoaded.value = true; })
		}


// UTIL FUNCTIONS
function	getRankClass(index: number) : string {
	let className = "c-flag c-place u-bg--transparent u-text--oswald"
	switch (index) {
		case 1:
			className += " u-text--dark u-bg--pink1";
			break;
		case 2:
			className += " u-text--dark u-bg--pink2"
			break;
		case 3:
			className += " u-text--dark u-bg--pink3"
			break;
	}
	return className;
}

function	getAvatarSrc(id: number) : string {
	const timestamp = Date.now();
	const user = players.value.filter((user) => {
		return user.id == id;
	});
	if (user[0].avatar.includes(':3000/api/user/avatar/'))
		return `${user[0].avatar}?${timestamp}`;
	else
		return user[0].avatar
}

function	getMyAvatarSrc() : string | undefined {
		const timestamp = Date.now();
		if (me.value?.avatar.includes(':3000/api/user/avatar/'))
			return `${me.value.avatar}?${timestamp}`;
		else
			return me.value?.avatar
}

function getStatusIcon(user: UserStat) : string {
	if (user.blocked)
		return blocked;
	else if (user.status == "undefined" || user.status == "offline")
		return offline;
	else if (user.status == "playing")
		return playing;
	else
		return online;
}

function getPieProportions() : string {
	let loses: number = 0;
	if (myStats.value)
		loses = 100 - myStats.value.win_rate; 
	return myStats.value?.win_rate.toString() + " " + loses.toString();
}

function updatePieAnimation() {
  const proportions = getPieProportions();
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    @keyframes donut {
      0% {
        stroke-dasharray: 0, 100;
      }
      100% {
        stroke-dasharray: ${proportions};
      }
    }
  `;
  document.head.appendChild(styleElement);
}

function getDateStr(dt: Date) : string {
	let date = new Date(dt);
	return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });	
}

function getHourStr(dt: Date) : string {
	let date = new Date(dt);
	let hours = date.getHours().toString().padStart(2, '0');
	let minutes = date.getMinutes().toString().padStart(2, '0');
	return hours + ':' + minutes;

}

function getScoreColor(winFlag: boolean): string {
	if (winFlag)
		return "var(--c-pink)";
	else
		return "var(--c-grey)"
}


// ACTIONS
function goToProfile(username: string) {
      router.push(`/${username}`);
}

function inviteToPlay(player: UserStat) {
	if (player.status == "offline" || player.status == "undefined")
		notify.newNotification("error", {message: "User offline", by: player.username});
	else if (player.status == "playing")
		notify.newNotification("error", {message: "Already playing", by: player.username});
	else {
		notify.newNotification("success", {message: "Invitation sent"});
		socketManager.invite(player.id);
	}
}

function sendMessage(player: any) {
	router.push(`/chat`);
	const user : User = {
		id: player.id,
		username: player.username,
		email: player.email,
		avatar:player.avatar,
		status: player.status,
		twofa_enabled: false,
	};
	chat.sendPrivateMessage(user);
}

onMounted(async () => {
	await fetchData();
});
</script>

<template>
<div class="l-wrapper">
	<div class="l-grid">
		<div class="l-grid__item l-grid__item--sticky">
			<div class="c-card" id="profile-card">
				<div class="c-card__body">
					<div class="u-display--flex u-justify--space-between">
						<div class="u-text--left">
							<img v-if="imagesLoaded" class="c-avatar c-avatar--lg u-ml--24" :src="getMyAvatarSrc()"/>
							<div class="u-text--medium u-mt--16 u-text--overpass u-ml--24">{{ me?.username }}</div>
							<span class="u-text--c-teal u-mt--16 u-text--small u-text--overpass u-ml--24">{{ me?.email}} </span>
						</div>
						<div class="u-text--right">
								<div class="u-mt--16 u-text--small u-text--overpass">My Rank</div>
								<h2 class="u-text--oswald">{{ myStats?.rank }}</h2>
								<div class="u-mt--24 u-text--small u-text--overpass">My Wins</div>
								<h2 class="u-text--oswald">{{ myStats?.wins }}</h2>
						</div>
					</div>
				</div>
			</div>
			<div class="c-card">
				<h3 class="u-p--24">MY GAMES</h3>
				<div class="c-card__body u-pt--2">
					<div class="">
						<div class="svg-pie">
							<svg width="50%" height="50%" viewBox="0 0 40 40">
								<circle class="donut-ring" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5"></circle>
								<circle class="donut-segment" cx="20" cy="20" r="15.91549430918954" fill="transparent"
									stroke-width="5" :stroke-dasharray="getPieProportions()" stroke-dashoffset="25"/>
								<text y="50%" transform="translate(0, 2)">
									<tspan x="50%" text-anchor="middle" class="donut-percent">{{ myStats?.win_rate}}%</tspan>	 
								</text>
								<text y="60%" transform="translate(0, 2)">
									<tspan x="50%" text-anchor="middle" class="donut-data">of wins</tspan>	 
								</text>
							</svg>
						</div>

					<ul class="c-list">
						<li class="u-mb--8">
							<div class="c-list__game-history u-text--small">
								<div class="u-text--overpass u-text--left">Date</div>
								<div class="u-text--overpass u-text--right">Score</div>
								<div class="u-text--overpass u-text--left">Opponent</div>
								<div class="u-text--overpass u-text--left">Mode</div>
							</div>
						</li>
						<div v-if="myGames.length" id="gameContent" class="scroll">
							<li v-for="(game, index) in myGames" :key="game.id" class="c-list__item-score">
								<div class="c-list__game-history">
									<div>
										<div class="u-bg--transparent u-text--mini u-text--overpass">{{ getDateStr(game.date) }}</div>
										<div class="u-bg--transparent u-text--mini u-text--italic u-text--grey">{{ getHourStr(game.date) }}</div>
									</div>
									<div class="u-text--right">
										<span class="c-game-history__score" :style="{ '--score-color': getScoreColor(game.winFlag)}"> {{ game.userScore }} - {{ game.opponentScore }} </span>
									</div>
									<div class="c-game-history__opponent">{{ game.opponent.username }}</div>
									<div class="u-text-left u-text--extra-small u-text--overpass">{{ game.mode }}</div>
								</div>
							</li>
						</div>
						<div v-else id="gameContent" class="empty_field">No game</div>
					</ul>


					</div>
				</div>
			</div>
		</div>
		<div class="l-grid__item">
			<div class="c-card">
				<div class="c-card__header">
					<h3>Leaderboard</h3>
					<div class="u-justify--right u-display--flex">
						<div class="radio-inputs" id="friends">
							<label class="radio"
							v-for="option in options"
							>
							<input
							autocomplete="off"
							type="radio"
							:value="option"
							name="friends"
							@click="fetchLeaderboard(option)"
							v-model="selectedOption"
							>
							<span class="name">{{ option }}</span>
							</label>
						</div>
					</div>
					<div/>
					<div class="u-justify--right u-display--flex">
						<div class= "searchForm">
						<input 
						v-model="search"
						name="searchUser"
						id="searchUser"
						type="text"
						autocomplete="off"
						placeholder="search..."
						>
					</div>
					</div>
				</div>
				<div class="c-card__body">
					<ul :key="playersDisplayed.length" class="c-list">
						<li class="c-list__item">
							<div class="c-list__grid">
								<div class="u-text--left u-text--small u-text--overpass">Rank</div>
								<div class="u-text--left u-text--small u-text--overpass">Username</div>
								<div class="u-text--right u-text--small u-text--overpass">Win Rate</div>
								<div class="u-text--right u-text--small u-text--overpass u-mr--8"># Wins</div>
							</div>
						</li>
						<div v-if="playersDisplayed.length" id="leaderboardContent" class="scroll"> 
							<li v-for="(player, index) in playersDisplayed" :key="player.id" class="c-list__item c-list__content">
								<div class="c-list__grid">
									<div :class="getRankClass(player.rank)">{{ player.rank }}</div>
									<div class="c-media">
										<div v-if="imagesLoaded" class="c-avatar-container">
											<img class="c-avatar c-media__img" :src="getAvatarSrc(player.id)" @click="goToProfile(player.username)" title="Go to profile"/>
											<img v-if="(player.id == me?.id) || (player.friend == true && !player.blocking)" class="c-avatar-icon" :src="getStatusIcon(player)"/>
										</div>
										<div class="c-media__content">
											<div>
												<a class="c-media__title u-text--overpass" @click="goToProfile(player.username)" title="Go to profile">{{ player.username }}</a>
											</div>
											<a v-if="player.id!=me?.id && !player.blocking" class="u-mr--8">
												<img src="../assets/images/racket-50.png" width='18em' height="18em" alt="invite-icon" title="Invite to play" v-on:click="inviteToPlay(player)">
											</a>
											<a v-if="player.id!=me?.id && !player.blocking" @click="sendMessage(player)" target="_blank">
												<img src="../assets/images/message-50.png" width='20em' height="20em" alt="message-icon" title="Send a message">
											</a>
										</div>
									</div>
									<div class="u-text--right c-stats u-mt--8">
										<p class="u-text--oswald">{{ player.win_rate }}%</p>
									</div>
									<div class="u-text--right c-stats u-mt--8 u-mr--8">
										<strong class="u-text--oswald">{{ player.wins }}</strong>
									</div>
								</div>
							</li>
						</div>
						<div v-else id="leaderboardContent" class="empty_field">No user</div>
					</ul>
          </div>
        </div>
      </div>
    </div>
	</div>

</template>

<style scoped>

h1,h2,h3,h4,h5,h6 {
	font-weight: 400;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	margin-top: 0.8rem;
	margin-bottom: 0.8rem;
	color: inherit;
	letter-spacing: 4px;
}

a {
	color: var(--c-teal);
	text-decoration: none;
	transition: all 120ms ease-out 0s;
	display: inline-block;
	border-radius: 0.4rem;
	font-size: 1.2rem;
	font-family: Overpass;
}
a:hover {
	background: var(--c-teal-dark);
	color: var(--c-teal);
	box-shadow: 0px 0px 0px 0.4rem var(--c-teal-dark);
}

button, textarea, input, select {
	font-family: inherit;
	color: inherit;
}
button:active, button:focus, textarea:active, textarea:focus, input:active, input:focus, select:active, select:focus {
	outline: 0;
}

button, select {
	cursor: pointer;
}

.l-wrapper {
	width: 100%;
	max-width: 960px;
	margin: auto;
	padding: 1.6rem 1.6rem 3.2rem;
}
@media screen and (max-width: 750px) {
	.l-wrapper {
		max-width: 450px;
	}
}

.l-grid {
	display: grid;
	grid-template-columns: 1.2fr 1.5fr;
	grid-column-gap: 1.6rem;
	grid-row-gap: 1.6rem;
	position: relative;
}
@media screen and (max-width: 750px) {
	.l-grid {
		grid-template-columns: 1fr;
	}
}

.l-grid__item {
	height: 650px;
	box-shadow: 0 1px 0 0 var(--c-black-light),0 -1px 0 0 var(--c-black-light);
	border-radius: 0.8rem;
	margin-bottom: 0.1rem;
	overflow: hidden;
}

.c-card {
	border-radius: 0.8rem;
	background: var(--c-surface);
	width: 100%;
	margin-bottom: 1.6rem;
	box-shadow: 0px 0px 0px 1px var(--c-black-light)
}
.c-card__body, .c-card__header {
	padding: 2.4rem;
}
@media screen and (max-width: 750px) {
	.c-card__body, .c-card__header {
		padding: 1.2rem;
	}
}

.c-card__header {
	display: grid;
	align-items: center;
	padding-bottom: 0;
	grid-template-columns: 1fr 1fr;
}

@media screen and (max-width: 750px) {
	.c-place {
		transform: translateY(4px);
	}
}

#profile-card {
	min-height: 219px;
}

#gameContent {
		height: 132px;
		overflow-y: auto;
}
@media screen and (min-width: 750px) and (max-width: 863px) {
	#gameContent {
		height: 157px;
		overflow-y: auto;
	}
}
@media screen and (max-width: 750px) {
	#gameContent {
		height: 175px;
		overflow-y: auto;
	}
}


#leaderboardContent {
	height: 470px;
	overflow-y: auto;
	overflow-x: hidden;
}
@media screen and (max-width: 750px) {
	#leaderboardContent {
		height: 500px;
	}
}

.svg-pie {
		width: 100%;
		font-size: 16px;
		margin: 0 auto;
		animation: donutfade 1s;
		align-items: center;
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
}

@keyframes donutfade {
	/* this applies to the whole svg item wrapper */
		0% {
				opacity: .2;
		}
		100% {
				opacity: 1;
		}
}

@media (max-width: 750px) {
		.svg-pie {
				width: 75%;
		}
}

.donut-ring {
		align-items: center;
		stroke: #EBEBEB;
}

.donut-segment {
		transform-origin: center;
		stroke: var(--c-pink);
		animation: donut 1s;
}


.donut-percent {
		font-family: "Oswald";
		fill: var(--c-pink);
		animation: donutfadelong 1s;
		font-size: 0.5em;
		line-height: 1;
		transform: translateY(0.5em);
		font-weight: 500;
}

@keyframes donutfadelong {
		0% {
				opacity: 0;
		}
		100% {
				opacity: 1;
		}
}

/* @keyframes donut {
		0% {
				stroke-dasharray: 0, 100;
		}
		100% {
				stroke-dasharray: 
		}
} */

.donut-data {
		font-size: 0.2em;
		line-height: 1;
		transform: translateY(0.5em);
		text-align: center;
		text-anchor: middle;
		color:white;
		fill: white;
		animation: donutfadelong 1s;
		font-family: Overpass;
}


.scroll::-webkit-scrollbar {
	width: 6px;
}

.scroll::-webkit-scrollbar-thumb {
	background-color: var(--c-grey);
	border-radius: 8px;
}

.scroll::-webkit-scrollbar-track {
	background-color: transparent;
}

.scroll::-webkit-scrollbar-thumb:hover,
.scroll::-webkit-scrollbar-thumb:active {
	background-color: var(--c-pink);
}

.scroll::-webkit-scrollbar-track:hover,
.scroll::-webkit-scrollbar-track:active {
	background-color: transparent;
}

.empty_field {
	display: flex;
	justify-content: center;
	font-family: Overpass;
	font-style: italic;
	font-size: 1.4rem;
}

.radio-inputs {
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    box-sizing: border-box;
    background-color: var(--c-black-light);
    box-shadow: 0 0 0 1px #0000000f;
    padding: 0.25rem;
    font-size: x-small;
    margin-bottom: 0.5rem;
	width: 120px;
}

.radio-inputs .radio {
  flex: 1 1 auto;
  text-align: center;
  width: 2.2em;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: none;
  padding: .5rem 0;
  color: #717171;
  transition: all .15s ease-in-out;
  font-family: Overpass;
  font-size: x-small;
}

.name {
  font-size: xx-small;
}

.radio-inputs .radio input:checked + .name {
  background-color: #fff;
}


.c-list {
	margin: 0;
	padding: 0;
	list-style-type: none;
}
.c-list__item-score {
	padding: 0.6rem 0;
}
.c-list__item {
	padding: 1.6rem 0;
}
.c-list__item .c-flag {
	margin-top: 0.8rem;
}
@media screen and (max-width: 750px) {
	.c-list__item .c-flag {
		margin-top: 0.4rem;
	}
}

@keyframes slideIn {
  0% {
    transform: translateX(+100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.c-list__content {
  animation: slideIn 0.5s ease-out forwards;
}

.c-list__content:nth-child(n+2) {
  animation-delay: 0.1s;
}

.c-list__content:nth-child(n+3) {
  animation-delay: 0.2s;
}

.c-list__content:nth-child(n+4) {
  animation-delay: 0.3s;
}

.c-list__content:nth-child(n+5) {
  animation-delay: 0.4s;
}

.c-list__content:nth-child(n+6) {
  animation-delay: 0.5s;
}

.c-list__grid {
	display: grid;
	grid-template-columns: 4.8rem 3fr 1fr 1fr;
	grid-column-gap: 2.4rem;
	overflow-x: hidden;
}
@media screen and (max-width: 750px) {
	.c-list__grid {
		grid-template-columns: 3.2rem 3fr 1fr 1fr;
		grid-column-gap: 0.8rem;
	}
}

.searchForm input {
    width: 100px;
    height: 10px;
    padding: 7px 10px;
    display: flex;
    justify-content: right;
    border-radius: 0.5rem;
    color: #fff;
    font-family: inherit;
    background-color: var(--c-black-light);
    border: 1px solid var(--c-black-light);
    font-family: Overpass;
	font-size: x-small;
}

.searchForm {
		justify-content: right;
		display: flex;
}

.searchForm input::placeholder {
	opacity: 0.5;
}

.searchForm input:focus {
	outline: none;
	border-color: #e81cff;
}

.c-list__game-history {
	display: grid;
	grid-template-columns: 1fr 1fr 1.8fr 1.3fr;
	grid-column-gap: 2.5rem;
	align-items: end;
	margin-left: 1rem;
	margin-right: 1rem;
}
@media screen and (min-width: 750px) and (max-width: 863px) {
	.c-list__game-history {
		grid-template-columns: 0.9fr 0.9fr 1.5fr 1fr;
		grid-column-gap: 1.2rem;
	}
}

.c-game-history__score {
	font-size: 1.4rem;
	font-family: Oswald;
	border-radius: 0.4rem;
	background: var(--score-color);
	box-shadow: 0.4rem 0 0 var(--score-color), -0.4rem 0 0 var(--score-color);
	border-right: 0.4rem solid var(--score-color);
	border-left: 0.4rem solid var(--score-color);
	margin-right: 0.4rem;
}

.c-game-history__opponent {
	font-size: 1.2rem;
	font-family: Overpass;
	justify-content: left;
	display: flex;
}

.win {
	font-weight: bold;
	color: var(--c-pink);
}

.c-media {
	display: inline-flex;
	align-items: center;
}
.c-media__content {
	padding-left: 1.6rem;
}
@media screen and (max-width: 700px) {
	.c-media__content {
		padding-left: 0.8rem;
	}
}
.c-media__title {
	margin-bottom: 0.4rem;
	font-size: 1.6rem;
	color: #fff;
	display: block;
	cursor: pointer;
}
@media screen and (max-width: 700px) {
	.c-media__title {
		font-size: 1.4rem;
	}
}

.c-avatar-container {
  position: relative;
  display: inline-block;
  padding: 2px;
}
.c-avatar {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 4.8rem;
	height: 4.8rem;
	box-shadow: 0 0 3px, 0 0 5px var(--c-black-light), 0 0 7px var(--c-black-light), 0 0 10px var(--c-black-light);
	border-radius: 50%;
	background: var(--lightest);
	color: var(--dark);
	object-fit: cover;
}
.c-avatar--lg {
	width: 8.5rem;
	height: 8.5rem;
}
.c-avatar-icon {
    position: absolute;
    bottom: 0.2rem;
    right: 0.1rem;
    width: 1.5rem;
    height: 1.5rem;
}
.c-media__img {
	cursor: pointer;
}
.c-button {
	display: inline-block;
	background: var(--dark);
	border: 0;
	border-radius: 0.4rem;
	padding: 1.2rem 2rem;
	transition: all 120ms ease-out 0s;
}
.c-button--block {
	display: block;
	width: 100%;
}
.c-button:hover, .c-button:focus {
	filter: brightness(0.9);
}
.c-button:focus {
	box-shadow: 0px 0px 0px 0.4rem var(--primary-trans);
}
.c-button:active {
	box-shadow: 0px 0px 0px 0.4rem var(--primary-trans), inset 0px 0px 0.8rem rgba(0, 0, 0, 0.2);
	filter: brightness(0.8);
}

.c-select {
	background: transparent;
	padding: 1.2rem;
	-webkit-appearance: none;
		 -moz-appearance: none;
					appearance: none;
	font-size: 1.4rem;
	border-color: rgba(255, 255, 255, 0.2);
	transition: all 120ms ease-out 0s;
}
.c-select:hover {
	background: var(--darkest);
}

.c-flag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 3.2rem;
	height: 3.2rem;
	background: var(--lightest);
	color: var(--dark);
	border-radius: 0.4rem;
}
@media screen and (max-width: 700px) {
	.c-flag {
		width: 2.4rem;
		height: 2.4rem;
	}
}

.c-button--light {
	background: var(--lightest);
}

.c-button--primary {
	background: var(--primary);
}

.c-button--dark {
	background: var(--darkest);
}

.c-button--transparent {
	background: transparent;
}

.c-button--medium {
	background: var(--medium);
}

.c-button--yellow {
	background: var(--yellow);
}

.c-button--orange {
	background: var(--orange);
}

.c-button--c-teal {
	background: var(--c-teal);
}

.c-button--light-gradient {
	background: linear-gradient(to top, var(--light), var(--lightest));
}

.u-text--oswald {
	font-family: "Oswald";
}

.u-text--overpass {
	font-family: Overpass, system-ui;
}

.u-text--italic {
	font-style: italic;
}

.u-text--left {
	text-align: left;
}
.u-text--center {
	text-align: center;
}
.u-text--right {
	text-align: right;
}


.u-text--grey {
	color: var(--c-grey) !important;
}

.u-bg--transparent {
	background: transparent !important;
}

.u-text--dark {
	color: var(--c-black-light);
		
}


.u-text--medium {
	font-size: 2rem;
	color: var(--medium) !important;
}

.u-bg--pink1 {
	background: var(--c-pink) !important;
}

.u-bg--pink3 {
	background: var(--c-pink-3) !important;
}

.u-bg--pink2 {
	background: var(--c-pink-2) !important;
}

.u-text--c-teal {
	color: var(--c-teal) !important;
}

.u-bg--light-gradient {
	background: linear-gradient(to top, var(--light), var(--lightest)) !important;
}

.u-text--light-gradient {
	color: linear-gradient(to top, var(--light), var(--lightest)) !important;
}

.u-display--flex {
	display: flex;
}

.u-align--center {
	align-items: center;
}

.u-justify--center {
	justify-content: center;
}

.u-justify--right {
	justify-content: right;
}

.u-align--flex-end {
	align-items: flex-end;
}

.u-justify--flex-end {
	justify-content: flex-end;
}

.u-align--flex-start {
	align-items: flex-start;
}

.u-justify--flex-start {
	justify-content: flex-start;
}

.u-align--space-between {
	align-items: space-between;
}

.u-justify--space-between {
	justify-content: space-between;
}

.u-text--small {
	font-size: 1.4rem;
}

.u-text--extra-small {
	font-size: 1.2rem;
}
.u-text--mini {
	font-size: 1.1rem;
}

.u-p--24 {
	padding-left: 2.4rem;
	padding-right: 2.4rem;
	padding-top: 2.4rem;
}

.u-pl--2 {
	padding-left: 0.2rem;
}

.u-ml--2 {
	margin-left: 0.2rem;
}

.u-pr--2 {
	padding-right: 0.2rem;
}

.u-mr--2 {
	margin-right: 0.2rem;
}

.u-pb--2 {
	padding-bottom: 0.2rem;
}

.u-mb--2 {
	margin-bottom: 0.2rem;
}

.u-pt--2 {
	padding-top: 0.2rem;
}

.u-mt--2 {
	margin-top: 0.2rem;
}

.u-pl--4 {
	padding-left: 0.4rem;
}

.u-ml--4 {
	margin-left: 0.4rem;
}

.u-pr--4 {
	padding-right: 0.4rem;
}

.u-mr--4 {
	margin-right: 0.4rem;
}

.u-pb--4 {
	padding-bottom: 0.4rem;
}

.u-mb--4 {
	margin-bottom: 0.4rem;
}

.u-pt--4 {
	padding-top: 0.4rem;
}

.u-mt--4 {
	margin-top: 0.4rem;
}

.u-pl--8 {
	padding-left: 0.8rem;
}

.u-ml--8 {
	margin-left: 0.8rem;
}

.u-pr--8 {
	padding-right: 0.8rem;
}

.u-mr--8 {
	margin-right: 0.8rem;
}

.u-pb--8 {
	padding-bottom: 0.8rem;
}

.u-mb--8 {
	margin-bottom: 0.8rem;
}

.u-pt--8 {
	padding-top: 0.8rem;
}

.u-mt--8 {
	margin-top: 0.8rem;
}

.u-pl--16 {
	padding-left: 1.6rem;
}

.u-ml--16 {
	margin-left: 1.6rem;
}

.u-pr--16 {
	padding-right: 1.6rem;
}

.u-mr--16 {
	margin-right: 1.6rem;
}

.u-pb--16 {
	padding-bottom: 1.6rem;
}

.u-mb--16 {
	margin-bottom: 1.6rem;
}

.u-pt--16 {
	padding-top: 1.6rem;
}

.u-mt--16 {
	margin-top: 1.6rem;
}

.u-pl--24 {
	padding-left: 2.4rem;
}

.u-ml--24 {
	margin-left: 2.4rem;
}

.u-pr--24 {
	padding-right: 2.4rem;
}

.u-mr--24 {
	margin-right: 2.4rem;
}

.u-pb--24 {
	padding-bottom: 2.4rem;
}

.u-mb--24 {
	margin-bottom: 2.4rem;
}

.u-pt--24 {
	padding-top: 2.4rem;
}

.u-mt--24 {
	margin-top: 2.4rem;
}

.u-pl--32 {
	padding-left: 3.2rem;
}

.u-ml--32 {
	margin-left: 3.2rem;
}

.u-pr--32 {
	padding-right: 3.2rem;
}

.u-mr--32 {
	margin-right: 3.2rem;
}

.u-pb--32 {
	padding-bottom: 3.2rem;
}

.u-mb--32 {
	margin-bottom: 3.2rem;
}

.u-pt--32 {
	padding-top: 3.2rem;
}

.u-mt--32 {
	margin-top: 3.2rem;
}

</style>
