
<div class="formInputEl">
	<div class="inputDiv">
		<input list="<%= listName %>" type="text" name="<%= formInputName %>" placeholder="<%= titleText %>">
		<datalist id="<%= listName %>">

			<% dataListOptions.forEach( function(op) { %>
			
				<option value="<%= op %>">

			<% }); %>

		</datalist>
	</div>
	<div class="dataExample">
		<p>Пример данных:</p>
		<div class="dataExampleBoard">
			<div class="text">
				<ul>

					<% dataExamples.forEach( function(e) { %>

						<li><p><%= e %></p></li>

					<% }); %>

				</ul>
			</div>
		</div>
	</div>
</div>
