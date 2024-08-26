const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns=document.querySelectorAll(".dropdown select");
const btn=document.querySelector("form button");
const fromCurrency=document.querySelector(".from select");
const toCurrency=document.querySelector(".to select");
const msg=document.querySelector(".msg");
const swapIcon=document.querySelector("#swap-icon")

const createOption = (currencyCode, isFrom, isTo) => {
    const newOption = document.createElement("option");
    newOption.innerText = currencyCode;
    newOption.value = currencyCode;
    if (isFrom && currencyCode === "USD") {
        newOption.selected = "selected";
    } else if (isTo && currencyCode === "INR") {
        newOption.selected = "selected";
    }
    return newOption;
};

dropdowns.forEach(select => {
    for (const currencyCode of Object.keys(countryList)) {
        const isFrom = select.name === "from";
        const isTo = select.name === "to";
        select.append(createOption(currencyCode, isFrom, isTo));
    }
    select.addEventListener("change", evt => updateFlag(evt.target));
});

const updateExchangeRate= async()=>{
    let amount=document.querySelector(".amount input");
    let amountValue=amount.value
    if(amountValue===""||amountValue<1){
        amountValue=1;
        amount.value="1";
    }
    
    const URL = `${BASE_URL}/${fromCurrency.value.toLowerCase()}.json`;
    let response;
    try {
        response = await fetch(URL);
        if (!response.ok) throw new Error("Network response was not ok");
    } catch (error) {
        msg.innerText = "Failed to fetch exchange rate. Please try again later.";
        console.error("Fetch error: ", error);
        return;
    }
    let data = await response.json();
    let rate = data[fromCurrency.value.toLowerCase()][toCurrency.value.toLowerCase()];
    let finalAmount = amountValue * rate;
    msg.innerText = `${amountValue} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`;
   
}

const updateFlag=(element)=>{
   let currencyCode=element.value;
   let countryCode=countryList[currencyCode];
   let newSrc=`https://flagsapi.com/${countryCode}/flat/64.png`;
   let img= element.parentElement.querySelector("img");
   img.src= newSrc;
}

const swapCurrencies = () => {
    // Get current values
    const fromValue = fromCurrency.value;
    const toValue = toCurrency.value;

    // Swap the values
    fromCurrency.value = toValue;
    toCurrency.value = fromValue;

    // Swap the flags
    updateFlag(fromCurrency);
    updateFlag(toCurrency);

    // Update the exchange rate after swapping
    updateExchangeRate();
};

// Add event listener to the swap icon
swapIcon.addEventListener("click", swapCurrencies);


btn.addEventListener("click",(evt)=>{
    evt.preventDefault();
    updateExchangeRate();
  
})

window.onload = updateExchangeRate;
 