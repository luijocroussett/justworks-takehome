import helpers from "./helpers";

export default (state, action) => {
  switch (action.type) {
    case "FETCHING_RATES_ERROR":
      return {
        ...state,
        rates: {
          ...state.rates,
          status: { value: "error", message: "unable to retrieve rates data" }
        }
      };
    case "FETCHING_RATES_STARTED":
      return {
        ...state,
        rates: {
          ...state.rates,
          status: { value: "warning", message: "loading rates data" }
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
            message: "rates data retrieved successfully"
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
                    value === "" ? "0" : parseFloat(value) * 0.7,
                    state.rates.data
                  )
                  .toString()
              : "Unable to calculate"
          },
          eth: {
            status: "",
            message: "",
            value: isValid
              ? helpers
                  .calculateUSDToETH(
                    value === "" ? "0" : parseFloat(value) * 0.3,
                    state.rates.data
                  )
                  .toString()
              : "Unable to calculate"
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
              ? helpers
                  .calculateBTCToUSD(
                    (value === "" ? "0" : parseFloat(value)) / 0.7,
                    state.rates.data
                  )
                  .toString()
              : "Unable to calculate"
          },
          btc: { value, status, message: error },
          eth: {
            status: "",
            message: "",
            value: isValid
              ? helpers
                  .calculateBTCToETH(
                    (value === "" ? "0" : parseFloat(value) * 0.3) / 0.7,
                    state.rates.data
                  )
                  .toString()
              : "Unable to calculate"
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
                    value === "" ? "0" : parseFloat(value) / 0.3,
                    state.rates.data
                  )
                  .toString()
              : "Unable to calculate"
          },
          btc: {
            status: "",
            message: "",
            value: isValid
              ? helpers
                  .calcualteETHToBTC(
                    (value === "" ? "0" : parseFloat(value) * 0.7) / 0.3,
                    state.rates.data
                  )
                  .toString()
              : "Unable to calculate"
          },
          eth: { value, status, message: error }
        }
      };
    }
    default:
      return state;
  }
};
