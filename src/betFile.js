import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function list(data, player, nos, scriptHash){
	document.getElementById("side").innerHTML = ""
	let await bet = instantiateBet(data, player, nos, scriptHash)
	let table = document.createElement("div")
	table.classname = "col col-4"
	let betStatus = document.createElement("ul")
	betStatus.className = ("list-group")
	let title = document.createElement("li")
	title.className = ("list-group-item active bg-success text-center")
	title.innerHTML = "Bet Status"
	betStatus.appendChild(title)
	let status = document.createElement("li")
	status.className = "list-group-item text-center " + getTextBetStatus(bet)[1]
	status.innerHTML = getTextBetStatus(bet)[0]
  	betStatus.appendChild(status)
	if (getTextBetStatus(bet)[2]){
		let winOrRefund = document.createElement("li")
		winOrRefund.className = "list-group-item text-center " + getTextBetStatus(bet)[1]
		winOrRefund.innerHTML = getTextBetStatus(bet)[2]
		betStatus.appendChild(winOrRefund)  
	}
	table.appendChild(betStatus)
	let playerStatus = document.createElement("ul")
	playerStatus.className = ("list-group")
	let playerTitle = document.createElement("li")
	playerTitle.className = ("list-group-item active bg-success text-center")
	playerTitle.innerHTML = "Player Status"
	playerStatus.appendChild(playerTitle)
	let playerList = document.createElement("li")
	playerList.className = "list-group-item"
	let playerTable = document.createElement("table")
	playerTable.className = "table"
	let playerStats = ["Partecipation", "Convalidation", "Result", "Payments"]
	let playerThead = document.createElement("thead")
	let trHead = document.createElement('tr')
	for (let i = 0; i < playerStats.length; i++){
		let thHead = document.createElement('th')
		thHead.scope = "col-auto"
		thHead.className = "text-center"
		thHead.innerHTML = playerStats[i]
		trHead.appendChild(thHead)
	}
	playerThead.appendChild(trHead)
	playerTable.appendChild(playerThead)
	let playerTbody = document.createElement("tbody")
	let getPlayerStatus = getTextPlayerStatus(bet)
	let trBody = document.createElement('tr')
	for (let i = 0; i < playerStats.length; i ++){  
		let tdBody = document.createElement('td')
		tdBody.className = "text-center " + getPlayerStatus[1][i]    
		if (i == 3){
			if (getPlayerStatus[0][2] == "Winner"){
				if (getPlayerStatus[0][2] != "winPayed"){
				  let payButton = document.createElement("input")
				  payButton.type = "button"
				  payButton.dataset.group = bet.group
				  payButton.dataset.text = bet.text  
				  payButton.className = "btn btn-success"
				  payButton.value = "Get win"
				  tdBody.appendChild(payButton)  
				}
				else{
				  tdBody.innerHTML = "Payed"
				}
			}
			else if (getPlayerStatus[0][2] == "Refund"){ 
				if (getPlayerStatus[0][2] != "refundPayed"){
				  let payButton = document.createElement("input")
				  payButton.type = "button"
				  payButton.dataset.group = bet.group
				  payButton.dataset.text = bet.text  
				  payButton.className = "btn btn-warning"
				  payButton.value = "Get refund"
				  tdBody.appendChild(payButton)
				}
				else{
				  tdBody.innerHTML = "Payed"
				}
			}
		}
		else{
		    tdBody.innerHTML = getPlayerStatus[0][i]
		}
		trBody.appendChild(tdBody)
	}
	playerTbody.appendChild(trBody) 
	playerTable.appendChild(playerTbody)
	playerList.appendChild(playerTable)
	playerStatus.appendChild(playerList)
	table.appendChild(playerStatus) 
	let allProposalTable = getTextProposal(bet)
	table.appendChild(allProposalTable)
	let	betDetailsLabels = ["Text", "Group", "Creator", "Can add proposal", "Token used", "Created at block", "Open until block", "Close untile block", "On convalidation until block"]
	let betDetails = [bet.text, bet.group, bet.creator, bet.addProposal, bet.usedToken, bet.blocks.createAtBlock, bet.blocks.openBlock, bet.blocks.closeBlock, bet.blocks.convalidateBlock]
	let betDetailsTable = document.createElement("ul")
	betDetailsTable.className = ("list-group")
	let detailTitle = document.createElement("li")
	detailTitle.className = ("list-group-item active bg-success text-center")
	detailTitle.innerHTML = "Bet Details"
	betDetailsTable.appendChild(detailTitle)
	for (let i = 0; i < betDetailsLabels.length; i++){
		let detail = document.createElement("li")
		detail.className = "list-group-item text-center "
		detail.innerHTML = betDetailsLabels[i] + "   :   " + betDetails[i]
		betDetailsTable.appendChild(detail)	
	}
	table.appendChild(betDetailsTable)
	let winnersTable = document.createElement("ul")
	winnersTable.className = ("list-group")
	let winnersTitle = document.createElement("li")
	winnersTitle.className = ("list-group-item active bg-success text-center")
	winnersTitle.innerHTML = "Winners"
	winnersTable.appendChild(winnersTitle)
	if (bet.winners.length > 0){
		for (let i = 0; i < bet.winners.length; i++){
				  let winner = document.createElement("li")
			  winner.className = "list-group-item text-center "
			  winner.innerHTML = bet.winners[i]
			  winnersTable.appendChild(winner)	     
		}  
	}
	else{
			let winner = document.createElement("li")
		  winner.className = "list-group-item text-center "
		  winner.innerHTML = -
		  winnersTable.appendChild(winner)	  
	}
	table.appendChild(winnersTable)
  	document.getElementById("side").appendChild(table)
}

