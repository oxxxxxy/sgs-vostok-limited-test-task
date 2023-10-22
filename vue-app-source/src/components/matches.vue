<script>

	export default {
		props: {
			tableList: Array
		}
	}

</script>

<template>
	<table>
	  <tr style="border-bottom: 2px solid black;">
	    <th>Город</th>
	    <th>Цех</th>
	    <th>Сотрудник</th>
	    <th>Бригада</th>
	    <th>Начало смены</th>
	    <th>Конец смены</th>
	  </tr>

		<tr v-for=" item in tableList ">
		    <td>{{ item.city }}</td>
		    <td>{{ item.plantShop }}</td>
		    <td>{{ item.emploee }}</td>
		    <td>{{ item.brigade }}</td>
		    <td>{{ item.workFrom }}</td>
		    <td>{{ item.workUntil }}</td>
		</tr>

	</table>
</template> 
