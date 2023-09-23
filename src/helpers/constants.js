export default {
  configs: {
    COINBASE_API_URL: "https://api.coinbase.com/v2/exchange-rates?currency=USD"
  },
  errorMessages: {
    FETCHING_ERROR: "Something went wrong while fetching the rates.",
    FETCHING_SUCCESS: "Rates data was retrieved successfully.",
    NUMERIC_VALUES_ONLY: 'This field can only contain numbers and a single "."'
  }
};
