<script setup lang="ts">

import axios from "axios";
import type { UserStat, User, GameStat } from "@/utils";
import { computed, onMounted, ref } from "vue";

const players = ref<UserStat[]>([]);
const imagesLoaded = ref<boolean>(false);
const me = ref<User>();
const myStats = ref<UserStat>();
const myGames = ref<GameStat[]>([]);
const search = ref('');

const playersDisplayed = computed(() => {
    if (search.value.length === 0) {
        return players.value;
    } else {
        return players.value.filter((user: UserStat) => {
            return user.username.toLowerCase().startsWith(search.value.toLowerCase());
        });
    }
});


// FETCHING DATA
async function fetchLeaderboard() {
  await axios
    .get("http://localhost:3000/api/home/leaderboard")
    .then(data => { players.value = data.data;});
}

async function fetchMe() {
  await axios
    .get("http://localhost:3000/api/user/me")
    .then( (data) => { 
      me.value = data.data;
      // Fetch my stats
      const url1: string = `http://localhost:3000/api/home/stats/${data.data.id}`;
        axios.get(url1).then( data => {
        myStats.value = data.data;})
      // Fetch my games
      const url2: string = `http://localhost:3000/api/home/game-history/${data.data.id}`;
      axios.get(url2).then( data => {
        myGames.value = data.data;})
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
function  getRankClass(index: number) : string {
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

function  getAvatarSrc(id: number) : string {
  const user = players.value.filter((user) => {
    return user.id == id;
  });
  return user[0].avatar;
}

function  getMyAvatarSrc() : string | undefined {
  return me.value?.avatar;
}

function getPieProportions() : string {
  let loses: number = 0;
  if (myStats.value)
    loses = 100 - myStats.value.win_rate; 
  return myStats.value?.win_rate.toString() + " " + loses.toString();
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
  await fetchMe();
  await fetchLeaderboard();
  loadAllImages();
});

</script>

<template>
<div class="l-wrapper">
  <div class="l-grid">
    <div class="l-grid__item l-grid__item--sticky">
      <div class="c-card">
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
                        stroke-width="5" :stroke-dasharray="getPieProportions()" stroke-dashoffset="25"
                        :style="{ animation: 'donut 1s', '--end-dash': getPieProportions()}"></circle>
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
    <div class="l-grid__item">
      <div class="c-card">
        <div class="c-card__header">
          <h3>Leaderboard</h3>
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
        <div class="c-card__body">
          <ul class="c-list">
            <li class="c-list__item">
              <div class="c-list__grid">
                <div class="u-text--left u-text--small u-text--overpass">Rank</div>
                <div class="u-text--left u-text--small u-text--overpass">Username</div>
                <div class="u-text--right u-text--small u-text--overpass">Win Rate</div>
                <div class="u-text--right u-text--small u-text--overpass u-mr--8"># Wins</div>
              </div>
            </li>
            <div v-if="playersDisplayed.length" id="leaderboardContent" class="scroll"> 
              <!-- premier element -->
              <li v-for="(player, index) in playersDisplayed" :key="player.id" class="c-list__item">
                <div class="c-list__grid">
                  <div :class="getRankClass(player.rank)">{{ player.rank }}</div>
                  <div class="c-media">
                    <img v-if="imagesLoaded" class="c-avatar c-media__img" :src="getAvatarSrc(player.id)"/>
                    <div class="c-media__content">
                      <div class="c-media__title u-text--overpass">{{ player.username }}</div>
                      <a v-if="player.id!=me?.id" class="u-mr--8" href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.referenseo.com%2Fblog%2F10-banques-images-gratuites-libre-droits%2F&psig=AOvVaw25Ea8wtAGoYEVdwfqoI7vp&ust=1704535954697000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCODrjbOBxoMDFQAAAAAdAAAAABAI" target="_blank">
                        <img src="../assets/images/racket-50.png" width='18em' height="18em" alt="invite-icon" title="Invite to play">
                      </a>
                      <a v-if="player.id!=me?.id" href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.referenseo.com%2Fblog%2F10-banques-images-gratuites-libre-droits%2F&psig=AOvVaw25Ea8wtAGoYEVdwfqoI7vp&ust=1704535954697000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCODrjbOBxoMDFQAAAAAdAAAAABAI" target="_blank">
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

@media (min-width: 992px) {
    .svg-pie {
        width: 80%;
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

.l-wrapper {
  width: 100%;
  max-width: 960px;
  margin: auto;
  padding: 1.6rem 1.6rem 3.2rem;
}

.l-grid {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr;
  grid-column-gap: 1.6rem;
  grid-row-gap: 1.6rem;
  position: relative;
}
@media screen and (max-width: 700px) {
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
@media screen and (max-width: 700px) {
  .c-card__body, .c-card__header {
    padding: 1.2rem;
  }
}
.c-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0;
}
@media screen and (max-width: 700px) {
  .c-card__header {
    flex-direction: column;
  }
}

@media screen and (max-width: 700px) {
  .c-place {
    transform: translateY(4px);
  }
}

#gameContent {
    height: 160px;
    overflow-y: auto;
}

#leaderboardContent {
  height: 500px;
  overflow-y: auto;
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
@media screen and (max-width: 700px) {
  .c-list__item .c-flag {
    margin-top: 0.4rem;
  }
}
.c-list__grid {
  display: grid;
  grid-template-columns: 4.8rem 3fr 1fr 1fr;
  grid-column-gap: 2.4rem;
}
@media screen and (max-width: 700px) {
  .c-list__grid {
    grid-template-columns: 3.2rem 3fr 1fr 1fr;
    grid-column-gap: 0.8rem;
  }
}

.searchForm input {
  width: 80%;
  padding: 4% 7%;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  background-color: var(--c-black-light);
  border: 1px solid var(--c-black-light);
  font-family: Overpass;
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
  grid-template-columns: .9fr 1fr 2fr 1.5fr;
  grid-column-gap: 2.5rem;
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
}
@media screen and (max-width: 700px) {
  .c-media__title {
    font-size: 1.4rem;
  }
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
}
@media screen and (max-width: 700px) {
  .c-avatar {
    width: 3.2rem;
    height: 3.2rem;
  }
}
.c-avatar--lg {
  width: 8.5rem;
  height: 8.5rem;
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
@media screen and (max-w idth: 700px) {
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