let ticker = "2330";
let currYear = new Date().getFullYear();
let currMonth = new Date().getMonth() - 2; // to calculate MA40
let currDate = new Date().getDate();
let startDate = `${currYear}-${currMonth}-${currDate}`;
let data = [];
let result;
const errMsg = document.querySelector('.errMsg');
const loading = document.querySelector('.loading');
const mainPanel = document.querySelector('.mainPanel');
getData(ticker);

async function getData(ticker){
    try{
        errMsg.style.display = 'none';
        loading.style.display = "block";
        mainPanel.style.display = "flex";
        let url = "https://api.finmindtrade.com/api/v4/data?";
        const response = await fetch(url + new URLSearchParams({
            "dataset": "TaiwanStockPrice",
            "data_id": ticker,
            "start_date": startDate,
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyMi0wNy0wNyAxNjo0ODowOCIsInVzZXJfaWQiOiJsZW11ZWxsaW4iLCJpcCI6IjM2LjIzNC4xNy4xMDIifQ.H2Xl8hGCOhcCel_yuLJiq8hVrLwA8kCi54KLfDnrAbE",
        }));
        const allData = await response.json();
        await sortData(allData);
        renderDisplay(ticker, data, result);
        loading.style.display = "none";
    } catch (error) {
        errMsg.style.display = 'block';
        errMsg.textContent = "Please input proper ticker symbol.";
        mainPanel.style.display = 'none';
    } 
}

function sortData(allData){
    let slicedData3 = allData.data.slice(allData.data.length - 3);
    let closeData3 = slicedData3.map(data => data.close);
    let ma3 = Math.round(closeData3.reduce((a,b) => a+b) / 3 * 100) / 100;
    
    let slicedData21 = allData.data.slice(allData.data.length - 21);
    let closeData21 = slicedData21.map(data => data.close);
    let ma21 = Math.round(closeData21.reduce((a,b) => a+b) / 21 * 100) / 100;

    let slicedData40 = allData.data.slice(allData.data.length - 40);
    let closeData40 = slicedData40.map(data => data.close);
    let ma40 = Math.round(closeData40.reduce((a,b) => a+b) / 40 * 100) / 100;
    
    data = [ma3, ma21, ma40];

    if(ma3 > ma21 && ma3 > ma40 && ma21 > ma40){
        result = "多頭";
    }else if(ma3 < ma21 && ma3 < ma40 && ma21 < ma40){
        result = "空頭";
    }else{
        result = "invalid";
    }
}

function renderDisplay(ticker, data, result){
    document.querySelector('.ticker').textContent = ticker;
    document.querySelector('.ma3').textContent = `MA3: ${data[0]}`;
    document.querySelector('.ma21').textContent = `MA21: ${data[1]}`;
    document.querySelector('.ma40').textContent = `MA40: ${data[2]}`;
    document.querySelector('.result').textContent = `Result: ${result}`;
}

const enter = document.querySelector('.enter');
enter.addEventListener('click', (e)=>{
    e.preventDefault();
    tickerInput = document.getElementById('searchLocation').value;
    getData(tickerInput);
});