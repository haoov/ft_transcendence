<template>
	<div class="modal-background">
		<div class="modal-foreground">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped>

.modal-background {
	width: 100%;
	height: 100%;
	background-color: transparent;
	backdrop-filter: blur(5px);
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal-foreground {
	width: fit-content;
	height: fit-content;
	border-radius: 10px;
	padding: 20px;
}

</style>
