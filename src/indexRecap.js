import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const indexBet = require('./indexBet')
const des = require('./deserialize')



function table(data, nos, scriptHash){  
  let recap = document.getElementById("recap")
  let table = document.createElement("table")
  let currentAddress
  table.className = "table"
  let tableHead = document.createElement("thead")
  //let data = [{"betText" : 'a', "groupName" : 'b', "createdAt" : 'c', "amountBet" : "d", "status" : "e", "getToken" : "f"}]
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

        if (data[i]["payed"] == "w"){
          tdBody.innerHTML = "Winner"
        }
        else if (data[i]["payed"] == "r"){
          tdBody.innerHTML = "Refund"
        }
        else{
          tdBody.innerHTML = "Loading" // + loading gif
        }
      }
      else if (tdBody.className == "getToken"){
        if ((data[i]["payed"] == "w") || (data[i]["payed"] == "r")){
          tdBody.innerHTML = ""
        }
        else{
            let tdStatus = tdBody.parentNode.childNodes[5]
            Promise.resolve(indexBet.getBetStatus([0,0,0,data[i]["blocks"],0,data[i]["createdAt"]], nos, scriptHash)
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
                            Promise.resolve(indexBet.getBetResult(dataBet, betterAddress, nos, scriptHash) //trovare un modo per num dipeople)
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
                  //.catch((err) => console.log(`Error: ${err.message}`));
                }
              }));
        }
        tdBody.innerHTML = "Loading" // + loading gif

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
    console.log(i)
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

}

module.exports.table = table
