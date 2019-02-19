"use strict";

let coinsCase = document.getElementById("coins-case");
let checkBoxCurrency = document.getElementById("checkBox");
let coinInfo = document.getElementById("coinInfo");
let modalOverLay = document.getElementById("modal-overlay");
let closeButon = document.getElementById("close-button");
let modal = document.getElementById("modal");
let chartTermin = document.getElementById("chartTermin");

displayCoins();
randomCoin();

let randomCoinInfo = setInterval(function () {
    randomCoin();
}, 5000);

//clearInterval(randomCoinInfo);


coinsCase.addEventListener("click", function (event) {
    state.setCurrency(checkBoxCurrency);
    getCoinInfo(event);
});

checkBoxCurrency.addEventListener("change", function () {
    console.log("change check Box");
    state.setCurrency(checkBoxCurrency);
    console.log(state.chooseCurrensy);
});

coinInfo.addEventListener("click", function (event) {
    let tagName = event.target.tagName;

    switch (tagName) {
        case "INPUT":
            clickCoinInfoInput(event);
            break;
        case "BUTTON":
            clickCoinInfoButton(event);
            break;
        default:
            break;
    }
});

closeButon.addEventListener("click", function () {
    modalOverLay.classList.toggle("closed");
    modal.classList.toggle("closed");
    state.chartCoin.destroyChart();
    state.chartCoin = null;
    state.coinChoose = null;
    let valueRadio = document.getElementById("termin2");
    valueRadio.checked = true;
});

chartTermin.addEventListener("change", function (event) {
    if (event.target.tagName !== "INPUT") {
        return;
    } else {
        let valueRadio = document.getElementsByName("termin");
        for (let i = 0; i < valueRadio.length; i++) {
            if (valueRadio[i].checked) {
                let result = valueRadio[i].value;
                console.log(result);
                // upDateChart(result);
                //let coin = state.coinChoose;
                getHistoricalRequest(result);
            }
        }
    }
});