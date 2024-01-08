<script setup lang="ts">

import axios from "axios";
import type { UserStat, User } from "@/utils";
import {onMounted, ref } from "vue";

let me = ref<User>();
let myStats = ref<UserStat>();


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


function  getMyAvatarSrc() : string | undefined {
  return me.value?.avatar;
}

  onMounted(() => {
    fetchMyStats();
  });
</script>

<template>
<div class="svg-pie">
	<svg width="100%" height="100%" viewBox="0 0 40 40" class="donut">
	<circle class="donut-hole" cx="20" cy="20" r="15.91549430918954" fill="#fff"></circle>
	<circle class="donut-ring" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5"></circle>
	<circle class="donut-segment donut-segment-2" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5" stroke-dasharray="50 50" stroke-dashoffset="25"></circle>
	<g class="donut-text donut-text-1">
		<text y="50%" transform="translate(0, 2)">
		<tspan x="50%" text-anchor="middle" class="donut-percent">69%</tspan>   
		</text>
		<text y="60%" transform="translate(0, 2)">
		<tspan x="50%" text-anchor="middle" class="donut-data">3450 widgets</tspan>   
		</text>
	</g>
	</svg>
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
    stroke: #FF6200;
}

.donut-segment-2 {
    stroke: aqua;
    animation: donut1 3s;
}

.donut-segment-3 {
    stroke: #d9e021;
    animation: donut2 3s;
}

.donut-segment-4 {
    stroke: #ed1e79;
    animation: donut3 3s;
}

.segment-1{fill:#ccc;}
.segment-2{fill:aqua;}
.segment-3{fill:#d9e021;}
.segment-4{fill:#ed1e79;}

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

@keyframes donut1 {
    0% {
        stroke-dasharray: 0, 100;
    }
    100% {
        stroke-dasharray: 50, 50;
    }
}

@keyframes donut2 {
    0% {
        stroke-dasharray: 0, 100;
    }
    100% {
        stroke-dasharray: 30, 70;
    }
}

@keyframes donut3{
    0% {
        stroke-dasharray: 0, 100;
    }
    100% {
        stroke-dasharray: 1, 99;
    }
}

.donut-text {
    font-family: Arial, Helvetica, sans-serif;
    fill: #FF6200;
}
.donut-text-1 {
    fill: aqua;
}
.donut-text-2 {
    fill: #d9e021;
}
.donut-text-3 {
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
