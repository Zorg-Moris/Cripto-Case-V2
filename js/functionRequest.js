"use strict";

function request(coin) {
    // let url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD,EUR`;
    let url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD,EUR&api_key=INSERT-dfc2acaf9534414b9ceb2b44b77d6ec0743f4cf67d1313fd0a671596b12b47aa`;
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            }
        }
        xhr.ontimeout = function () {
            reject('timeout');
        }
        xhr.open("GET", url, true);
        xhr.send(null);
    })
};

function historicalRequest(coin, term) {
    let currency = state.chooseCurrensy;
    // let url = `https://min-api.cryptocompare.com/data/histoday?fsym=${coin}&tsym=${currency}&limit=${term}`;
    let url = `https://min-api.cryptocompare.com/data/histoday?fsym=${coin}&tsym=${currency}&limit=${term}&api_key=INSERT-dfc2acaf9534414b9ceb2b44b77d6ec0743f4cf67d1313fd0a671596b12b47aa`;
    console.log("currency", currency);
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            }
        }
        xhr.ontimeout = function () {
            reject("timeout");
        }
        xhr.open("GET", url, true);
        xhr.send(null);
    })
};