<script setup lang="ts">
	import Settings from '@/components/settings.vue';
  import navigationBar from '@/components/navigationBar.vue';
	import v_miniChat from '@/chat/components/miniChat/miniChat.vue';
	import v_notify from '@/notify/components/notify.vue';
</script>

<template>
    <div class="setting-body">
	    <navigationBar></navigationBar>
      <Suspense><Settings></Settings></Suspense>
			<v_miniChat></v_miniChat>
			<v_notify></v_notify>
    </div>
</template>

<style>

    .setting-body {
        overflow-x: hidden;
        height: 100%;
        background: linear-gradient(	to right,
                                        var(--c-black),
                                        var(--c-blue-dark),
                                        var(--c-black)	);
    }


</style>
