<script>

	export default {
		props: {
			listName: String
			,formInputName: String
			,titleText: String
			,datalistOptions: Array
			,dataExamples: Array
			,inputValue: String
		}


	}

</script>


<template>
	<div class="formInputEl">
		<div class="inputDiv">
			<input v-bindlist=" listName " type="text" v-bind:name=" formInputName " v-bind:placeholder=" titleText " v-bind:value=" inputValue ">
			<datalist v-bind:id=" listName ">
	
				<option v-for=" op in datalistOptions " >{{ op }}</option>
	
			</datalist>
		</div>
		<div class="dataExample">
			<p>Пример данных:</p>
			<div class="dataExampleBoard">
				<div class="text">
					<ul>
	
						<li v-for=" item in dataExamples "><p>{{ item }}</p></li>
	
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
