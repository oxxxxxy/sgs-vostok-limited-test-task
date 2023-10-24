<script>

	export default {
		props: {
			listName: String
			,formInputName: String
			,titleText: String
			,datalistOptions: Array
			,initDataList: Array
			,inputValue: String
		}
		,emits: ['keyup']
		,methods: {
			keyupInput(e) {

				this.$emit('keyup', {
					value: e.currentTarget.value
					,name: e.currentTarget.name
				});

			}
		}
	}

</script>


<template>
	<div class="formInputEl">
		<div class="inputDiv">
			<input v-bind:list=" listName " type="text" v-bind:name=" formInputName " v-bind:placeholder=" titleText " v-bind:value=" inputValue " @keyup="keyupInput">
			<datalist v-bind:id=" listName ">
	
				<option v-for=" op in datalistOptions " >{{ op }}</option>
	
			</datalist>
		</div>
		<div class="dataExample">
			<p>Пример данных:</p>
			<div class="dataExampleBoard">
				<div class="text">
					<ul>
	
						<li v-for=" item in initDataList "><p>{{ item }}</p></li>
	
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
