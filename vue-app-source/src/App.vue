<script>

	import NoMatches from './components/noMatches.vue';
	import Matches from './components/matches.vue';


	export default {
		components:{
			NoMatches
			,Matches
		}
		,data() {
			return {
				examples: {}
				,dataLists: {}
				,tableList: []
				,inputData: {
					city: ''
					,plantShop: ''
					,emploee: ''
				}
				,noMatches: false
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

				this.examples = {
					json.cities
					,json.plantShops
					,json.emploees
				};
			}
		}
		,async mounted() {
			await this.getExamples();
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

