document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('converterForm');
    const resultDiv = document.getElementById('result');
    const lastModifiedSpan = document.getElementById('lastModified');

    // Display last modified date
    lastModifiedSpan.textContent = document.lastModified;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const temperature = parseFloat(document.getElementById('temperatureInput').value);
        const inputUnit = document.getElementById('inputUnit').value;
        const outputUnit = document.getElementById('outputUnit').value;

        const convertedTemperature = convertTemperature(temperature, inputUnit, outputUnit);
        resultDiv.textContent = `Converted Temperature: ${convertedTemperature} ${outputUnit}`;
    });

    function convertTemperature(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) {
            return value;
        }

        let tempInCelsius;

        // Convert from input unit to Celsius
        if (fromUnit === "Celsius") {
            tempInCelsius = value;
        } else if (fromUnit === "Fahrenheit") {
            tempInCelsius = (value - 32) * 5 / 9;
        } else if (fromUnit === "Kelvin") {
            tempInCelsius = value - 273.15;
        }

        // Convert from Celsius to output unit
        if (toUnit === "Celsius") {
            return tempInCelsius;
        } else if (toUnit === "Fahrenheit") {
            return (tempInCelsius * 9 / 5) + 32;
        } else if (toUnit === "Kelvin") {
            return tempInCelsius + 273.15;
        }
    }
});
