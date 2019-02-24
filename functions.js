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

async function getCoinInfo(event) {
    if (event.target.tagName !== "BUTTON") {
        return;
    } else {
        let coinShortName = event.target.getAttribute("index-data");
        let coinName = event.target.textContent;
        state.chooseCoins.push(coinShortName);
        let coin = await uniteCoinInfo(coinShortName, coinName);
        displayCoinHeader();
        displayInfoCoin(coin, coinShortName);
    }
};

async function requestCoinInfo(coin) {
    let responsCoin = await request(coin);
    let data = JSON.parse(responsCoin);
    return data;
};

async function destructObject(data, coinShortName, coinName) {
    let coinInfo = data.DISPLAY[coinShortName];
    let {
        USD: {
            FROMSYMBOL: coinSymbol,
            TOSYMBOL: symbolUSD,
            PRICE: priceUsd,
            CHANGE24HOUR: changeCurrencyUsd,
            CHANGEPCT24HOUR: changePctUsd
        },
        EUR: {
            TOSYMBOL: symbolEuro,
            PRICE: priceEuro,
            CHANGE24HOUR: changeCurrencyEuro,
            CHANGEPCT24HOUR: changePctEuro
        }
    } = coinInfo;

    let fullPriceUSD = new Price(symbolUSD, priceUsd, changeCurrencyUsd, changePctUsd);
    let fullPriceEuro = new Price(symbolEuro, priceEuro, changeCurrencyEuro, changePctEuro);

    let coin = new Coin(coinSymbol, coinName, fullPriceUSD, fullPriceEuro);
    return coin;
};


async function uniteCoinInfo(coinShortName, coinName) {
    let data = await requestCoinInfo(coinShortName);
    let coin = await destructObject(data, coinShortName, coinName);
    //displayInfoCoin(coin, coinShortName);
    // console.log("coin", coin);
    return coin;
};


function displayInfoCoin(coin, coinShortName) {
    let currency = state.chooseCurrensy;
    let priceCurrency = null;

    if (currency === "USD") {
        priceCurrency = coin.priceUsd;
    } else if (currency === "EUR") {
        priceCurrency = coin.priceEuro;
    }

    let coinInfoHead = document.getElementById("coinInfo");
    // coinInfoHead.classList.add("coinInfoCont");

    let coinInfo = document.createElement("div");
    coinInfo.classList.add("coinInfo");
    coinInfo.setAttribute("index-data", `${coinShortName}`);

    let divContName = document.createElement("div");
    divContName.classList.add("coinRate");
    divContName.classList.add("halfCell");
    let divLabel = document.createElement("div");
    // divLabel.classList.add("label");
    divLabel.textContent = coin.coinSymbol;
    let divName = document.createElement("div");
    // divName.classList.add("name");
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
    let coinChange = document.createElement("div");
    coinChange.classList.add("coinChange");
    let changeCurrency = document.createElement("div");
    changeCurrency.classList.add("changeCurrency");
    changeCurrency.textContent = priceCurrency.changeCurrency;
    changeFontColor(priceCurrency.changeCurrency, changeCurrency);
    coinChange.appendChild(changeCurrency);
    let changePct = document.createElement("div");
    changePct.classList.add("changePercent");
    changePct.textContent = `${priceCurrency.changePct} ${"%"}`;
    changeFontColor(priceCurrency.changePct, changePct);
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
    graph.classList.add("halfCell");
    let btnGraphDiv = document.createElement("div");
    let buttonGraph = document.createElement("button");
    buttonGraph.textContent = "Chart";
    buttonGraph.setAttribute("name", "chart");
    buttonGraph.classList.add("btn");
    btnGraphDiv.appendChild(buttonGraph);
    graph.appendChild(btnGraphDiv);
    let btnCloseDiv = document.createElement("div");
    let btnCloseInfo = document.createElement("button");
    btnCloseInfo.textContent = "Delete";
    btnCloseInfo.setAttribute("name", "delete");
    btnCloseInfo.classList.add("btn");
    btnCloseDiv.appendChild(btnCloseInfo);
    graph.appendChild(btnCloseDiv);
    coinInfo.appendChild(graph);
    coinInfoHead.appendChild(coinInfo);
};

function changeFontColor(price, elem) {
    let regexNum = /[^\-.\d]+/g;
    let newPrice = price.replace(regexNum, "");
    newPrice = parseFloat(newPrice);

    if (newPrice > 0) {
        elem.classList.add("fontGreen");
    } else if (newPrice < 0) {
        elem.classList.add("fontRed");
    }
};


function calculate(event, inputValue, currentPrice) {
    let regexInput = /[^0-9\.]/g;
    if (isNaN(inputValue)) {
        inputValue = inputValue.replace(regexInput, "");
        if (inputValue.split('.').length > 2) {
            inputValue = inputValue.replace(/\.+$/, "");
        }
    }
    event.target.value = inputValue;
    let res = currentPrice * inputValue;
    res = res.toFixed(2);
    return res;
};


