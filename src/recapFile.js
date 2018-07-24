import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const betFile = require('./betFile')
const des = require('./deserialize')

function balance(data, totalBalance, sign){
  let recap = document.getElementById("recap")

  let totalBalanceDiv = document.createElement("div")
  totalBalanceDiv.classname = "col col-4 text-center"
  let totalBalanceTable = document.createElement("ul")
  totalBalanceTable.className = ("list-group")
  let balance = document.createElement("li")
  totalBalance = parseFloat(totalBalance) / Math.pow(10, 8)
  balance.className = ("list-group-item active text-center")
  if (sign == 0){
    if (totalBalance == 0){
      balance.className += " bg-warning"
    }
    else if (totalBalance == 0){
      balance.className += " bg-success"
    }
  }
  else{
    balance.className += " bg-danger"
    totalBalance = totalBalance * -1
  }
  if (isNaN(totalBalance)){
    balance.innerHTML = "Total Balance : -" 
  }
  else{
    balance.innerHTML = "Total Balance : " + totalBalance
  }
  totalBalanceTable.appendChild(balance)
  totalBalanceDiv.appendChild(totalBalanceTable)
  recap.appendChild(totalBalanceDiv)

  let table = document.createElement("table")
  table.className = "table"
  let tableHead = document.createElement("thead")
  let head = ["#", "Bet Text", "Group Name", "Token Flow", "Amount"]
  let trHead = document.createElement('tr')
  for (let i = 0; i < head.length; i++){
    let thHead = document.createElement('th')
    thHead.scope = "col-auto"
    thHead.innerHTML = head[i]
    trHead.appendChild(thHead)
  }
  tableHead.appendChild(trHead)
  table.appendChild(tableHead)
  let tableBody = document.createElement("tbody")
  let body = ["betText", "groupName", "tokenFlow", "amount"]
  for (let i = 0; i < data.length; i++){
    let trBody = document.createElement('tr')
    let thBody = document.createElement('th')
    let betStatus = ""
    thBody.scope = "col"
    thBody.innerHTML = i+1
    trBody.appendChild(thBody)
    for (let j = 0; j < body.length; j++){
      let tdBody = document.createElement('td')
      tdBody.className = body[j]
      trBody.appendChild(tdBody)
      if (body[j] == "tokenFlow"){
        console.log(data[i][body[j]])
        console.log(typeof data[i][body[j]])
        if (data[i][body[j]] == '0'){
          tdBody.innerHTML = "Payment"
          tdBody.className += " text-primary"
        }
        else if (data[i][body[j]] == '1'){
          tdBody.innerHTML = "Win"  
          tdBody.className += " text-success"
        }
        else if (data[i][body[j]] == '2'){
          tdBody.innerHTML = "Refund"
          tdBody.className += " text-warning"
        }
      }
      else if (body[j] == "amount"){
        let amount = parseFloat(data[i][body[j]]) / Math.pow(10, 8)
        tdBody.innerHTML = amount
      }
      else{
        tdBody.innerHTML = data[i][body[j]]
      }
    }
    tableBody.appendChild(trBody)
  }
  table.appendChild(tableBody)
  recap.appendChild(table)

  let clearBalance = document.createElement("div")
  clearBalance.id = "clearBalance"
  clearBalance.className = "col-2"
  let clearBalanceButton = document.createElement("input")
  clearBalanceButton.id = "clearBalanceButton"
  clearBalanceButton.className = "text-center btn btn-dark"
  clearBalanceButton.type = "button"
  clearBalanceButton.value = "Clear"
  clearBalance.appendChild(clearBalanceButton)
  recap.appendChild(clearBalance) 

}

