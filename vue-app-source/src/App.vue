<script>

	import NoMatches from './components/noMatches.vue';
	import Matches from './components/matches.vue';
	import FormInput from './components/formInput.vue';


	const inputDateNames = ['city', 'plantShop', 'emploee'];

	const makeInputDataNameForLocStor = name => 'inputData-' + name;

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

				const urlSearchParamsString = new URLSearchParams(this.inputData);

				const previousData = window.localStorage.getItem(urlSearchParamsString);

				let json;

				if(previousData === null){
				
					const res = await fetch('/vue-app/api/search?' + urlSearchParamsString);
					json = await res.json();

					window.localStorage.setItem(
						urlSearchParamsString
						,JSON.stringify(json)
					);

				} else {

					json = JSON.parse(previousData);

				}


				if(!json.rows.length){
					this.noMatches = true;
				} else {
					this.noMatches = false;
				}

				
				this.dataLists = json.dataLists;

				this.tableList = json.rows;
			}
			,async getExamples() {

				const res = await fetch('/vue-app/api/examples');
				const json = await res.json();

				this.dataLists = json.dataLists;

				this.examples = json.dataLists;

			}
			,setInputData({value, name}) {

				this.inputData[name] = value;

				window.localStorage.setItem(
					makeInputDataNameForLocStor(name)
					,value
				);

			}
			,checkExpirationAndClear() {

				const previousDate = window.localStorage.getItem('date');
			
				if(previousDate === null){

					window.localStorage.setItem('date', JSON.stringify(Date.now()));

				} else {

					const now = Date.now();
					const previousNow = JSON.parse(previousDate);
					
					const diff = now - previousNow;
					
					if(diff  >  24 * 60 * 60 * 1000){ // if more than 1 day

						window.localStorage.clear();

					}
				}
			}
			,loadPreviousInputData() {
				
				inputDateNames.forEach(e => {

					const previousInputData = window.localStorage.getItem(
						makeInputDataNameForLocStor(e)
					);

					if(previousInputData !== null){
						this.inputData[e] = previousInputData;
					}

				});

			}

		}
		,async mounted() {

			await this.getExamples();

			this.checkExpirationAndClear();
			this.loadPreviousInputData();


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