async function getHistoricalRequest(termin = 10) {
    let coin = state.coinChoose;
    let data = await historicalRequest(coin, termin);
    let historyCoinInfo = JSON.parse(data);
    let historicalData = await destructHistoricalRequest(historyCoinInfo);
    let {
        dateArray,
        timeArray
    } = historicalData;
    await displayGrapf(dateArray, timeArray, coin);
};

async function destructHistoricalRequest(data) {
    let historyData = {
        dateArray: [],
        timeArray: []
    }

    for (let i = 0; i < data.Data.length; i++) {
        let time = data.Data[i].time;
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

function clickCoinInfoInput(event) {
    let targetInfo = event.target.parentNode.parentNode.previousElementSibling.previousElementSibling.innerText;
    let regex = /[^\d\.]/g;
    let currentPrice = parseFloat(targetInfo.replace(regex, ""));

    event.target.oninput = function () {
        let inputValue = event.target.value;
        let res = calculate(event, inputValue, currentPrice);
        let cost = event.target.parentNode.nextElementSibling;
        cost.textContent = res;
    }
};

function clickCoinInfoButton(event) {
    let name = event.target.getAttribute("name");
    let child = event.target.parentNode.parentNode.parentNode;
    let coinShortName = child.getAttribute("index-data");

    switch (name) {
        case "chart":
            modalOverLay.classList.toggle("closed");
            modal.classList.toggle("closed");
            state.coinChoose = coinShortName;
            getHistoricalRequest();
            break;
        case "delete":
            let coinInfoHead = document.getElementById("coinInfo");
            child.classList.add("deleteBlock");
            console.log(child);
            setTimeout(() => {
                coinInfoHead.removeChild(child);
            }, 1200);

            let arrCoins = state.chooseCoins;
            let newArrCoins = arrCoins.filter(function (coin) {
                return coin !== coinShortName;
            });
            state.chooseCoins = newArrCoins;
            displayCoinHeader();
            break;
        default:
            break;
    }
};

function displayCoinHeader() {
    let coinHeader = document.getElementById("coinHeader");
    if (state.chooseCoins.length === 0) {
        coinHeader.classList.add("displayNone");
    } else if (state.chooseCoins.length === 1) {
        coinHeader.classList.remove("displayNone");
    }
};

async function randomCoin() {
    let numbers = await checkRandomNum();
    let {
        rightNum,
        leftNum
    } = numbers;

    let coinLeft = await uniteCoinInfo(coins[leftNum].short_name, coins[leftNum].name);
    let coinRight = await uniteCoinInfo(coins[rightNum].short_name, coins[rightNum].name);

    let idNameLeft = "rateCoinLeft";
    let idNameRight = "rateCoinRight";

    displayRandomCoins(idNameLeft, coinLeft);
    displayRandomCoins(idNameRight, coinRight);
};


function randomNumCoin() {
    let numCoin = coins.length;
    return Math.floor(Math.random() * numCoin);
};


async function checkRandomNum() {
    let right = await randomNumCoin();
    let left = await randomNumCoin();

    if (left !== right) {
        let numbers = {
            rightNum: right,
            leftNum: left
        }
        return numbers;
    } else {
        console.log("repeat function");
        let num = await checkRandomNum();
        return num;
    }
};


function displayRandomCoins(idName, coin) {
    let divName = document.getElementById(idName);
    let randomCoin = coin;
    let changePct = randomCoin.priceUsd.changePct;
    let firstContainer = divName.firstElementChild.getElementsByTagName("DIV");
    let lastContainer = divName.lastElementChild.getElementsByTagName("DIV");

    firstContainer[0].textContent = randomCoin.coinSymbol;
    firstContainer[1].textContent = randomCoin.priceUsd.price;

    if (lastContainer[0].classList.length > 0) {
        let nameClass = lastContainer[0].className;
        lastContainer[0].classList.remove(nameClass);
        lastContainer[1].classList.remove(nameClass);

        changeRandomFontColor(changePct, lastContainer);
    } else {
        changeRandomFontColor(changePct, lastContainer);
    }

    lastContainer[0].textContent = `${randomCoin.priceUsd.changePct} %`;
    lastContainer[1].textContent = randomCoin.priceUsd.changeCurrency;
};

function changeRandomFontColor(coinPrice, elem) {
    if (coinPrice > 0) {
        elem[0].classList.add("fontGreen");
        elem[1].classList.add("fontGreen");
    } else if (coinPrice < 0) {
        elem[0].classList.add("fontRed");
        elem[1].classList.add("fontRed");
    } else {
        elem[0].classList.add("fontBlack");
        elem[1].classList.add("fontBlack");
    }
};