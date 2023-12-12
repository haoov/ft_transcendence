<template>
	<div class="header-channel">
    <ChannelWidget></ChannelWidget>
		<p>Channel 1</p>
	</div>
</template>

<script setup lang="ts">
import ChannelWidget from '@/components/chatComp/ChannelWidget';
</script>

<style scoped>
.header-channel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: #e0e0e0;
  box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff;
}

/*Need to change that */
p {
  font-size: 3rem;
  color: #000000;
  margin: auto;
}
</style>