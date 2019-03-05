"use strict";

let coins = [{
    name: "Bitcoin",
    short_name: "BTC"
},
{
    name: "Ethereum",
    short_name: "ETH"
},
{
    name: "Ripple",
    short_name: "XRP",
},
{
    name: "EOS",
    short_name: "EOS"
},
{
    name: "Litecoin",
    short_name: "LTC"
},
{
    name: "Stellar Lumens",
    short_name: "XLM"
},
{
    name: "Cardano",
    short_name: "ADA"
},
{
    name: "IOTA",
    short_name: "IOT",
    //short_name:"MIOTA" c 25 march
},
{
    name: "Bitcoin Cash",
    short_name: "BCH"
},
{
    name: "TRON",
    short_name: "TRX"
},
{
    name: "NEO",
    short_name: "NEO"
},
{
    name: "DASH",
    short_name: "DASH"
},
{
    name: "Monero",
    short_name: "XMR"
},
{
    name: "NEM",
    short_name: "XEM"
},
{
    name: "STEEM",
    short_name: "STEEM"
},
{
    name: "Waves",
    short_name: "WAVES",
},
{
    name: "Tether",
    short_name: "USDT"
},
{
    name: "VeChain",
    short_name: "VET"
},
{
    name: "Ethereum Classic",
    short_name: "ETC"
},
{
    name: "Zcach",
    short_name: "ZEC"
}
];

//рассмотреть возможность хранения в localstorage
let state = {
    chooseCoins: [],//нужен еще для того чтоб обновлять инфу через определенный промежуток времени
    arrayCoins: [],
    chartCoin: null, // текущий график
    coinChoose: null,// определяет выбраную монету при построении графика
    chooseCurrensy: "USD",
    setCurrency: function (el) {
        if (el.checked) {
            this.chooseCurrensy = "EUR";
        } else {
            this.chooseCurrensy = "USD";
        }
    }
};

function Price(symbol, price, changeCurrency, changePct) {
    this.symbol = symbol;
    this.price = price;
    this.changeCurrency = changeCurrency;
    this.changePct = changePct;
};

function Coin(coinSymbol, coinName, priceUsd, priceEuro) {
    this.coinSymbol = coinSymbol;
    this.coinName = coinName;
    this.priceUsd = priceUsd;
    this.priceEuro = priceEuro;
};

function ChartCoin(data, time, coinName) {
    this.ctx = document.getElementById("coinChart").getContext("2d");
    this.coinChart = new Chart(this.ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label: coinName,
                data: data,
                lineTension: 0.5,
                fill: true,
                borderColor: 'blue',
                backgroundColor: 'rgb(255, 255, 224)',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                pointBorderColor: 'orange',
                pointBackgroundColor: 'rgba(255,150,0,0.5)',
                pointRadius: 5,
                pointHoverRadius: 10,
                pointHitRadius: 30,
                pointBorderWidth: 2,
                pointStyle: 'rectRounded'
            }]
        },
        options: {
            legend: {
                display: true,
                position: 'top',
                
               
                labels: {
                    boxWidth: 0,
                    fontColor: 'blue',
                    fontSize:20
                }
            }, animation: {
                duration: 2000,
                easing: 'easeOutBack' //'easeInOutBack'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day',
                    },
                    ticks: {
                        source: 'data'
                    },
                }],
                // yAxes: [{
                //         ticks: {
                //         suggestedMin: 5800,
                //         suggestedMax: 7200,
                //         stepSize: 200
                //     } 
                // }]
            }
        }
    })
};

ChartCoin.prototype.destroyChart = function () {
    this.coinChart.destroy();
};
