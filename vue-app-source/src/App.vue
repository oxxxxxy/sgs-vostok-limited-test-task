<script>

	import NoMatches from './components/noMatches.vue';
	import Matches from './components/matches.vue';
	import FormInput from './components/formInput.vue';
	import WorkSchelude from './components/workSchelude.vue';


	const inputDataNames = ['city', 'plantShop', 'emploee', 'workSchelude'];

	const makeInputDataNameForLocStor = name => 'inputData-' + name;

	export default {
		components:{
			NoMatches
			,Matches
			,FormInput
			,WorkSchelude
		}
		,data() {
			return {
				inputData: {
					cities: ''
					,plantShops: ''
					,emploees: ''
					,workSchelude: ''
				}
				,dataLists: {
					cities: []
					,plantShops: []
					,emploees: []
					,workSchelude: {}
				}
				,tableList: []
				,initData: {
					cities: []
					,plantShops: []
					,emploees: []
					,workSchelude: {}
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

				this.dataLists.workSchelude = {
					options: json.dataLists.workSchelude
				};

				this.tableList = json.rows;
			}
			,async getInitData() {

				const res = await fetch('/vue-app/api/search');
				const json = await res.json();

				this.initData = json.dataLists;
				this.initData.workSchelude = {
					options: json.dataLists.workSchelude
				};

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
				
				inputDataNames.forEach(e => {

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

			await this.getInitData();

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
							:initDataList="initData.cities"
							:inputValue="inputData.city"
						/>

						<FormInput
							@keyup="setInputData"
							titleText="Цех"
							listName="plantShops"
							formInputName="plantShop"
							:datalistOptions="dataLists.plantShops"
							:initDataList="initData.plantShops"
							:inputValue="inputData.plantShop"
						/>

						<FormInput
							@keyup="setInputData"
							titleText="Сотрудник"
							listName="emploees"
							formInputName="emploee"
							:datalistOptions="dataLists.emploees"
							:initDataList="initData.emploees"
							:inputValue="inputData.emploee"
						/>

					</div>
					

					<!-- if we loading from dataLists  -->
					<WorkSchelude v-if="dataLists.workSchelude.options && dataLists.workSchelude.options.length"
						@change="setInputData"
						:workScheludeOptions="dataLists.workSchelude.options"
						:workScheludeSelected="inputData.workSchelude"
					/>
					
					<!-- else if we loading from localStorage -->
					<WorkSchelude v-else-if="inputData.workSchelude"
						@change="setInputData"
						:workScheludeOptions="initData.workSchelude.options"
						:workScheludeSelected="inputData.workSchelude"
					/>

					<!-- else we loading from initData  -->
					<WorkSchelude v-else
						@change="setInputData"
						:workScheludeOptions="initData.workSchelude.options"
					/>


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

