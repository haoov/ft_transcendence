<template>
	<div class="modal-channel-form-container">
		<div>
			<nav>
				<ul>
					<li
						@click="switchForm('New')"
						:class="{ 'active': selectedOption === 'New' }"
					>New</li>
					<li
						@click="switchForm('Join')"
						:class="{ 'active': selectedOption === 'Join' }"
					>Join</li>
				</ul>
			</nav>
		</div>
		<div>
			<Suspense>
				<NewChannelForm v-if="selectedOption === 'New'"></NewChannelForm>
				<JoinChannelForm v-if="selectedOption === 'Join'"></JoinChannelForm>
			</Suspense>
		</div>
	</div>
</template>

<script setup lang="ts">
import NewChannelForm from './NewChannelForm.vue';
import JoinChannelForm from './JoinChannelForm.vue';
import { ref } from 'vue';

const selectedOption = ref('New');

const switchForm = (option: string) => {
	selectedOption.value = option;
}

</script>

<style scoped>

.modal-channel-form-container {
  width: 350px;
  background: linear-gradient(#212121, #212121) padding-box,
              linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
  border: 2px solid transparent;
  padding: 32px 24px;
  font-size: 14px;
  font-family: inherit;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  border-radius: 16px;
  background-size: 200% 100%;
  animation: gradient 10s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

ul {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
}

li {
  color: #717171;
  font-weight: 600;
  font-size: 16px;
  list-style: none;
  cursor: pointer;
}

li.active {
    text-decoration: underline;
    text-decoration-color: #e81cff; /* change to your preferred color */
    text-decoration-thickness: 2px; /* adjust as needed */
    text-underline-offset: 5px; /* adjust as needed */
    animation: underline-animation 10s infinite; /* adjust as needed */
}

@keyframes underline-animation {
    0% { text-decoration-color: #e81cff; }
    50% { text-decoration-color: #40c9ff; }
    100% { text-decoration-color: #e81cff; }
}

</style>
