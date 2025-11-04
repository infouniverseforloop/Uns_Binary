// backend/brokerAdapters/binanceAdapter.js
module.exports = {
  startBinanceStream: (pairs, appendTick) => {
    console.log('binanceAdapter: simulation mode (no real connection)');
    // real integration left as future: use Binance ws / Combined stream
    return;
  }
};
