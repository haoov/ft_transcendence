<script setup lang="ts">
	import Settings from '@/components/settings.vue';
    import navigationBar from '@/components/navigationBar.vue';
</script>

<template>
    <div class="setting-body">
	    <navigationBar></navigationBar>
        <Suspense><Settings></Settings></Suspense>
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
