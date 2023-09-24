export default {
  state: {
    initialStateValue: {
      rates: { data: {}, status: { value: "", message: "" } },
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
    },
    stateWithRateAndInputData: {
      rates: {
        data: {
          USDETH: 0.5,
          USDBTC: 0.5
        },
        status: {
          value: "success",
          message: "rates data retrieved successfully"
        }
      },
      fields: {
        assets: {
          value: "100",
          status: "success",
          message: ""
        },
        btc: {
          value: 0.5,
          status: "",
          message: ""
        },
        eth: {
          value: 0.5,
          status: "",
          message: ""
        }
      }
    }
  },
  payload: {
    fetchData: {
      BTC: 0.5,
      ETH: 0.5
    }
  }
};