function create(player, groupName, nos, scriptHash){
	let side = document.getElementById("side");
	let form = document.createElement("form")
	form.id = "createBetForm"
	let betLabels = ["Bet text", "Amount to bet", "Open for blocks", "Close for blocks", "Convalidation for blocks", "Token used"]
	let betArgs = ["betText", "amountToBet", "openBlock", "closeBlock", "convalidateBlock", "tokenUsed"]
	let betExample = ["Is NEO the best?", "0", "0", "0", "0", "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"]


	for (let i = 0; i < betArgs.length; i++){
		let argForm = document.createElement("div")
		argForm.className = "form-group row"
		let labelArgForm = document.createElement("label")
		labelArgForm.htmlFor = betArgs[i]
		labelArgForm.className = "col-5 col-form-label"
		labelArgForm.innerHTML = betLabels[i]
		let div1 = document.createElement("div")
		div1.className = "col-7"
		let inputArgForm = document.createElement("input")
		inputArgForm.className = "form-control"
		inputArgForm.id = betArgs[i]
		inputArgForm.type = "text"
		inputArgForm.placeholder = betExample[i]
		div1.appendChild(inputArgForm)
		argForm.appendChild(labelArgForm)
		argForm.appendChild(div1)
		form.appendChild(argForm)
		if (betArgs[i] == "tokenUsed"){
			inputArgForm.disabled = true
			inputArgForm.value = betExample[i]
		}
	}

	let checkBox = document.createElement("div")
	checkBox.className = "form-check"
	let labelCheckBox = document.createElement("label")
	labelCheckBox.htmlFor = "canAddProposal"
	labelCheckBox.className = "form-check-label col-5"
	labelCheckBox.innerHTML = "Can player add proposals ?"
	let inputCheckBox = document.createElement("input")
	inputCheckBox.className = "form-check-input"
	inputCheckBox.id = "canAddProposal"
	inputCheckBox.type = "checkbox"
	checkBox.appendChild(labelCheckBox)
	checkBox.appendChild(inputCheckBox)
	form.appendChild(checkBox)

	let addProposal = document.createElement("div")
	addProposal.className = "form-row"
	addProposal.id = "addProposal"
	let div2 = document.createElement("div")
	div2.className = "col-11"
	let inputProposal = document.createElement("input")
	inputProposal.className = "form-control"
	inputProposal.id = "addProposalForm"
	inputProposal.type = "text"
	inputProposal.placeholder = "Yes"
	div2.appendChild(inputProposal)
	addProposal.appendChild(div2)
	let div4 = document.createElement("div")
	div4.className = "col-auto"
	let add = document.createElement("input")
	add.type = "button"	
	add.className = "btn btn-light"
	add.id =  "addProposalButton"
	add.innerHTML = ""
	div4.appendChild(add)
	addProposal.appendChild(div4)
	form.appendChild(addProposal)
	side.appendChild(form)

	let invokeCreateBet = document.createElement("div")
	invokeCreateBet.className = "text-center"
	invokeCreateBet.id = "invokeCreateBet"
	let invokeCreateBetButton = document.createElement("input")
	invokeCreateBetButton.type = "button"
	invokeCreateBetButton.id = "invokeCreateBetButton"
	invokeCreateBetButton.value = "Submit to creation new Bet"
	invokeCreateBetButton.className = "btn btn-success"
	invokeCreateBet.appendChild(invokeCreateBetButton)
	side.appendChild(invokeCreateBet)
	
	let clearSide = document.createElement("div")
	clearSide.id = "clearSide"
	clearSide.className = "col-2"
	let clearSideButton = document.createElement("input")
	clearSideButton.id = "clearSideButton"
	clearSideButton.className = "text-center btn btn-dark"
	clearSideButton.type = "button"
	clearSideButton.value = "Clear"
	clearSide.appendChild(clearSideButton)
	side.appendChild(clearSide)

	$("input").keydown(function(){
		$(this).parent().parent().removeClass("border border-danger border-15")
	});


}