function table(data, nos, scriptHash){  
  let recap = document.getElementById("recap")
  let table = document.createElement("table")
  let currentAddress
  table.className = "table"
  let tableHead = document.createElement("thead")
  let head = ["#", "Bet Text", "Group Name", "Created at", "Amount Bet", "Status", "Get Wins/Refunds"]
  let trHead = document.createElement('tr')
  for (let i = 0; i < head.length; i++){
    let thHead = document.createElement('th')
    thHead.scope = "col-auto"
    thHead.innerHTML = head[i]
    trHead.appendChild(thHead)
  }
  tableHead.appendChild(trHead)
  table.appendChild(tableHead)
  
  let tableBody = document.createElement("tbody")
  let body = ["betText", "groupName", "createdAt", "amountBet", "status", "getToken"]
  for (let i = 0; i < data.length; i++){
    let trBody = document.createElement('tr')
    let thBody = document.createElement('th')
    let betStatus = ""
    thBody.scope = "col"
    thBody.innerHTML = i+1
    trBody.appendChild(thBody)
    for (let j = 0; j < body.length; j++){
      let tdBody = document.createElement('td')
      tdBody.className = body[j]
      trBody.appendChild(tdBody)
      if (tdBody.className == "status"){

        if (data[i]["payed"] == 1){
          tdBody.innerHTML = "Winner"
        }
        else if (data[i]["payed"] == 2){
          tdBody.innerHTML = "Refund"
        }
        else{
          tdBody.innerHTML = "Loading" // + loading gif
        }
      }
      else if (tdBody.className == "getToken"){
        tdBody.innerHTML = "Loading"
        if ((data[i]["payed"] == 1) || (data[i]["payed"] == 2)){
          tdBody.innerHTML = ""
        }
        else{
            let tdStatus = tdBody.parentNode.childNodes[5]
            Promise.resolve(betFile.getBetStatus([0,0,0,data[i]["blocks"],0,data[i]["createdAt"]], nos, scriptHash)
                .then((betStatus) => {
                if (betStatus != "convalidated"){
                  
                  if (betStatus == "open"){
                    tdStatus.innerHTML = "Open"
                  }
                  else if (betStatus == "close"){
                    tdStatus.innerHTML = "Closed"    
                  }
                  else if (betStatus == "onConvalidation"){
                    tdStatus.innerHTML = "On convalidation"    
                  }  
                  tdBody.innerHTML = ""
                }
                else{
                let key = data[i]["groupName"] + data[i]["betText"]
                let decodeOutput = false
                nos.getStorage({scriptHash, key, decodeOutput})
                    .then((rawData) => {
                      nos.getAddress()
                        .then((betterAddress) => {
                          if (betterAddress){
                            betterAddress = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(betterAddress)))
                            currentAddress = betterAddress
                            let dataBet = des.deserialize(rawData)
                            Promise.resolve(betFile.getBetResult(dataBet, betterAddress, nos, scriptHash) //trovare un modo per num dipeople)
                                .then((betResult) => {
                                  if (betResult == "win"){
                                    tdStatus.innerHTML = "Winner"
                                    let payButton = document.createElement("input")
                                    payButton.type = "button"
                                    payButton.className = "btn btn-success getWinButton"
                                    payButton.value = "Get win"
                                    tdBody.appendChild(payButton)
                                  }
                                  else if (betResult == "lose"){
                                    tdStatus.innerHTML = "Loser"
                                    tdBody.innerHMTL = ""
                                  }
                                  else if (betResult == "refund"){
                                    tdStatus.innerHTML = "Refund"
                                    tdBody.innerHTML = ""
                                    let payButton = document.createElement("input")
                                    payButton.type = "button"
                                    payButton.className = "btn btn-warning getRefundButton"
                                    payButton.value = "Get refund"
                                    tdBody.appendChild(payButton)
                                  }
                                }));
                          }
                        });
                    });
                }
              }));
        }
         // + loading gif
      }
      else{
        tdBody.innerHTML = data[i][body[j]]
      }
    }
    tableBody.appendChild(trBody)
  }
  table.appendChild(tableBody)
  recap.appendChild(table)

  $("#recap").on("click",".getRefundButton", function (){
    let i = $(this).parents("tr").find("th").text() - 1
    let operation = "withdraw_refund"
    let args = []

    args.push(currentAddress)
    args.push(data[i]["groupName"])
    args.push(data[i]["betText"])
    nos.invoke({scriptHash,operation,args})
        .then((txid) => alert(`Invoke txid: ${txid} `))    
  });

  $("#recap").on("click",".getWinButton", function (){
    let i = $(this).parents("tr").find("th").text() - 1
    let operation = "withdraw_win"
    let args = []

    args.push(currentAddress)
    args.push(data[i]["groupName"])
    args.push(data[i]["betText"])
    nos.invoke({scriptHash,operation,args})
        .then((txid) => alert(`Invoke txid: ${txid} `))    
  });

  let clearRecap = document.createElement("div")
  clearRecap.id = "clearBalance"
  clearRecap.className = "col-2"
  let clearRecapButton = document.createElement("input")
  clearRecapButton.id = "clearBalanceButton"
  clearRecapButton.className = "text-center btn btn-dark"
  clearRecapButton.type = "button"
  clearRecapButton.value = "Clear"
  clearRecap.appendChild(clearRecapButton)
  recap.appendChild(clearRecap)

}

module.exports.table = table
module.exports.balance = balance