<template>
    <div class="circle-container">
        <p>CH</p>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
	channel: {
		type: Object,
	}
});

</script>

<style scoped>
.circle-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #527a3f;
  display: flex;
  align-items: center;
  justify-content: center;
}

p {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  margin: 0;

}
</style>