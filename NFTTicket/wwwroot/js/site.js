// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function clickBuyOffer() {
        checkSeed();
            const standby_wallet = xrpl.Wallet.fromSeed(localStorage.userSeed)
            location.href = '/Ticket/BuyOffer/' + standby_wallet.classicAddress;

}

function submitSeed() {
    var seed = $('#xrplSeed').val();
    localStorage.userSeed = seed;
    location.href = '/Ticket/List';
}

function checkSeed() {
    if (localStorage.userSeed == null || localStorage.userSeed == '') {
        location.href = '/Home/Access';
    }
}

async function mintToken() {
    const standby_wallet = xrpl.Wallet.fromSeed(localStorage.userSeed)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net")
    await client.connect()

    // Note that you must convert the token URL to a hexadecimal 
    // value for this transaction.
    // ------------------------------------------------------------------------
    const transactionBlob = {
        "TransactionType": "NFTokenMint",
        "Account": standby_wallet.classicAddress,
        "URI": xrpl.convertStringToHex("https://localhost:7052/Ticket/Details/" + $('#Form_Id').val()),
        "Flags": $('#Form_IsTransferable').val() === "True" ? 9 : 0,
        "TransferFee": parseInt($('#Form_TransferFee').val()),
        "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
    }

    // ----------------------------------------------------- Submit signed blob 
    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet })

    if (tx.result != null && tx.result.meta != null && tx.result.meta.TransactionResult != null
        && tx.result.meta.TransactionResult == "tesSUCCESS") {
        $('#Form_AccountId').val(standby_wallet.classicAddress);
        $('#Form_submitTransaction').submit();
    }
    else {
        $('#Form_Error').css("display", 'block');
    }
    client.disconnect()
    
} //End of mintToken()

async function getTokens() {
    const standby_wallet = xrpl.Wallet.fromSeed(localStorage.userSeed)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net")
    await client.connect();

    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    });

    var list = document.querySelector('.nftList');
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    var theadTr = document.createElement('tr');
    var contractNameHeader = document.createElement('th');
    contractNameHeader.innerHTML = 'Id';
    theadTr.appendChild(contractNameHeader);
    var contractTickerHeader = document.createElement('th');
    contractTickerHeader.innerHTML = 'Is Transferable';
    theadTr.appendChild(contractTickerHeader);
    var balanceHeader = document.createElement('th');
    balanceHeader.innerHTML = 'Transfer Fees';
    theadTr.appendChild(balanceHeader);
    var usdHeader = document.createElement('th');
    usdHeader.innerHTML = 'Details';
    theadTr.appendChild(usdHeader);
    var usdHeader2 = document.createElement('th');
    usdHeader2.innerHTML = 'Options';
    theadTr.appendChild(usdHeader2);

    thead.appendChild(theadTr)

    table.className = 'table';
    table.appendChild(thead);
    for (j = 0; j < nfts.result.account_nfts.length; j++) {
        var tbodyTr = document.createElement('tr');
        var contractTickerTd = document.createElement('td');
        contractTickerTd.innerHTML = '<b>' + nfts.result.account_nfts[j].NFTokenID + '</b>';
        tbodyTr.appendChild(contractTickerTd);
        var balanceTd = document.createElement('td');
        balanceTd.innerHTML = '<b>' + (nfts.result.account_nfts[j].Flags == 9? "yes":"no") + '</b>';
        tbodyTr.appendChild(balanceTd);
        var balanceUSDTd = document.createElement('td');
        balanceUSDTd.innerHTML = '<b>' + nfts.result.account_nfts[j].TransferFee != undefined ? nfts.result.account_nfts[j].TransferFee : "-" + '</b>';
        tbodyTr.appendChild(balanceUSDTd);
        var balanceUSDTd2 = document.createElement('td');
        balanceUSDTd2.innerHTML = '<b> <a class="btn btn-primary" href="' + xrpl.convertHexToString(nfts.result.account_nfts[j].URI) + '"> See details</a></b>';
        tbodyTr.appendChild(balanceUSDTd2);
        var balanceUSDTd3 = document.createElement('td');
        balanceUSDTd3.innerHTML = '<b> <a class="btn btn-secondary" href="https://localhost:7052/Ticket/SellOffer/' + nfts.result.account_nfts[j].NFTokenID + '"> Create sell offer</a></b>';
        tbodyTr.appendChild(balanceUSDTd3);
        tbody.appendChild(tbodyTr);
    }
    table.appendChild(tbody);

    list.appendChild(table);

    client.disconnect();
}


var publicKey = localStorage.getItem('userSeed');
if (publicKey != null) {
    $('#loginMenu').css('display', 'none');
    $('#logoutMenu').css('display', 'block');
}
else {
    $('#loginMenu').css('display', 'block');
    $('#logoutMenu').css('display', 'none');
}

function logout() {
    var publicKey = localStorage.getItem('userSeed');
    //web3.eth.accounts.wallet.clear();
    localStorage.removeItem('userSeed');
    location.href = "/Home/Access";
}

async function createSellOffer() {
    const standby_wallet = xrpl.Wallet.fromSeed(localStorage.userSeed)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net")
    await client.connect()
    var expirationDate = null
    var days = $('#ExpirationDays').val();
    let d = new Date()
    d.setDate(d.getDate() + parseInt(days))
    expirationDate = xrpl.isoTimeToRippleTime(d)
    
    // Prepare transaction -------------------------------------------------------
    let transactionBlob = {
        "TransactionType": "NFTokenCreateOffer",
        "Account": standby_wallet.classicAddress,
        "NFTokenID": $('#NFTokenID').val(),
        "Amount": xrpl.xrpToDrops($('#Amount').val()),
        "Flags": 1,
    }
    if (expirationDate != null) {
        transactionBlob.Expiration = expirationDate
    }
    transactionBlob.Destination = $('#Destination').val()
    

    // Submit transaction --------------------------------------------------------

    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet })

    if (tx.result != null && tx.result.meta != null && tx.result.meta.TransactionResult != null
        && tx.result.meta.TransactionResult == "tesSUCCESS") {
        $('#AccountId').val(standby_wallet.classicAddress);
        $('#Form_submitTransaction').submit();
    }
    else {
        $('#Form_Error').css("display", 'block');
    }
    client.disconnect()
}// End of createSellOffer()


async function buyOffer(idToken) {
    const standby_wallet = xrpl.Wallet.fromSeed(localStorage.userSeed)
    const client = new xrpl.Client("wss://s.altnet.rippletest.net")
    await client.connect()

    const transactionBlob = {
        "TransactionType": "NFTokenAcceptOffer",
        "Account": standby_wallet.classicAddress,
        "NFTokenSellOffer": idToken,
    }
    // Submit transaction --------------------------------------------------------
    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet })
    if (tx.result != null && tx.result.meta != null && tx.result.meta.TransactionResult != null
        && tx.result.meta.TransactionResult == "tesSUCCESS") {
        location.href = '/Ticket/List';
    }
    else {
        $('#Form_Error').css("display", 'block');
    }
    client.disconnect()
}