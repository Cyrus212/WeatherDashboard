function getWeather() {
	
	const apiKey = '8bd2fbd2fd487608bcaa3ee5af5d70c7';
	const city = document.getElementById('city').value;

	const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
	const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

	fetch(currentWeatherUrl)
		.then(response => response.json())
		.then((data) => {
			displayWeather(data);
		})
		.catch(error => {
			console.error('Error fetching weather data!', error);
		})

		fetch(forecastUrl)
		.then(response => response.json())
		.then((data) => {
			displayDailyWeather(data.list);
		})
		.catch(error => {
			console.error('Error fetching weather data!', error);
		})

		recentSearch();
}

function displayWeather(data) {

	const tempDivInfo = document.getElementById('temp-div');
	const weatherDivInfo = document.getElementById('weather-info');
	const weatherIcon = document.getElementById('weather-icon');
	const dailyForecastDiv = document.getElementById('daily-forecast');

	tempDivInfo.innerHTML = '';
	weatherDivInfo.innerHTML = '';
	dailyForecastDiv.innerHTML = '';

	if (data.cod === '404') {

		weatherDivInfo.innerHTML = `<p>${data.message}</p>`

	} else {

		const fahrenheitTemp = data.main.temp;
		const mphWindSpeed = data.wind.speed;
		const cityName = data.name;
		const iconCode = data.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

		const tempHTML = `<p>${fahrenheitTemp}`;
		const weatherHTML = `<p>${cityName}`;

		tempDivInfo.innerHTML = tempHTML;
		weatherDivInfo.innerHTML = weatherHTML;
		weatherIcon.src = iconUrl;

		showImage();
	}
}

function displayDailyWeather(dailyData) {

	const dailyForecastDiv = document.getElementById('daily-forecast');
	const next24Hours = dailyData.slice(0, 8);

	next24Hours.forEach(item => {
		const dateTime = new Date(item.dt * 1000);
		const hour  = dateTime.getDay();
		const temperature = Math.round(item.main.temp);
		const iconCode = item.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

		const dailyItemHtml = `
			<div class="daily-item">
				<span>${hour}:00</span>
				<img src="${iconUrl}" alt="Daily Weather Icon">
				<span>${temperature}°F<span>
			</div>
		`;
		dailyForecastDiv.innerHTML += dailyItemHtml;
	});
}

function showImage() {
	const weatherIcon = document.getElementById('weather-icon');
	weatherIcon.style.display = 'block';
}

function recentSearch(data) {
	const city = document.getElementById('city').value;

	// Check if the city is already in local storage
	const storageCity = localStorage.getItem(city);

	// If the city is not in local storage or the data has changed * Doesn't seem to be filtering at the moment, but does the job. :)
	if (!storageCity || data !== storageCity) {
			// Creates a new table row
			const newRow = document.createElement('tr');

			// Creates a new table cell
			const newCell = document.createElement('td');

			// Creates a new button element
			const newButton = document.createElement('button');
			newButton.id = 'recentCity';
			newButton.className = 'button';
			newButton.innerText = city;

			// Attach a click event listener to the button
			newButton.addEventListener('click', function () {
					document.getElementById('city').value = newButton.innerText;
					getWeather(city);
			});

			// Appends the button to the table cell
			newCell.appendChild(newButton);

			// Appends the table cell to the table row
			newRow.appendChild(newCell);

			// Appends the table row to the recentsTable
			document.getElementById("recentsTable").appendChild(newRow);

			// Stores data in local storage
			localStorage.setItem(city, data);
	}

	console.log(`You've successfully search for ${city}! 😃`);
}
