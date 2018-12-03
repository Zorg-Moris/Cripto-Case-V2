"use strict"

// вывод монет
function displayCoins() {
    for (let i = 0; i < coins.length; i++) {

        let coins_caseId = document.getElementById("coins-case");
        let div = document.createElement("div");
        div.classList.add("coin");
        //div.setAttribute("index-data", `${coins[i].short_name}`);
        let button = document.createElement("button");
        button.classList.add("button-coin");
        button.setAttribute("index-data", `${coins[i].short_name}`);
        button.innerHTML = coins[i].name;

        div.appendChild(button);
        coins_caseId.appendChild(div);
    };
};

function getCoinInfo(event) {
    if (event.target.tagName != "BUTTON") {
        return;
    } else {
        let coinShortName = event.target.getAttribute("index-data");
        let coinName = event.target.textContent;
        state.chooseCoins.push(coinShortName);
        uniteCoinInfo(coinShortName, coinName);
    }
};

async function requestCoinInfo(coin) {
    let responsCoin = await request(coin);
    let data = JSON.parse(responsCoin);
    return data;
};

async function destructObject(data, coinShortName, coinName) {
    let coinInfo = data.DISPLAY[coinShortName];
    let { USD: {
        FROMSYMBOL: coinSymbol,
        TOSYMBOL: symbolUSD,
        PRICE: priceUsd,
        CHANGE24HOUR: changeCurrencyUsd,
        CHANGEPCT24HOUR: changePctUsd
    }, EUR: {
        TOSYMBOL: symbolEuro,
        PRICE: priceEuro,
        CHANGE24HOUR: changeCurrencyEuro,
        CHANGEPCT24HOUR: changePctEuro
    } } = coinInfo;

    let fullPriceUSD = new Price(symbolUSD, priceUsd, changeCurrencyUsd, changePctUsd);
    let fullPriceEuro = new Price(symbolEuro, priceEuro, changeCurrencyEuro, changePctEuro);

    let coin = new Coin(coinSymbol, coinName, fullPriceUSD, fullPriceEuro);
    return coin;
};

function displayInfoCoin(coin, coinShortName) {
    let currency = state.chooseCurrensy;
    let priceCurrency = null;

    if (currency === "USD") {
        priceCurrency = coin.priceUsd;
    } else if (currency === "EURO") {
        priceCurrency = coin.priceEuro;
    }

    let coinInfoHead = document.getElementById("coinInfo");
    coinInfoHead.classList.add("coinInfoCont");


    let coinInfo = document.createElement("div");
    coinInfo.classList.add("coinInfo");
    coinInfo.setAttribute("index-data", `${coinShortName}`);

    let divContName = document.createElement("div");
    divContName.classList.add("coinRate");
    divContName.classList.add("coinName");
    let divLabel = document.createElement("div");
    divLabel.classList.add("label");
    divLabel.textContent = coin.coinSymbol;
    let divName = document.createElement("div");
    divName.classList.add("name");
    divName.textContent = coin.coinName;
    divContName.appendChild(divLabel);
    divContName.appendChild(divName);
    coinInfo.appendChild(divContName);

    let currentRate = document.createElement("div");
    currentRate.classList.add("coinRate");
    currentRate.textContent = priceCurrency.price;
    coinInfo.appendChild(currentRate);

    let changePrice = document.createElement("div");
    changePrice.classList.add("coinRate");
    let coinDirection = document.createElement("div");
    coinDirection.classList.add("coinDirection");
    changePrice.appendChild(coinDirection);
    let coinChange = document.createElement("div");
    coinChange.classList.add("coinChange");
    let changeCurrency = document.createElement("div");
    changeCurrency.classList.add("changeCurrency");
    changeCurrency.textContent = priceCurrency.changeCurrency;
    coinChange.appendChild(changeCurrency);
    let changePct = document.createElement("div");
    changePct.classList.add("changePercent");
    changePct.textContent = `${priceCurrency.changePct} ${"%"}`;
    coinChange.appendChild(changePct);
    changePrice.appendChild(coinChange);
    coinInfo.appendChild(changePrice);

    let calc = document.createElement("div");
    calc.classList.add("coinRate");
    calc.classList.add("calc");
    let dataCalc = document.createElement("div");
    let calcInput = document.createElement("input");
    calcInput.setAttribute("type", "text");
    calcInput.classList.add("calcInput");
    dataCalc.appendChild(calcInput);
    calc.appendChild(dataCalc);
    let costCalc = document.createElement("div");
    calc.appendChild(costCalc);
    coinInfo.appendChild(calc);

    let graph = document.createElement("div");
    graph.classList.add("coinRate");
    let buttonGraph = document.createElement("button");
    buttonGraph.textContent = "Chart";
    graph.appendChild(buttonGraph);
    coinInfo.appendChild(graph);
    coinInfoHead.appendChild(coinInfo);
};

async function uniteCoinInfo(coinShortName, coinName) {
    let data = await requestCoinInfo(coinShortName);
    let coin = await destructObject(data, coinShortName, coinName);
    displayInfoCoin(coin, coinShortName);
    console.log(coin);
};

function calculate(event, inputValue, currentPrice) {
    let regexInput = /[^0-9\.]/g;
    if (isNaN(inputValue)) {
        inputValue = inputValue.replace(regexInput, '');
        if (inputValue.split('.').length > 2) {
            inputValue = inputValue.replace(/\.+$/, "");
        }
    }
    event.target.value = inputValue;
    let res = currentPrice * inputValue;
    res = res.toFixed(2);
    return res;
};

// async function getHistoricalRequest(coin) {
//     // let coin = "BTC";
//     let data = await historicalRequest(coin);
//     let historyCoinInfo = JSON.parse(data);
//     let historicalData = await destructHistoricalRequest(historyCoinInfo);
//     let { dateArray, timeArray } = historicalData;
//     await displayGrapf(dateArray, timeArray, coin);
// };

async function getHistoricalRequest(termin = 10) {
    let coin = state.coinChoose;
    let data = await historicalRequest(coin, termin);
    let historyCoinInfo = JSON.parse(data);
    let historicalData = await destructHistoricalRequest(historyCoinInfo);
    let { dateArray, timeArray } = historicalData;
    await displayGrapf(dateArray, timeArray, coin);
};

async function destructHistoricalRequest(data) {
    let historyData = {
        dateArray: [],
        timeArray: []
    }

    for (let i = 0; i < data.Data.length; i++) {
        let time = data.Data[i].time;
        //let momenTime = moment(time).format("DD,MMM,YYYY");
        historyData.timeArray.push(time * 1000);
        let price = data.Data[i].open;
        historyData.dateArray.push(price);
    }
    return historyData;
};

async function displayGrapf(dateArray, timeArray, coinShortName) {
    if (state.chartCoin !== null) {
        state.chartCoin.destroyChart();
    }
    state.chartCoin = new ChartCoin(dateArray, timeArray, coinShortName);
};