function checkBetStatus(bet){
	if (bet.blocks.currentBlock < bet.blocks.openBlock){
		bet.status = "open"
	}
	else if((bet.blocks.openBlock <= bet.blocks.currentBlock) && (bet.blocks.currentBlock < bet.blocks.closeBlock)){
    	bet.status = "close"
	}
	else if((bet.blocks.closeBlock <= bet.blocks.currentBlock) && (bet.blocks.currentBlock < bet.blocks.convalidateBlock)){
		bet.status = "onConvalidation"
	}
	else{
		bet.status ="convalidated"
	}
	return bet
}

function checkPlayerStatus(bet){
 
	for(var i = 0; i < bet.nProposals; i++){
		for (var j = 0; j < bet.proposals[i].nBetters; j++){
			if (bet.proposals[i].betters[j] == bet.player.address){
				bet.player.hasBet = true,
				bet.player.betProposal = bet.proposals[i].text
				bet.player.betProposalIndex = i
			}
		}
		for (var j = 0; j < bet.proposals[i].nConvalidators; j++){
			if (bet.proposals[i].convalidators[j] == bet.player.address){
				bet.player.hasConvalidated = true,
				bet.player.convalidationProposal = bet.proposals[i].text
			}
		}
	}

	if (bet.hasWinningProposal){
		if (bet.player.hasBet){
			if (bet.player.betProposal == bet.winningProposal){
				bet.player.hasWon = true
					for (var j = 0; j < bet.proposals[bet.winningProposalIndex].nAlreadyPayedPlayers; j++){
						if (bet.proposals[bet.winningProposalIndex].alreadyPayedPlayers[j] == bet.player.address){
							bet.player.payed = true
						}
					}
			}
			else{
				bet.player.hasWon = false
			}
		}
	}

	else if (bet.needRefund){
		if (bet.player.hasBet){
			for (var j = 0; j < bet.proposals[bet.player.betProposalIndex].nAlreadyPayedPlayers; j++){
				if (bet.proposals[bet.player.betProposalIndex].alreadyPayedPlayers[j] == bet.player.address){
					bet.player.payed = true
				}
			}
			bet.player.refund = true
		}	
	}
	return  bet
}

