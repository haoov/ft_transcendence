import { ref, watch, type Ref } from "vue";

const eventBus: Ref<Map<string, any[]>> = ref(new Map<string, any[]>())

function emit(event: string, ...args: any[]) {
	eventBus.value.set(event, args);
}

function on(event: string, callback: (...args: any[]) => void) {
	watch(() => eventBus.value.get(event), (args) => {
		if (args)
			callback(...args);
	});
}

export default { emit, on };