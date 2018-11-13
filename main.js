"use strict";


let coinsCase = document.getElementById("coins-case");
let checkBoxCurrency = document.getElementById("checkBox");
let coinInfo = document.getElementById("coinInfo");
let modalOverLay = document.getElementById("modal-overlay");
let closeButon = document.getElementById("close-button");
let modal = document.getElementById("modal");
// let openGraph = document.getElementById("openGraph");

//let coinChart = document.getElementById("coinChart").getContext("2d");


displayCoins();
//console.log(state.chooseCurrensy);

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
    if (event.target.tagName === "INPUT") {
        let targetInfo = event.target.parentNode.parentNode.previousElementSibling.previousElementSibling.innerText;
        let regex = /[,\$]/g;
        let currentPrice = parseFloat(targetInfo.replace(regex, ""));

        event.target.oninput = function () {
            let inputValue = event.target.value;
            let res = calculate(event, inputValue, currentPrice);
            let cost = event.target.parentNode.nextElementSibling;
            cost.textContent = res;
        }
    } else if (event.target.tagName === "BUTTON") {
        modalOverLay.classList.toggle("closed");
        modal.classList.toggle("closed");
        getHistoricalRequest();
    }
    else {
        console.log("other elem");
        return;
    }
});

closeButon.addEventListener("click", function () {
    modalOverLay.classList.toggle("closed");
    modal.classList.toggle("closed");
    state.chartCoin.destroy();
    state.chartCoin.destroyChart();
    state.chartCoin = null;
});

// openGraph.addEventListener("click", function () {
//     modalOverLay.classList.toggle("closed");
//     modal.classList.toggle("closed");
// });
