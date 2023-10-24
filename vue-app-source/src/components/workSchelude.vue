
<script>

	export default {
		props: {
			workSchelude: Array
		}
		,emits: ['change']
		,methods: {
			selectOption(e) {

				this.$emit('change', {
					value: e.currentTarget.value
					,name: e.currentTarget.name
				});

			}
		}
	}

</script>

<template>
	<div>
		<div class="formInputEl">
			<div class="formInputLine">
				<div>
					<p>График рабочего дня</p>
				</div>
				<div class="marginLeftRight">
					<select name="workSchelude" @change="selectOption">	
						<option v-bind:value="''">Пусто</option>

						<option v-for=" e in workSchelude " v-bind:value="`${e.from }-${e.until}`">С {{ e.from }} До {{ e.until }}</option>

					</select>
				</div>
			</div>
		</div>
	</div>
</template>
