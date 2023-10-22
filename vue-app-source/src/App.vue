<script>

	import NoMatches from './components/noMatches.vue';
	import Matches from './components/matches.vue';
	import FormInput from './components/formInput.vue';


	export default {
		components:{
			NoMatches
			,Matches
			,FormInput
		}
		,data() {
			return {
				examples: {
					cities: []
					,plantShops: []
					,emploees: []
				}
				,dataLists: {
					cities: []
					,plantShops: []
					,emploees: []
				}
				,tableList: []
				,inputData: {
					city: ''
					,plantShop: ''
					,emploee: ''
				}
				,noMatches: false
				,dataLoaded: false
			}
		}
		,methods: {
			async search(e) {
				e.preventDefault();

				const res = await fetch('/api/search?' + new URLSearchParams(this.inputData));
				const json = await res.json();


				if(!json.rows.length){
					this.noMatches = true;
				} else {
					this.noMatches = false;
				}

				this.dataLists.cities =	json.cities;
				this.dataLists.plantShops = json.plantShops;
				this.dataLists.emploees = json.emploees;

				this.tableList = json.rows;
			}
			,async getExamples() {

				const res = await fetch('/api/examples');
				const json = await res.json();

				this.dataLists.cities =	json.cities;
				this.dataLists.plantShops = json.plantShops;
				this.dataLists.emploees = json.emploees;

				this.examples.cities =	json.cities;
				this.examples.plantShops = json.plantShops;
				this.examples.emploees = json.emploees;

			}
		}
		,async mounted() {
			await this.getExamples();

			this.dataLoaded = true;

			console.log(this);
		}



	};

</script>


<template>
			<div>
				<div class="text">
					<h1>Client-Side Rendering based on Vue.js</h1>
				</div>
				<div>
					<div class="text">
						<p>Выберите/введите значение в любое/любые поле/поля и отправьте форму. <a href="/">Вернуться обратно.</a></p>
					</div>
				</div>
			</div>
		<div>
			<div>
				<form>
					<div class="formInputLine">

						<!--

			listName: String
			,formInputName: String
			,placeholder: 
			,datalistOptions: Array
			,dataExamples: Array
			,inputValue: String

				examples 
				,dataLists: {}
				,tableList: []
				,inputData: {
					city: ''
					,plantShop: ''
					,emploee: ''
				}

				this.dataLists.cities =	json.cities;
				this.dataLists.plantShops = json.plantShops;
				this.dataLists.emploees = json.emploees;
						-->


						<FormInput
							v-if="dataLoaded"
							titleText="Город"
							listName="cities"
							formInputName="city"
							:datalistOptions="dataLists.cities"
							:dataExamples="examples.cities"
							:inputValue="inputData.city"
						/>

						<FormInput
							v-if="dataLoaded"
							titleText="Цех"
							listName="plantShops"
							formInputName="plantShop"
							:datalistOptions="dataLists.plantShops"
							:dataExamples="examples.plantShops"
							:inputValue="inputData.plantShop"
						/>

						<!--
						<%- 
							
							include('../partials/formInput', {
								titleText: 'Город'
								,listName: 'cities'
								,formInputName: 'city' 
								,dataListOptions: cities
								,dataExamples: cityExamples
							})

						%>

						<%- 
							
							include('../partials/formInput', {
								titleText: 'Цех'
								,listName: 'plantShops'
								,formInputName: 'plantShop' 
								,dataListOptions: plantShops
								,dataExamples: plantShopExamples
							})

						%>

						<%- 
							
							include('../partials/formInput', {
								titleText: 'Сотрудник'
								,listName: 'emploees'
								,formInputName: 'emploee' 
								,dataListOptions: emploees
								,dataExamples: emploeeExamples
							})

						%>
						-->

					</div>
 					<div>
						<input type="submit" value="Отправить" @click="search">
					</div>
				</form>
			</div>

			<div class="outputDiv">	
				<h1>Output</h1>

				<NoMatches v-if="noMatches" />
				<Matches v-else />

			</div>
		</div>	
		<div style="height:50px"></div>
</template>

