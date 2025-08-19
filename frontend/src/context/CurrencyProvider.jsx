import { createContext, useEffect } from "react";
import { useState, useContext } from "react";
import axios from "axios";

export const CurrencyContext = createContext();

export default function CurrencyProvider({ children }) {
  const [rates, setRates] = useState(() => {
    const stored = sessionStorage.getItem("exchangeRates");

    return stored ? JSON.parse(stored) : null;
  });
  const [selectedGlobalCurrency, setSelectedGlobalCurrency] = useState("");

  async function fetchExchangeRates() {
    try {
      const currencies = "INR,USD,EUR,CDF";

      //    const currencies = "USD,INR,EUR";
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const REMOTE_URL = `${API_BASE_URL}/api/GetExchangeRates/${currencies}`;

      const res = await axios.get(REMOTE_URL);

      const formattedData = res.data.exchangeRatesData.map((rate) => {
        return {
          id: rate.data.id,
          currency: rate.currency,
          rates: JSON.parse(rate.data.rates),
        };
      });

      sessionStorage.setItem("exchangeRates", JSON.stringify(formattedData));
      // setRates(JSON.stringify(formattedData));
      setRates(formattedData);
    } catch (error) {
      console.log("fetchExchangeRates Error", error);
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("exchangeRates");
    if (stored) setRates(JSON.parse(stored));

    fetchExchangeRates();

    const interval = setInterval(() => {
      fetchExchangeRates();
    }, 30 * 60 * 1000); // per 30minutes

    return () => clearInterval(interval);
  }, []);

  /**
   *
   * @param {*} amount
   * @param {*} sourceCurrency
   * @param {*} targetCurrency
   * @returns
   */
  function convertCurrency(amount, sourceCurrency, targetCurrency) {
    try {
      if (!amount) {
        // throw Error("Convert currency amount Err");
        console.error("Amount is not provided");
        return 0;
      }
      if (!amount) {
        return 0;
      }
      if (rates && Array.isArray(rates)) {
        if (!targetCurrency) {
          targetCurrency = selectedGlobalCurrency;
        }

        const selectCurrencyRate = rates.find(
          (rate) => rate.currency === sourceCurrency
        );

        return (amount * selectCurrencyRate.rates[targetCurrency])
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    } catch (error) {
      console.error("Err at convertCurrency: ", error);
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        rates,
        setRates,
        selectedGlobalCurrency,
        setSelectedGlobalCurrency,
        convertCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}
