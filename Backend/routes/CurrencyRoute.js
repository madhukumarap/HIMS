const axios = require("axios");

const db = require("../model/index.model");

const CurrencyRate = db.CurrencyRate;

const fetchAndSaveExchangeRates = async (ignoreIsToday) => {
  try {
    const currenciesToFetch = ["INR", "USD", "CDF", "EUR"];
    for (const currency of currenciesToFetch) {
      // Check the last saved record for the currency
      const lastSavedRecord = await CurrencyRate.findOne({
        where: { Currency: currency },
        order: [["Date", "DESC"]],
      });

      // If there is no last saved record or it's not from today, fetch and save

      if (ignoreIsToday) {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${currency}`
        );

        // Save the response to the database
        await CurrencyRate.create({
          Currency: currency,
          CurrencyResponse: response.data.rates,
          Date: new Date(),
        });

        console.log(`Exchange rates for ${currency} saved successfully.`);
      } else if (!lastSavedRecord || !isToday(lastSavedRecord.Date)) {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${currency}`
        );

        // Save the response to the database
        await CurrencyRate.create({
          Currency: currency,
          CurrencyResponse: response.data.rates,
          Date: new Date(),
        });

        console.log(`Exchange rates for ${currency} saved successfully.`);
      } else {
        console.log(`Exchange rates for ${currency} already up to date.`);
      }
    }
  } catch (error) {
    console.error("Error fetching or saving exchange rates:", error.message);
  }
};

//  function to check if a date is today
function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

module.exports = { fetchAndSaveExchangeRates };
