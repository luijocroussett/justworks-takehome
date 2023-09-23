import reducer from "../src/helpers/reducers";
import validators from "../src/helpers/validators";
import mockData from "./mockData";

describe("application reducers", () => {
  it("RESET_INPUT_VALUES: should clear values for ETH, BTC and USD", () => {
    expect(reducer({}, { type: "FAKE_ACTION" })).toEqual({});
  });

  it("FETCHING_RATES_ERROR: handles fetching error properly by changing status property correctly", () => {
    const testInitialValueMock = { ...mockData.state.initialValue };
    expect(
      reducer(testInitialValueMock, { type: "FETCHING_RATES_ERROR" })
    ).toEqual({
      ...testInitialValueMock,
      rates: {
        ...testInitialValueMock.rates,
        status: { value: "error", message: "unable to retrieve rates data" }
      }
    });
  });

  it("FETCHING_RATES_SUCCESS: Handles fetching success properly by setting the rates property correctly", () => {
    const testInitialValueMock = { ...mockData.state.initialValue };
    const testFetchDataMock = { ...mockData.payload.fetchData };
    expect(
      reducer(testInitialValueMock, {
        type: "FETCHING_RATES_SUCCESS",
        payload: { ...testFetchDataMock }
      })
    ).toEqual({
      ...testInitialValueMock,
      rates: {
        ...testInitialValueMock.rates,
        data: { ...testFetchDataMock },
        status: {
          value: "success",
          message: "rates data retrieved successfully"
        }
      }
    });
  });

  it("FETCHING_RATES_STARTED: Handles action properly by changing the status property correctly", () => {
    const testInitialValueMock = { ...mockData.state.initialValue };
    expect(
      reducer(testInitialValueMock, { type: "FETCHING_RATES_STARTED" })
    ).toEqual({
      ...testInitialValueMock,
      rates: {
        ...testInitialValueMock.rates,
        status: { value: "warning", message: "loading rates data" }
      }
    });
  });

  it("CLEAR_FETCHING_ALERT: Handles action properly by removing the alert status and message", () => {});

  it("SET_VALUE_ASSETS: handles action properly by correctly calculating BTC and ETH values from USD value", () => {
    const testStateValueMock = {
      ...mockData.state.stateWithRateAndInputData
    };
    expect(
      reducer(
        { ...testStateValueMock },
        {
          type: "SET_VALUE_ASSETS",
          payload: { validator: validators.numbersValidator, value: "2" }
        }
      )
    ).toEqual({
      ...testStateValueMock,
      fields: {
        assets: {
          message: "",
          value: "2",
          status: "success"
        },
        btc: {
          message: "",
          status: "",
          value: "0.7"
        },
        eth: {
          message: "",
          status: "",
          value: "0.3"
        }
      }
    });
  });

  it("SET_VALUE_BTC: handles action properly by correctly calculating USD and ETH values from BTC value", () => {
    const testStateValueMock = {
      ...mockData.state.stateWithRateAndInputData
    };
    expect(
      reducer(
        { ...testStateValueMock },
        {
          type: "SET_VALUE_BTC",
          payload: { validator: validators.numbersValidator, value: "0.7" }
        }
      )
    ).toEqual({
      ...testStateValueMock,
      fields: {
        assets: {
          message: "",
          value: "2",
          status: ""
        },
        btc: {
          message: "",
          status: "success",
          value: "0.7"
        },
        eth: {
          message: "",
          status: "",
          value: "0.3"
        }
      }
    });
  });

  it("SET_VALUE_ETH: handles action properly by correctly calculating USD and BTC values from ETH value", () => {
    const testStateValueMock = {
      ...mockData.state.stateWithRateAndInputData
    };
    expect(
      reducer(
        { ...testStateValueMock },
        {
          type: "SET_VALUE_ETH",
          payload: { validator: validators.numbersValidator, value: "0.3" }
        }
      )
    ).toEqual({
      ...testStateValueMock,
      fields: {
        assets: {
          message: "",
          value: "2",
          status: ""
        },
        btc: {
          message: "",
          status: "",
          value: "0.7"
        },
        eth: {
          message: "",
          status: "success",
          value: "0.3"
        }
      }
    });
  });

  it("RESET_INPUTS: Handles action properly by resetting values and status of all inputs", () => {
    const testStateValueMock = {
      ...mockData.state.stateWithRateAndInputData
    };
    expect(
      reducer({ ...testStateValueMock }, { type: "RESET_INPUTS" })
    ).toEqual({
      ...testStateValueMock,
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
    });
  });
});
