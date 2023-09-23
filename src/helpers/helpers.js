export default {
  calculateUSDToBTC: (value, rates) => value * rates.USDBTC,
  calculateUSDToETH: (value, rates) => value * rates.USDETH,
  calculateBTCToETH: (value, rates) => value * (rates.USDETH / rates.USDBTC),
  calculateBTCToUSD: (value, rates) => value / rates.USDBTC,
  calcualteETHToBTC: (value, rates) => value * (rates.USDBTC / rates.USDETH),
  calculateETHToUSD: (value, rates) => value / rates.USDETH
};