function checkWinningProposal(bet){
	if (bet.status = "convalidated"){
		for(var i = 0; i < bet.nProposals; i++){	
			if (bet.proposals[i].nConvalidators >= bet.magicNumber){
				bet.hasWinningProposal = true
				bet.winningProposalIndex = i
				bet.winningProposal = bet.proposals[bet.winningProposalIndex].text
			}
		}
		if (!bet.hasWinningProposal){
			bet.needRefund = true
		}
	}
	return bet
}


function checkResults(bet){
	if (bet.hasWinningProposal){

		for (var j = 0; j < bet.proposals[bet.winningProposalIndex].nBetters; j++){
			bet.winners.push(bet.proposals[bet.winningProposalIndex].betters[j])
		}
	}
	return bet
}

function getTextBetStatus(bet){
	if (bet.blocks.currentBlock < bet.blocks.openBlock){
		var text = "Bet open"
	}
	else if((bet.blocks.openBlock <= bet.blocks.currentBlock) && (bet.blocks.currentBlock < bet.blocks.closeBlock)){
		var text = "Bet close"
	}
	else if((bet.blocks.closeBlock <= bet.blocks.currentBlock) && (bet.blocks.currentBlock < bet.blocks.convalidateBlock)){
		var text = "Bet to convalidate"
	}
	else{
		var text = "Bet convalidated and to pay"
	}

	return text
}


function getTextPlayerStatus(bet){
	let text = []
    let textColor = []
    if (bet.player.hasBet){
      text.push(bet.player.betProposal)
    }
    else{
      text.push("Not partecipated")
    }
    if (bet.player.hasConvalidated){
      text.push(bet.player.convalidationProposal)
    }
    else{
      text.push("Not convalidated")
    }
    textColor.push("text-primary")
    textColor.push("text-primary")
    if (bet.status == "convalidated"){
      if (bet.player.hasBet){
        if (bet.hasWinningProposal){
          if (bet.player.hasWon){
            text.push("Winner")
            textColor.push("text-success")
            if (bet.player.payed){
              text.push("winPayed")
              textColor.push("text-success")
            }
            else{
              text.push(null)
              textColor.push("text-success")              
            }
          }
          else {
            text.push("Loser")  
            text.push("No payments")
            textColor.push("text-danger")
            textColor.push("text-danger")
          }
        }
        else if (bet.player.refund){
          text.push("Refund")
          textColor.push("text-warning")
          if (bet.player.payed){
            text.push("refundPayed")
            textColor.push("text-warning")
          }
          else{
            text.push(null)
            textColor.push("text-warning")             
          }
        }
      }
      else{
        text.push(null)
        text.push(null)
        textColor.push(null)  
        textColor.push(null)  
      }
    }
    else{
      text.push(null)
      text.push(null)
      textColor.push(null)  
      textColor.push(null)  
    }
    return [text,textColor]
}
	
function getTextResults(bet){
    let text
    let textColor
    let secondText
    if (bet.status == "open"){
      text = "Bet open"
      textColor = "text-primary"
    }
    else if(bet.status == "close"){
      text = "Bet close"
      textColor = "text-primary"
    }
    else if(bet.status == "onConvalidation"){
      text = "Bet on convalidation"
      textColor = "text-warning"
    }
    else{
      text = "Bet convalidated"
      if (bet.hasWinningProposal){
        secondText = "Win : " + bet.winningProposal
        textColor = "text-success"
      }
      else if (bet.needRefund){    
        secondText = "Refund"
        textColor = "text-warning"
      }
    }
    let returnArr = []
    returnArr.push(text)
    returnArr.push(textColor)
    returnArr.push(secondText)
    return returnArr
}

