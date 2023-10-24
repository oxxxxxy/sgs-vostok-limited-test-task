
<script>

	export default {
		props: {
			workScheludeOptions: Array
			,workScheludeSelected: String
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

						<option v-if="!workScheludeSelected" v-bind:value="''">Пусто</option>
						<option v-else v-bind:value="workScheludeSelected">{{ `С ${workScheludeSelected.split('-')[0]} До ${workScheludeSelected.split('-')[1]}` }}</option>

						<option v-for=" e in workScheludeOptions " v-bind:value="`${e.from }-${e.until}`" >С {{ e.from }} До {{ e.until }}</option>

					</select>
				</div>
			</div>
		</div>
	</div>
</template>
