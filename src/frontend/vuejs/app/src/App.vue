<script setup lang="ts">
	import { RouterView } from 'vue-router'
	import v_notify from './notify/components/notify.vue';
</script>

<template>
	<RouterView></RouterView>
	<v_notify></v_notify>
</template>
