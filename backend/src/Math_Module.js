module.exports.SumDataAmount = async (Data) => {
  //tính toán tổng số tiền//
  try {
    let result = 0;
    await Data.map((data) => {
      result += data.Amount;

      return 0;
    });
    return result;
  } catch (e) {
    console.log(e);
  }
};
module.exports.ConversionStringToObject = async (Data) => {
  try {
    const indexOf = Data.indexOf(":");
    const name = Data.slice(0, indexOf);
    const value = Data.slice(indexOf + 1, Data.length);

    switch (name) {
      case "date":
        return { date: value };
      case "tradingname":
        return { TradingName: value };
      case "amount":
        return { Amount: parseInt(value) };
      case "spendtag":
        return { SpendTag: value };

      default:
        return false;
    }
  } catch (e) {
    console.log(e);
  }
};
