<script setup lang="ts">

import axios from "axios";
import { type UserStat, type User, type GameStat, ServerEvents } from "@/utils";
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import router from '@/router';
import offline from '../assets/images/status-offline-32.png';
import online from '../assets/images/status-online-32.png';
import playing from '../assets/images/status-playing-32.png';
import blocked from '../assets/images/status-blocked-32.png';
import { type SocketManager } from "@/SocketManager";

const route = useRoute();
let username = route.params.username;
const me = ref<User>();
const user = ref<User>();
const userStats = ref<UserStat>();
const userGames = ref<GameStat[]>([]);
const socketManager: SocketManager = inject('socketManager') as SocketManager;

socketManager.addEventListener("user", ServerEvents.dataChanged, async (newUser: User) => {
	if (user.value?.id == newUser.id) {
		if (newUser.username != username) {
			username = newUser.username;
			await fetchUser();  
			router.push(`/${newUser.username}`);
		}
		else
			await fetchUser();
	}
});

// FETCHING DATA
async function fetchUser() {
	axios
		.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user?username=${username}`)
		.then( (data) => {
			user.value = data.data;
			// Fetch user stats
			const url1: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/home/stats/${data.data.id}`;
				axios.get(url1).then( data => {
				userStats.value = data.data;})
			// Fetch my games
			const url2: string = `http://${import.meta.env.VITE_HOSTNAME}:3000/api/home/game-history/${data.data.id}`;
			axios.get(url2).then( data => {
				userGames.value = data.data;})
			});
}

