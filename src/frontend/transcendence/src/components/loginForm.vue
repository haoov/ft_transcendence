<template>
	<form>
		<div class>
			<input tabindex="1" id="username" class name="username" value type="text" autocomplete="off" placeholder="Username" aria-invalid="true">
		</div>
		<div class>
			<input tabindex="2" id="password" class name="password" value type="password" autocomplete="off" placeholder="Password" aria-invalid="true">
		</div>
	</form>
</template>

<style>
	#username, #password {
		margin-bottom: 25px;
		padding: 10px 10px 3px 10px;
		border: 1px solid var(--c-white);
		width: calc(100% - 30px);
		background-color: rgba(81, 79, 79, 0.2);
		font-size: 120%;
	}
</style>