function getTextProposal(bet, index){
	let proposalTable = document.createElement("table")
    proposalTable.className = "table"
    let proposalTableHead = document.createElement("thead")  
    let head = ["#", "Proposal", "Partecipants", "Convalidators", "N. Convalidations"]
    let proposalTrHead = document.createElement("tr")  
    for (let i = 0; i < head.length; i++){
      let proposalThHead = document.createElement('th')
      proposalThHead.scope = "col-auto"
      proposalThHead.className = "text-center"
      proposalThHead.innerHTML = head[i]
      proposalTrHead.appendChild(proposalThHead)
    }
    proposalTableHead.appendChild(proposalTrHead)
    proposalTable.appendChild(proposalTableHead)
    let proposalTableBody = document.createElement("tbody")
	for (let i = 0; i < bet.nProposals; i++){
		let proposalTrBody = document.createElement('tr')
		let thBody = document.createElement('th')
		thBody.scope = "row"
		thBody.innerHTML = i+1
		proposalTrBody.appendChild(thBody)
		let proposalTextTd = document.createElement('td')
		proposalTextTd.className = "text-center"
		if (bet.status == "onConvalidation" || (bet.status == "open" && !bet.player.hasBet)){
			let proposalButton = document.createElement("input")
			proposalButton.type = "button"
			proposalButton.dataset.group = bet.group
			proposalButton.dataset.text = bet.text
			proposalButton.className = "btn btn-light"
			proposalButton.id =  "proposalButton"
			proposalButton.value = bet.proposals[i]['text'] 
			proposalTextTd.appendChild(proposalButton)
		}
		else{
			proposalTextTd.innerHTML = bet.proposals[i]['text']
		}
		proposalTrBody.appendChild(proposalTextTd)    
		let partecipantsTd = document.createElement('td')
		partecipantsTd.className = "text-center"
		partecipantsTd.innerHTML = ""
		for (let j = 0; j < bet.proposals[i].nBetters; j++){
	  		partecipantsTd.innerHTML += bet.proposals[i].betters[j] + "<br>"
		}
		proposalTrBody.appendChild(partecipantsTd)
		let convalidatorsTd = document.createElement('td')
		convalidatorsTd.className = "text-center"
		convalidatorsTd.innerHTML = ""
		for (let j = 0; j < bet.proposals[i].nConvalidators; j++){
		  	convalidatorsTd.innerHTML += bet.proposals[i].convalidators[j] + "<br>"
		}
		proposalTrBody.appendChild(convalidatorsTd)
		let nConvalidationsTd = document.createElement('td')
		nConvalidationsTd.className = "text-center"
		if (bet.status == "onConvalidation" || bet.status == "convalidated"){
			if (bet.proposals[i].nConvalidators >= bet.magicNumber){
		  		nConvalidationsTd.className += " text-success"
			}
			else{
				nConvalidationsTd.className += " text-danger"
			}
		}
		nConvalidationsTd.innerHTML = bet.proposals[i].nConvalidators + "/" + bet.magicNumber     
		proposalTrBody.appendChild(nConvalidationsTd) 
		proposalTableBody.appendChild(proposalTrBody)
	}
    if ( bet.addProposal){
      let proposalTrBody = document.createElement('tr')
      let thBody = document.createElement('th')
      thBody.scope = "row"
      thBody.innerHTML = bet.nProposals+1
      proposalTrBody.appendChild(thBody)
      let addProposalTd = document.createElement('td')
      addProposalTd.className = "text-center"
      let addProposalInput = document.createElement("input")
      addProposalInput.className = "text-center"
      addProposalInput.id = "addProposalInput"
      addProposalInput.type = "text"
      addProposalInput.placeholder = "Another?"
      addProposalTd.appendChild(addProposalInput)
      let addProposalButton = document.createElement("input")
      addProposalButton.type = "button"	
      addProposalButton.className = "btn btn-light"
      addProposalButton.id =  "addProposalButton"
      addProposalButton.innerHTML = ""
      addProposalTd.appendChild(addProposalButton)
      proposalTrBody.appendChild(addProposalTd) 
      proposalTableBody.appendChild(proposalTrBody)
    }  
    proposalTable.appendChild(proposalTableBody)    
    return proposalTable
}

