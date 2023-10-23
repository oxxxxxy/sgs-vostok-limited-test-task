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

				const res = await fetch('/vue-app/api/search?' + new URLSearchParams(this.inputData));
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

				const res = await fetch('/vue-app/api/examples');
				const json = await res.json();

				this.dataLists.cities =	json.cities;
				this.dataLists.plantShops = json.plantShops;
				this.dataLists.emploees = json.emploees;

				this.examples.cities =	json.cities;
				this.examples.plantShops = json.plantShops;
				this.examples.emploees = json.emploees;

			}
			,setInputData({value, name}) {

				this.inputData[name] = value;

			}
		}
		,async mounted() {
			await this.getExamples();

			this.dataLoaded = true;

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
				<form @submit.prevent="search">
					<div class="formInputLine">

						<FormInput
							@keyup="setInputData"
							titleText="Город"
							listName="cities"
							formInputName="city"
							:datalistOptions="dataLists.cities"
							:dataExamples="examples.cities"
							:inputValue="inputData.city"
						/>

						<FormInput
							@keyup="setInputData"
							titleText="Цех"
							listName="plantShops"
							formInputName="plantShop"
							:datalistOptions="dataLists.plantShops"
							:dataExamples="examples.plantShops"
							:inputValue="inputData.plantShop"
						/>

						<FormInput
							@keyup="setInputData"
							titleText="Сотрудник"
							listName="emploees"
							formInputName="emploee"
							:datalistOptions="dataLists.emploees"
							:dataExamples="examples.emploees"
							:inputValue="inputData.emploee"
						/>

					</div>
 					<div>
						<input type="submit" value="Отправить" >
					</div>
				</form>
			</div>

			<div class="outputDiv">	
				<h1>Output</h1>

				<NoMatches v-if="noMatches" />
				<Matches v-else 
					:tableList="tableList"
				/>

			</div>
		</div>	
		<div style="height:50px"></div>
</template>