async function fetchMe() {
	axios
		.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`)
		.then( (data) => {
			me.value = data.data;
		});
}


// UTIL FUNCTIONS
function	getAvatarSrc() : string | undefined {
		const timestamp = Date.now();
		if (user.value?.avatar.includes(':3000/api/user/avatar/'))
			return `${user.value.avatar}?${timestamp}`;
		else
			return user.value?.avatar
}

function getStatusIcon() : string {
	// Faire option forbidden
	if (user.value?.status == "undefined" || user.value?.status == "offline")
		return offline;
	else
		return online;
}

function getStatusTitle() : string {
	// Faire option forbidden
	if (user.value?.status == "undefined" || user.value?.status == "offline")
		return "offline";
	else
		return "online";
}

function getPieProportions() : string {
	let loses: number = 0;
	if (userStats.value)
		loses = 100 - userStats.value.win_rate; 
	return userStats.value?.win_rate.toString() + " " + loses.toString();
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

onMounted(async () => {
	await fetchUser();
	await fetchMe();
});



</script>

<template>
<div class="l-wrapper">
	<div class="l-grid">
		<div class="l-grid__item l-grid__item--sticky">
			<div class="c-card" id="profile">
				<!-- <h3 class="u-p--24">PROFILE</h3> -->
				<div class="c-card__body">
					<div class="u-display--flex u-justify--space-between">
						<div class="u-text--left">
							<div class="c-avatar-container u-ml--24">
								<img class="c-avatar c-avatar--lg" :src="getAvatarSrc()"/>
								<img v-if="user" class="c-avatar-icon" :src="getStatusIcon()" :title="getStatusTitle()"/>
							</div>
							<div class="u-text--medium u-mt--16 u-text--overpass u-ml--24">{{ user?.username }}</div>
							<span class="u-text--c-teal u-mt--16 u-text--small u-text--overpass u-ml--24">{{ user?.email}} </span>
							<div class="u-ml--24 u-mt--4">
								<a v-if="user?.id!=me?.id" class="u-mr--8" href="https://www.google.com/" target="_blank">
									<img src="../assets/images/racket-50.png" width='18em' height="18em" alt="invite-icon" title="Invite to play">
								</a>
								<a v-if="user?.id!=me?.id" href="https://www.google.com/" target="_blank">
									<img src="../assets/images/message-50.png" width='20em' height="20em" alt="message-icon" title="Send a message">
								</a>
							</div>
						</div>
						<div class="u-text--right">
								<div class="u-mt--16 u-text--small u-text--overpass">Rank</div>
								<h2 class="u-text--oswald">{{ userStats?.rank }}</h2>
								<div class="u-mt--24 u-text--small u-text--overpass">Wins</div>
								<h2 class="u-text--oswald">{{ userStats?.wins }}</h2>
						</div>
					</div>
				</div>
			</div>
			<div class="c-card">
				<h3 class="u-p--24">GAMES</h3>
				<div class="c-card__body u-pt--2">
					<div class="">
						<div class="svg-pie">
							<svg width="50%" height="50%" viewBox="0 0 40 40">
								<circle class="donut-ring" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5"></circle>
								<circle class="donut-segment" cx="20" cy="20" r="15.91549430918954" fill="transparent"
												stroke-width="5" :stroke-dasharray="getPieProportions()" stroke-dashoffset="25"
												:style="{ animation: 'donut 1s', '--end-dash': getPieProportions()}"></circle>
								<text y="50%" transform="translate(0, 2)">
									<tspan x="50%" text-anchor="middle" class="donut-percent">{{ userStats?.win_rate}}%</tspan>	 
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
						<div v-if="userGames.length" id="gameContent" class="scroll">
							<li v-for="(game, index) in userGames" :key="game.id" class="c-list__item-score">
								<div class="c-list__game-history">
									<div>
										<div class="u-bg--transparent u-text--mini u-text--overpass">{{ getDateStr(game.date) }}</div>
										<div class="u-bg--transparent u-text--mini u-text--italic u-text--grey">{{ getHourStr(game.date) }}</div>
									</div>
									<div class="u-text--right">
										<span class="c-game-history__score" :style="{ '--score-color': getScoreColor(game.winFlag)}"> {{ game.userScore }} - {{ game.opponentScore }} </span>
									</div>
									<div class="c-game-history__opponent">{{ game.opponent.username }}</div>
									<div class="u-text-left u-text--extra-small u-text--overpass">{{ game.type }}</div>
								</div>
							</li>
						</div>
						<div v-else id="gameContent" class="empty_field">No game</div>
					</ul>


					</div>
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
	max-width: 450px;
	margin: auto;
	padding: 1.6rem 1.6rem 3.2rem;
}

.l-grid {
	display: grid;
	grid-template-columns: 1fr;
	grid-column-gap: 1.6rem;
	grid-row-gap: 1.6rem;
	position: relative;
}

.l-grid__item {
	grid-template-columns: 0.9fr 0.9fr 1.5fr 1fr;
	grid-column-gap: 1.2rem;
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
.c-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 0;
	flex-direction: column;
}

#profile {
	min-height: 228px;
}

#gameContent {
		height: 175px;
		overflow-y: auto;
}


.svg-pie {
		width: 75%;
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

.donut-ring {
		align-items: center;
		stroke: #EBEBEB;
}
small-image
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

@keyframes donut {
		0% {
				stroke-dasharray: 0, 100;
		}
		100% {
				stroke-dasharray: var(--end-dash);
		}
}

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
small-image
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
	margin-top: 0.4rem;
}
.c-list__grid {
	display: grid;
	grid-template-columns: 3.2rem 3fr 1fr 1fr;
	grid-column-gap: 0.8rem;
}


.c-list__game-history {
	display: grid;
	grid-template-columns: 0.9fr 0.9fr 1.5fr 1fr;
	grid-column-gap: 1.2rem;
	align-items: end;
	margin-left: 1rem;
	margin-right: 1rem;
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
	font-weight: bold;    box-shadow: 0 0 3px,0 0 5px var(--c-black-light),0 0 7px var(--c-black-light),0 0 10px var(--c-black-light);
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
}
@media screen and (max-width: 700px) {
	.c-media__title {
		font-size: 1.4rem;
	}
}

.c-avatar-container {
  position: relative;
  display: inline-block;
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
	bottom: 0.5rem;
	right: 0.5rem;
	width: 2rem;
	height: 2rem;
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