async function instantiateBet(data, player){
	let operation = "get_height"
	let args = []
	let bet
	await nos.testInvoke({scriptHash,operation,args})
		.then((returnArray) => {
			bet = {
				text : data[1],
				status : null, //open, close, onConvalidation, convalidated
				group : data[0],
				creator : data[2], 
				amountToBet : data[3][3],
				usedToken : data[3][4],
				magicNumber : null,
				nPlayers : data[3][6],
				blocks : {
					currentBlock : returnArray["stack"][0]["value"][0]["value"],
					createAtBlock : data[5],
					openBlock : null,
					closeBlock : null,
					convalidateBlock : null
				},
				nProposals : null,
				addProposal : null, //true, false
				proposals : [],
					// ["yes" , { betters : null, convalidators : null, alreadyPayedPlayers : null }]
				player : {
					address : player,
					hasBet : false, //yes, no
					betProposal : null,
					betProposalIndex : null,
					hasConvalidated : false, //yes, no
					convalidationProposal : null, 
					hasWon : false, //yes, no
					refund : false,
					payed : false 
				},
				hasWinningProposal : false,
				winningProposalIndex : null,
				winningProposal : null,
				winners : [],
				needRefund : false
			}
  
      if (data[3][5]  == "0"){
        bet.addProposal = false
      }
      else{
        bet.addProposal = true
      }
			bet.blocks.openBlock = bet.blocks.createAtBlock + data[3][0]
			bet.blocks.closeBlock = bet.blocks.openBlock + data[3][1]
			bet.blocks.convalidateBlock = bet.blocks.closeBlock + data[3][2]

			bet.nProposals = data[4].length

			for (var i = 0; i < bet.nProposals; i++){
				bet.proposals.push({text : data[4][i][0], betters : [], convalidators : [], alreadyPayedPlayers : [], nBetters : 0, nConvalidators : 0, nAlreadyPayedPlayers : 0 })
				for(var j = 0; j < data[4][i][1].length; j++){
					bet.proposals[i].betters.push(data[4][i][1][j])
				}
				for(var j = 0; j < data[4][i][2].length; j++){
					bet.proposals[i].convalidators.push(data[4][i][2][j])
				}
				for(var j = 0; j < data[4][i][3].length; j++){
					bet.proposals[i].alreadyPayedPlayers.push(data[4][i][3][j])
				}
				bet.proposals[i].nBetters = data[4][i][1].length
				bet.proposals[i].nConvalidators = data[4][i][2].length
				bet.proposals[i].nAlreadyPayedPlayers = data[4][i][3].length
			}

			if (bet.nPlayers % 2 == 0){
				bet.magicNumber = (bet.nPlayers / 2) + 1
			}
			else{
				bet.magicNumber = (bet.nPlayers + 1) / 2
			}

			checkBetStatus(bet)
			checkWinningProposal(bet)
			checkResults(bet)
			checkPlayerStatus(bet)
		});
		//.catch((err) => alert(`Error: ${err.message}`));
	return bet
}

async function getBetStatus(data, nos, scriptHash){
	let operation = "get_height"
	let args = []
	let bet
	await nos.testInvoke({scriptHash,operation,args})
		.then((returnArray) => {
			  bet = {
				    status : null, //open, close, onConvalidation, convalidated, payed
				    blocks : {
				      currentBlock : returnArray["stack"][0]["value"][0]["value"], 
				      createAtBlock : data[5],
				      openBlock : null,
				      closeBlock : null,
				      convalidateBlock : null
				    }
				  }
			  bet.blocks.openBlock = bet.blocks.createAtBlock + data[3][0]
			  bet.blocks.closeBlock = bet.blocks.openBlock + data[3][1]
			  bet.blocks.convalidateBlock = bet.blocks.closeBlock + data[3][2]
			  checkBetStatus(bet)
			  
			  
		});
	return bet.status
}

async function getBetResult(data, player, nos, scriptHash){
	let bet = await instantiateBet(data, player, nos, scriptHash)
	let betResult = ""
	if (bet.hasWinningProposal){
		if (bet.player.hasWon){
		    betResult = "win"
		}
	    	else{
			betResult = "lose"
		}
	}
	else{
		if (bet.needRefund){
			betResult = "refund"
		}
	}
 	return betResult
}
	
	
module.exports.list = list
module.exports.create = create
module.exports.getBetStatus = getBetStatus
module.exports.getBetResult = getBetResult
