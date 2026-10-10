import { fetchOpenMeteoWeather, CITY_COORDINATES } from "../lib/weather";

async function runWeatherTests() {
  console.log("=== WEATHER API INTEGRATION TESTS ===");

  // 1. Fetch for Delhi
  const delhi = CITY_COORDINATES["Delhi"];
  console.log(`Testing Open-Meteo fetch for Delhi (${delhi.latitude}, ${delhi.longitude})...`);
  const delhiWeather = await fetchOpenMeteoWeather(delhi.latitude, delhi.longitude);

  console.log(`Is Live: ${delhiWeather.isLive}`);
  console.log(`Hourly Apparent length: ${delhiWeather.hourlyApparent.length}`);
  console.log(`Hourly UV length: ${delhiWeather.hourlyUv.length}`);
  console.log(`Current Apparent Temp: ${delhiWeather.currentApparent}°C`);
  console.log(`Current UV Index: ${delhiWeather.currentUv}`);

  if (delhiWeather.hourlyApparent.length !== 24 || delhiWeather.hourlyUv.length !== 24) {
    console.error("Delhi weather data does not have 24 hourly points!");
    process.exit(1);
  }

  // 2. Test fallback on invalid coordinates
  console.log("\nTesting fallback for invalid coordinates (999, 999)...");
  const fallbackWeather = await fetchOpenMeteoWeather(999, 999);
  console.log(`Fallback Is Live: ${fallbackWeather.isLive} (expected: false)`);
  console.log(`Fallback Hourly Apparent length: ${fallbackWeather.hourlyApparent.length} (expected: 24)`);

  if (fallbackWeather.isLive !== false || fallbackWeather.hourlyApparent.length !== 24) {
    console.error("Fallback test failed!");
    process.exit(1);
  }

  console.log("\nALL WEATHER TESTS PASSED SUCCESSFULLY");
}

runWeatherTests().catch((err) => {
  console.error("Weather test failed:", err);
  process.exit(1);
});
