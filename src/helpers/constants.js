export default {
  configs: {
    COINBASE_API_URL: 'https://api.coinbase.com/v2/exchange-rates?currency=USD',
    ETH_ALLOCATION: { 
      value: 0.3,
      text: "30%"
    },
    BTC_ALLOCATION: {
      value :0.7,
      text: "70%"
    }
  },
  errorMessages: {
    FETCHING_ERROR: 'Something went wrong while fetching the rates.',
    FETCHING_SUCCESS: 'Rates data was retrieved successfully.',
    NUMERIC_VALUES_ONLY: 'This field can only contain numbers and a single "."',
    RATES_FETCH_ERROR: 'unable to retrieve rates data',
    RATES_FETCH_LOADING: 'loading rates data',
    RATES_FETCH_SUCCESS: 'rates data retrieved successfully',
    CALCULATE_ERROR: 'unable to calculate'
  }
};
