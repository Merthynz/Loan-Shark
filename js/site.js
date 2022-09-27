// Get user values from the page
function getValues() {

    let loanAmount = document.getElementById("loanAmount").value;
    let loanTerm = document.getElementById("loanTerm").value;
    let interestRate = document.getElementById("interestRate").value;
    
    // Validate the inputs to make sure they are numbers with decimals
    loanAmount = parseFloat(loanAmount);
    loanTerm = parseFloat(loanTerm);
    interestRate = parseFloat(interestRate);

    // Calculate Monthly Payment
    let monthlyPay = calculateMonthlyPayment(loanAmount, loanTerm, interestRate);

    // Calculate and populate amortization table
    let creditResults = calculateAmortizationTable(loanAmount, loanTerm, interestRate, monthlyPay);
    let amortizationTable = creditResults.amortization;
    let totalInterest = creditResults.totalInterest;

    // Display credit consolidated results
    displayCreditResults(loanAmount, monthlyPay.toFixed(2), totalInterest.toFixed(2));

    // Display amortization table
    displayTable(amortizationTable);
}

// Logic Functions

function calculateMonthlyPayment(amount, term, interest) {
    let monthlyPayment = amount * (interest / 1200) / (1 - (1 + interest / 1200)**(-term));
    return monthlyPayment;
}

function calculateAmortizationTable(amount, term, interest, monthlyPayment) {
    let amortization = {"Month": [], "Payment": [], "Principal": [], "Interest": [], "Total Interest": [], "Balance": []};
    let totalInterest = 0;
    let balance = amount;
    let interestPay = 0;
    let principalPay = 0;

    // Amortization table
    for (let i = 1; i <= term; i++) {
        interestPay = balance * interest / 1200;
        principalPay = monthlyPayment - interestPay;
        totalInterest += interestPay;
        balance -= principalPay;
        balance = Math.abs(balance);
        amortization["Month"].push(i);
        amortization["Interest"].push(interestPay.toFixed(2));
        amortization["Payment"].push(monthlyPayment.toFixed(2));
        amortization["Principal"].push(principalPay.toFixed(2));
        amortization["Total Interest"].push(totalInterest.toFixed(2));
        amortization["Balance"].push(balance.toFixed(2));
    }
    return {amortization, totalInterest};
}

function displayCreditResults(amount, monthlyPayment, totalInterest) {
    let totalCost = parseFloat(amount) + parseFloat(totalInterest);
    document.getElementById("totalPrincipalOutput").innerHTML = "$" + amount.toString();
    document.getElementById("totalInterestOutput").innerHTML = "$" + totalInterest.toString();
    document.getElementById("totalCostOutput").innerHTML = "$" + totalCost.toString();
    document.getElementById("monthlyPaymentOutput").innerHTML = "$" +  monthlyPayment.toString();
}

function displayTable(amortizationTable) {
    let tableBody = document.getElementById("amortizationTable");
    let rowTemplate = document.getElementById("tableRowTemplate");

    tableBody.innerHTML = "";

    let Month = amortizationTable["Month"];
    let Payment = amortizationTable["Payment"];
    let Principal = amortizationTable["Principal"];
    let Interest = amortizationTable["Interest"];
    let TotalInterest = amortizationTable["Total Interest"];
    let Balance = amortizationTable["Balance"];

    for (let i = 0; i < Month.length; i++) {
        let tableRow = document.importNode(rowTemplate.content, true);
        let rowCols = tableRow.querySelectorAll("td");
        rowCols[0].textContent = Month[i];
        rowCols[1].textContent = Payment[i];
        rowCols[2].textContent = Principal[i];
        rowCols[3].textContent = Interest[i];
        rowCols[4].textContent = TotalInterest[i];
        rowCols[5].textContent = Balance[i];
        tableBody.appendChild(tableRow);
    }
}