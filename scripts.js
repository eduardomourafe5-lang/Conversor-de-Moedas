const convertButton = document.querySelector(".convert-button");
const currencySelect = document.querySelector(".select-to-convert");
const inputElement = document.querySelector(".input-currency");

async function convertCurrency() {
    const currencyToConvert = document.querySelector(".dinheiro2-to-convert");
    const currencyToConverted = document.querySelector(".dinheiro2");

  
    const rawValue = inputElement.value.trim();

    const normalizedValue = rawValue
        .replace(/\s/g, "")
        .replace(/[R$]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    const inputCurrency = Number(normalizedValue);

    if (rawValue === "" || !Number.isFinite(inputCurrency) || inputCurrency < 0) {
        alert("Digite um valor válido em reais!");
        return;
    }

    const selectedCurrency = currencySelect.value;

    let currencyCode;

    if (selectedCurrency === "dolar") {
        currencyCode = "USD";
    } else if (selectedCurrency === "euro") {
        currencyCode = "EUR";
    } else {
        alert("Selecione uma moeda válida!");
        return;
    }

    convertButton.disabled = true;

    try {
      
        const url = `https://api.frankfurter.dev/v1/latest?base=BRL&symbols=${currencyCode}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro ao consultar a cotação.");
        }

        const data = await response.json();

        const rate = data.rates[currencyCode];

        if (typeof rate !== "number") {
            throw new Error("Cotação não encontrada.");
        }

        const convertedValue = inputCurrency * rate;

        currencyToConverted.innerHTML = new Intl.NumberFormat(
            currencyCode === "USD" ? "en-US" : "de-DE",
            {
                style: "currency",
                currency: currencyCode
            }
        ).format(convertedValue);

       
        currencyToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(inputCurrency);

    } catch (error) {
        console.error("Erro na conversão:", error);
        alert("Não foi possível obter a cotação. Verifique sua conexão.");
    } finally {
        convertButton.disabled = false;
    }
}

function changeCurrency() {
    const currencyName = document.getElementById("currency-dolar");
    const currencyImg = document.querySelector(".dolarimg");

    if (currencySelect.value === "dolar") {
        currencyName.innerHTML = "Dólar Americano";
        currencyImg.src = "./assets/dolar.png";
    }

    if (currencySelect.value === "euro") {
        currencyName.innerHTML = "Euro";
        currencyImg.src = "./assets/euro.png";
    }

    convertCurrency();
}


inputElement.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        convertCurrency();
    }
});


currencySelect.addEventListener("change", changeCurrency);

convertButton.addEventListener("click", convertCurrency);