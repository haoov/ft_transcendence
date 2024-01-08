<script setup lang="ts">

import axios from "axios";
import type { UserStat, User } from "@/utils";
import { computed, onMounted, ref } from "vue";

let customers = ref<UserStat[]>([]);
let me = ref<User>();
let myStats = ref<UserStat>();

function fetchLeaderboard() {
  axios
    .get("http://localhost:3000/api/home/leaderboard")
    .then(data => { customers.value = data.data;});
}

function fetchMyStats() {
  axios
    .get("http://localhost:3000/api/user/me")
    .then(data => { 
      me.value = data.data;
      const url: string = "http://localhost:3000/api/home/stats/" + data.data.username;
      axios.get(url).then( data => {
        myStats.value = data.data;})
      });
}

function  getRankClass(index: number) : string {
  let className = "c-flag c-place u-bg--transparent"
  switch (index) {
    case 0:
      className += " u-text--dark u-bg--yellow";
      break;
    case 1:
      className += " u-text--dark u-bg--teal"
      break;
    case 2:
      className += " u-text--dark u-bg--orange"
      break;
  }
  return className;
}

function  getAvatarSrc(index: number) : string {
  return customers.value[index].avatar;
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

  onMounted(() => {
    fetchMyStats();
    fetchLeaderboard();
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
              <img class="c-avatar c-avatar--lg" :src="getMyAvatarSrc()"/>
              <div class="u-text--medium u-mt--16">{{ me?.username }}</div>
              <span class="u-text--teal u-text--small">{{ me?.email}} </span>
            </div>
            <div class="u-text--right">
                <div class="u-mt--16 u-text--small">My Rank</div>
                <h2>{{ myStats?.rank }}</h2>
                <div class="u-mt--24 u-text--small">My Wins</div>
                <h2>{{ myStats?.wins }}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="c-card">
        <div class="c-card__body">
          <div class="u-display--flex u-justify--space-between">
            <div class="svg-pie">
              <svg width="100%" height="100%" viewBox="0 0 40 40" class="donut">
                <!-- <circle class="donut-hole" cx="20" cy="20" r="15.91549430918954" fill="#fff"></circle> -->
                <circle class="donut-ring" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5"></circle>
                <circle class="donut-segment" cx="20" cy="20" r="15.91549430918954" fill="transparent"
                        stroke-width="5" :stroke-dasharray="getPieProportions()" stroke-dashoffset="25"
                        :style="{ animation: 'donut 1s', '--end-dash': getPieProportions()}"></circle>
                <g class="donut-text">
                  <text y="50%" transform="translate(0, 2)">
                    <tspan x="50%" text-anchor="middle" class="donut-percent">{{ myStats?.win_rate}}%</tspan>   
                  </text>
                  <text y="60%" transform="translate(0, 2)">
                    <tspan x="50%" text-anchor="middle" class="donut-data">{{ myStats?.wins}} wins</tspan>   
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="l-grid__item">
      <div class="c-card">
        <div class="c-card__header">
          <h3>Leaderboard</h3>
          <select class="c-select">
            <!-- <option selected="selected">Sunday, Feb. 23 - Sunday, Feb. 30</option> -->
          </select>
        </div>
        <div class="c-card__body">
          <ul class="c-list" id="list">
            <li class="c-list__item">
              <div class="c-list__grid">
                <div class="u-text--left u-text--small u-text--medium">Rank</div>
                <div class="u-text--left u-text--small u-text--medium">Username</div>
                <div class="u-text--right u-text--small u-text--medium">Win Rate</div>
                <div class="u-text--right u-text--small u-text--medium"># of Wins</div>
              </div>
            </li>
                <!-- premier element -->
            <li v-for="(customer, index) in customers" :key="customer.id" class="c-list__item">
              <div class="c-list__grid">
                <div :class="getRankClass(index)">{{ index + 1 }}</div>
                <div class="c-media">
                  <img class="c-avatar c-media__img" :src="getAvatarSrc(index)"/>
                  <div class="c-media__content">
                    <div class="c-media__title">{{ customer.username }}</div>
                    <a class="c-media__link u-text--small" href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.referenseo.com%2Fblog%2F10-banques-images-gratuites-libre-droits%2F&psig=AOvVaw25Ea8wtAGoYEVdwfqoI7vp&ust=1704535954697000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCODrjbOBxoMDFQAAAAAdAAAAABAI" target="_blank">lien</a>
                  </div>
                </div>
                <div class="u-text--right c-stats u-mt--8">
                  <p>{{ customer.win_rate }}%</p>
                </div>
                <div class="u-text--right c-stats u-mt--8">
                  <strong>{{ customer.wins }}</strong>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>



</template>

<style>


html {
  --black: #000000;
  --white: #ffffff;
  --darkest: #101010;
  --darker: #16171A;
  --dark: #A3AFBF;
  --medium: #DFE7EF;
  --light: #CAD4E1;
  --lighter: #F5F8FC;
  --lightest: var(--white);
  --primary: #7B16FF;
  --primary-light: #DDD9FF;
  --primary-trans: rgba(123,22,255,0.4);
  --yellow: #FDCB6E;
  --orange: #E17055;
  --teal: #00CEC9;
  --bg: var(--darkest);
  --color: var(--lightest);
  --surface: var(--darker);
}

html {
  font-size: 62.5%;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  background: var(--bg);
  color: var(--color);
  font-size: 1.6rem;
  font-family: Overpass, system-ui !important;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
  font-family: "Oswald", system-ui !important;
  color: inherit;
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: all 120ms ease-out 0s;
  display: inline-block;
  border-radius: 0.4rem;
}
a:hover {
  background: var(--primary-trans);
  color: var(--primary-light);
  box-shadow: 0px 0px 0px 0.4rem var(--primary-trans);
}

button, textarea, input, select {
  font-family: inherit !important;
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
    stroke: #EBEBEB;
}

.donut-segment {
    transform-origin: center;
    stroke: #ed1e79;
    animation: donut 1s;
}

.segment-1{fill:#ed1e79;}

.donut-percent {
    animation: donutfadelong 1s;
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

.donut-text {
    font-family: Arial, Helvetica, sans-serif;
    fill: #ed1e79;
}

.donut-label {
    font-size: 0.28em;
    font-weight: 700;
    line-height: 1;
    fill: #000;
    transform: translateY(0.25em);
}

.donut-percent {
    font-size: 0.5em;
    line-height: 1;
    transform: translateY(0.5em);
    font-weight: bold;
}

.donut-data {
    font-size: 0.12em;
    line-height: 1;
    transform: translateY(0.5em);
    text-align: center;
    text-anchor: middle;
    color:#666;
    fill: #666;
    animation: donutfadelong 1s;
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

.c-card {
  border-radius: 0.8rem;
  background: var(--surface);
  width: 100%;
  margin-bottom: 1.6rem;
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.12);
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

.c-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
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
  box-shadow: inset 0px 0px 0px 1px currentColor;
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
  width: 9.6rem;
  height: 9.6rem;
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

.c-button--teal {
  background: var(--teal);
}

.c-button--light-gradient {
  background: linear-gradient(to top, var(--light), var(--lightest));
}

.u-text--title {
  font-family: "Oswald", system-ui;
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

.u-bg--light {
  background: var(--lightest) !important;
}

.u-text--light {
  color: var(--lightest) !important;
}

.u-bg--primary {
  background: var(--primary) !important;
}

.u-text--primary {
  color: var(--primary) !important;
}

.u-bg--dark {
  background: var(--darkest) !important;
}

.u-text--dark {
  color: var(--darkest) !important;
}

.u-bg--transparent {
  background: transparent !important;
}

.u-text--transparent {
  color: transparent !important;
}

.u-bg--medium {
  background: var(--medium) !important;
}

.u-text--medium {
  font-size: 2rem;
  color: var(--medium) !important;
}

.u-bg--yellow {
  background: var(--yellow) !important;
}

.u-text--yellow {
  color: var(--yellow) !important;
}

.u-bg--orange {
  background: var(--orange) !important;
}

.u-text--orange {
  color: var(--orange) !important;
}

.u-bg--teal {
  background: var(--teal) !important;
}

.u-text--teal {
  color: var(--teal) !important;
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
