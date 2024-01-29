<script setup lang="ts">
	import { RouterView } from 'vue-router'
	import v_notify from './notify/components/notify.vue';
	import v_miniChat from './chat/components/miniChat/miniChat.vue';
</script>

<template>
	<RouterView></RouterView>
	<v_miniChat></v_miniChat>
	<v_notify></v_notify>
</template>
