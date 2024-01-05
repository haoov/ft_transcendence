<script setup lang="ts">
	defineProps(["p1", "p2"]);
</script>

<template>

<div class="score-container">
		<div class="score-div p2">
			<span class="score p2">{{ p2.score }}</span>
			<img class="avatar">
			<span class="username">{{ p2.username }}</span>
		</div>
		<span>VS</span>
		<div class="score-div p1">
			<span class="username">{{ p1.username }}</span>
			<img class="avatar" :src="p1.avatar">
			<span class="score p1">{{ p1.score }}</span>
		</div>
	</div>

</template>

<style scoped>
	.score-container {
		display: flex;
		width: 720px;
		margin-top: 20px;
		justify-content: space-between;
		align-items: center;
	}

	.score-div {
		display: flex;
		width: 300px;
		align-items: flex-end;
	}

	.score-div.p2 {
		justify-content: flex-start;
	}

	.score-div.p1 {
		justify-content: flex-end;
	}

	.avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.username {
		padding: 0px 10px 0px 10px;
	}

	.score {
		font-size: xx-large;
	}

	.score.p1 {
		padding-left: 25px;
	}

	.score.p2 {
		padding-right: 25px;
	}
</style>