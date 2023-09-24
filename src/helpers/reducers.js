import helpers from "./helpers";
import constants from "./constants"

export default (state, action) => {
  switch (action.type) {
    case "FETCHING_RATES_ERROR":
      return {
        ...state,
        rates: {
          ...state.rates,
          status: { value: "error", message: constants.errorMessages.RATES_FETCH_ERROR }
        }
      };
    case "FETCHING_RATES_STARTED":
      return {
        ...state,
        rates: {
          ...state.rates,
          status: { value: "warning", message: constants.errorMessages.RATES_FETCH_LOADING }
        }
      };
    case "FETCHING_RATES_SUCCESS":
      return {
        ...state,
        rates: {
          ...state.rates,
          data: action.payload,
          status: {
            value: "success",
            message: constants.errorMessages.RATES_FETCH_SUCCESS
          }
        }
      };
    case "RESET_INPUTS":
      return {
        ...state,
        fields: {
          assets: {
            value: "",
            status: "",
            message: ""
          },
          btc: {
            value: "",
            status: "",
            message: ""
          },
          eth: {
            value: "",
            status: "",
            message: ""
          }
        }
      };
    case "CLEAR_FETCHING_ALERT":
      return {
        ...state,
        rates: { ...state.rates, status: { value: "", message: "" } }
      };
    case "SET_VALUE_ASSETS": {
      const { value, validator } = action.payload;
      const { isValid, error } = validator(value);
      const status = isValid ? "success" : "error";
      return {
        ...state,
        fields: {
          assets: {
            value,
            status,
            message: error
          },
          btc: {
            status: "",
            message: "",
            value: isValid
              ? helpers
                  .calculateUSDToBTC(
                    value === "" ? "0" : parseFloat(value) * constants.configs.BTC_ALLOCATION.value,
                    state.rates.data
                  )
                  .toString()
              : constants.errorMessages.CALCULATE_ERROR
          },
          eth: {
            status: "",
            message: "",
            value: isValid
              ? helpers
                  .calculateUSDToETH(
                    value === "" ? "0" : parseFloat(value) * constants.configs.ETH_ALLOCATION.value,
                    state.rates.data
                  )
                  .toString()
              : constants.errorMessages.CALCULATE_ERROR
          }
        }
      };
    }
    case "SET_VALUE_BTC": {
      const { value, validator } = action.payload;
      const { isValid, error } = validator(value);
      const status = isValid ? "success" : "error";
      return {
        ...state,
        fields: {
          assets: {
            status: "",
            message: "",
            value: isValid
              ? Math.round(
                  helpers
                  .calculateBTCToUSD(
                    (value === "" ? "0" : parseFloat(value)) / constants.configs.BTC_ALLOCATION.value,
                    state.rates.data
                  ) * 100 / 100)
                  .toString()
              : constants.errorMessages.CALCULATE_ERROR
          },
          btc: { value, status, message: error },
          eth: {
            status: "",
            message: "",
            value: isValid
              ? helpers
                  .calculateBTCToETH(
                    (value === "" ? "0" : parseFloat(value) * constants.configs.ETH_ALLOCATION.value) / constants.configs.BTC_ALLOCATION.value,
                    state.rates.data
                  )
                  .toString()
              : constants.errorMessages.CALCULATE_ERROR
          }
        }
      };
    }
    case "SET_VALUE_ETH": {
      const { value, validator } = action.payload;
      const { isValid, error } = validator(value);
      const status = isValid ? "success" : "error";
      return {
        ...state,
        fields: {
          assets: {
            status: "",
            message: "",
            value: isValid
              ? helpers
                  .calculateETHToUSD(
                    value === "" ? "0" : parseFloat(value) / constants.configs.ETH_ALLOCATION.value,
                    state.rates.data
                  )
                  .toString()
              : constants.errorMessages.CALCULATE_ERROR
          },
          btc: {
            status: "",
            message: "",
            value: isValid
              ? helpers
                  .calcualteETHToBTC(
                    (value === "" ? "0" : parseFloat(value) * constants.configs.BTC_ALLOCATION.value) / constants.configs.ETH_ALLOCATION.value,
                    state.rates.data
                  )
                  .toString()
              : constants.errorMessages.CALCULATE_ERROR
          },
          eth: { value, status, message: error }
        }
      };
    }
    default:
      return state;
  }
};
