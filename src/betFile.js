import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const handler = require('./handleFile')

function decodeData(dataBet){

	let data = []
	data.push(dataBet[0])
	data.push(dataBet[1])
	data.push(wallet.getAddressFromScriptHash(u.reverseHex(hexlify(dataBet[2]))))
	let dataBlocks = []
	for (let i = 0; i < 4; i++){
		if (typeof dataBet[3][i] == "string"){
			let string = '0x' + u.reverseHex(hexlify(dataBet[3][i]))
			dataBet[3][i] = parseInt(string)
		}
		dataBlocks.push(dataBet[3][i])
	}	
	for (let i = 4; i < 7; i++){
		dataBlocks.push(dataBet[3][i])
	}
	data.push(dataBlocks)
	data.push([])
	for (let i = 0; i < dataBet[4].length; i++){
		let dataTemp = []
		dataTemp.push(dataBet[4][i][0])
		for (let j = 1; j < 4; j++){
			dataTemp.push([])
			for (let h = 0; h < dataBet[4][i][j].length; h++){
				dataTemp[j].push(wallet.getAddressFromScriptHash(u.reverseHex(hexlify(dataBet[4][i][j][h]))))
			}
		}
		data[4].push(dataTemp)
	}
	if (typeof dataBet[5] == "string"){
		let string = '0x' + u.reverseHex(hexlify(dataBet[5]))
		dataBet[5] = parseInt(string)
	}
	data.push(dataBet[5])
	return data
}


async function list(dataBet, player, nos, scriptHash){
	let data = decodeData(dataBet)
	let playerAdd = wallet.getAddressFromScriptHash(u.reverseHex(hexlify(player)))
	document.getElementById("side").innerHTML = ""
	let bet = await instantiateBet(data, playerAdd, nos, scriptHash)
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
	let playerStats = ["Partecipation", "validation", "Result", "Payments"]
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
				if (getPlayerStatus[0][3] != "winPayed"){
				  let payButton = document.createElement("input")
				  payButton.type = "button"
				  payButton.dataset.group = bet.group
				  payButton.dataset.text = bet.text
				  payButton.dataset.operation = "withdraw_win"
				  payButton.className = "btn btn-success payButton"
				  payButton.value = "Get win"
				  tdBody.appendChild(payButton)  
				}
				else{
				  tdBody.innerHTML = "Payed"
				}
			}
			else if (getPlayerStatus[0][2] == "Refund"){ 
				if (getPlayerStatus[0][3] != "refundPayed"){
				  let payButton = document.createElement("input")
				  payButton.type = "button"
				  payButton.dataset.group = bet.group
				  payButton.dataset.text = bet.text 
				  payButton.dataset.operation = "withdraw_refund" 
				  payButton.className = "btn btn-warning payButton"
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
	let	betDetailsLabels = ["Text", "Group", "Creator", "Can add proposal", "Token used", "Created at block", "Open until block", "Close untile block", "On validation until block", "Amount Bet"]
	let betDetails = [bet.text, bet.group, bet.creator, bet.addProposal, bet.usedToken, bet.blocks.createAtBlock, bet.blocks.openBlock, bet.blocks.closeBlock, bet.blocks.validateBlock, bet.amountToBet]
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
			winner.innerHTML = "-"
			winnersTable.appendChild(winner)  
	}
	table.appendChild(winnersTable)
  	document.getElementById("side").appendChild(table)

	let clearSide = document.createElement("div")
	clearSide.id = "clearSide"
	clearSide.className = "col-2"
	let clearSideButton = document.createElement("input")
	clearSideButton.id = "clearSideButton"
	clearSideButton.className = "text-center btn btn-dark"
	clearSideButton.type = "button"
	clearSideButton.value = "Clear"
	clearSide.appendChild(clearSideButton)
	document.getElementById("side").appendChild(clearSide)

}

function create(player, groupName, nos, scriptHash){
	let side = document.getElementById("side");
	let form = document.createElement("form")
	form.id = "createBetForm"
	let betLabels = ["Bet text", "Amount to bet", "Open for blocks", "Close for blocks", "validation for blocks", "Token used"]
	let betArgs = ["betText", "amountToBet", "openBlock", "closeBlock", "validateBlock", "tokenUsed"]
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
	invokeCreateBetButton.dataset.group = groupName
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
	else if((bet.blocks.closeBlock <= bet.blocks.currentBlock) && (bet.blocks.currentBlock < bet.blocks.validateBlock)){
		bet.status = "onvalidation"
	}
	else{
		bet.status ="validated"
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
		for (var j = 0; j < bet.proposals[i].nvalidators; j++){
			if (bet.proposals[i].validators[j] == bet.player.address){
				bet.player.hasvalidated = true,
				bet.player.validationProposal = bet.proposals[i].text
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
	if (bet.status == "validated"){
		for(var i = 0; i < bet.nProposals; i++){	
			if (bet.proposals[i].nvalidators >= bet.magicNumber){
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
	else if(bet.status == "onvalidation"){
		text = "Bet on validation"
		textColor = "text-warning"
	}
	else{
		text = "Bet validated"
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


function getTextPlayerStatus(bet){
	let text = []
    let textColor = []
    if (bet.player.hasBet){
      text.push(bet.player.betProposal)
    }
    else{
      text.push("Not partecipated")
    }
    if (bet.player.hasvalidated){
      text.push(bet.player.validationProposal)
    }
    else{
      text.push("Not validated")
    }
    textColor.push("text-primary")
    textColor.push("text-primary")
    if (bet.status == "validated"){
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
    else if(bet.status == "onvalidation"){
      text = "Bet on validation"
      textColor = "text-warning"
    }
    else{
      text = "Bet validated"
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
    let head = ["#", "Proposal", "Partecipants", "validators", "N. validations"]
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
		if (bet.status == "onvalidation" || (bet.status == "open" && !bet.player.hasBet)){
			let proposalButton = document.createElement("input")
			proposalButton.type = "button"
			proposalButton.dataset.group = bet.group
			proposalButton.dataset.text = bet.text
			if (bet.status == "open"){
				proposalButton.dataset.operation = "partecipate_bet"
			}
			else{
				proposalButton.dataset.operation = "validate_bet"
			}
			proposalButton.className = "btn btn-light proposalButton"
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
		let validatorsTd = document.createElement('td')
		validatorsTd.className = "text-center"
		validatorsTd.innerHTML = ""
		for (let j = 0; j < bet.proposals[i].nvalidators; j++){
		  	validatorsTd.innerHTML += bet.proposals[i].validators[j] + "<br>"
		}
		proposalTrBody.appendChild(validatorsTd)
		let nvalidationsTd = document.createElement('td')
		nvalidationsTd.className = "text-center"
		if (bet.status == "onvalidation" || bet.status == "validated"){
			if (bet.proposals[i].nvalidators >= bet.magicNumber){
		  		nvalidationsTd.className += " text-success"
			}
			else{
				nvalidationsTd.className += " text-danger"
			}
		}
		nvalidationsTd.innerHTML = bet.proposals[i].nvalidators + "/" + bet.magicNumber     
		proposalTrBody.appendChild(nvalidationsTd) 
		proposalTableBody.appendChild(proposalTrBody)
	}
    if ( bet.addProposal  && bet.status == "open" && !bet.player.hasBet){
		let proposalTrBody = document.createElement('tr')
		let thBody = document.createElement('th')
		thBody.scope = "col"
		thBody.innerHTML = bet.nProposals+1
		proposalTrBody.appendChild(thBody)
		let addProposalTd = document.createElement('td')
		addProposalTd.className = "text-center"
		let addProposalFieldInput = document.createElement("input")
		addProposalFieldInput.className = "text-center"
		addProposalFieldInput.id = "addProposalFieldInput"
		addProposalFieldInput.type = "text"
		addProposalFieldInput.placeholder = "Another?"
		addProposalTd.appendChild(addProposalFieldInput)
		let addProposalFieldButton = document.createElement("input")
		addProposalFieldButton.type = "button"
		addProposalFieldButton.dataset.group = bet.group
		addProposalFieldButton.dataset.text = bet.text
		addProposalFieldButton.dataset.operation = "partecipate_bet"	
		addProposalFieldButton.className = "btn btn-light"
		addProposalFieldButton.id =  "addProposalFieldButton"
		addProposalFieldButton.innerHTML = ""
		addProposalTd.appendChild(addProposalFieldButton)
		proposalTrBody.appendChild(addProposalTd) 
		proposalTableBody.appendChild(proposalTrBody)
    }  
    proposalTable.appendChild(proposalTableBody)    
    return proposalTable
}

async function instantiateBet(data, player, nos, scriptHash){
	let operation = "get_height"
	let args = []
	let bet 
	await nos.testInvoke({scriptHash,operation,args})
		.then((returnArray) => {
			bet = {
				text : data[1],
				status : null, //open, close, onvalidation, validated
				group : data[0],
				creator : data[2], 
				amountToBet : parseFloat(data[3][3]) / Math.pow(10, 8),
				usedToken : data[3][4],
				magicNumber : null,
				nPlayers : data[3][6],
				blocks : {
					currentBlock : parseInt(returnArray["stack"][0]["value"][0]["value"]),
					createAtBlock : data[5],
					openBlock : null,
					closeBlock : null,
					validateBlock : null
				},
				nProposals : null,
				addProposal : null, //true, false
				proposals : [],
					// ["yes" , { betters : null, validators : null, alreadyPayedPlayers : null }]
				player : {
					address : player,
					hasBet : false, //yes, no
					betProposal : null,
					betProposalIndex : null,
					hasvalidated : false, //yes, no
					validationProposal : null, 
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
  	
	let stringAddProposal

	if (data[3][5] == '1'){
		stringAddProposal = 1
	}

	else if (data[3][5]){
		stringAddProposal = parseInt('0x' + u.reverseHex(hexlify(data[3][5])))
	}
	else{
		stringAddProposal = 0
	}

	if (stringAddProposal  != 1){
	bet.addProposal = false
	}
	else{
	bet.addProposal = true
	}

	if (!data[3][0]){
		bet.blocks.openBlock = bet.blocks.createAtBlock 
	}
	else{
		bet.blocks.openBlock = bet.blocks.createAtBlock + data[3][0]
	}
	if (!data[3][1]){
		bet.blocks.closeBlock = bet.blocks.openBlock
	}
	else{
		bet.blocks.closeBlock = bet.blocks.openBlock + data[3][1]
	}
	if (!data[3][2]){
		bet.blocks.validateBlock = bet.blocks.closeBlock
	}
	else{
	bet.blocks.validateBlock = bet.blocks.closeBlock + data[3][2]
	}

	bet.nProposals = data[4].length

	for (var i = 0; i < bet.nProposals; i++){
		bet.proposals.push({text : data[4][i][0], betters : [], validators : [], alreadyPayedPlayers : [], nBetters : 0, nvalidators : 0, nAlreadyPayedPlayers : 0 })
		for(var j = 0; j < data[4][i][1].length; j++){
			bet.proposals[i].betters.push(data[4][i][1][j])
		}
		for(var j = 0; j < data[4][i][2].length; j++){
			bet.proposals[i].validators.push(data[4][i][2][j])
		}
		for(var j = 0; j < data[4][i][3].length; j++){
			bet.proposals[i].alreadyPayedPlayers.push(data[4][i][3][j])
		}
		bet.proposals[i].nBetters = data[4][i][1].length
		bet.proposals[i].nvalidators = data[4][i][2].length
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
	return bet
}

async function getBetStatus(data, nos, scriptHash){
	let operation = "get_height"
	let args = []
	let bet

	await nos.testInvoke({scriptHash,operation,args})
		.then((returnArray) => {
			  bet = {
				    status : null, //open, close, onvalidation, validated, payed
				    blocks : {
				      currentBlock : returnArray["stack"][0]["value"][0]["value"], 
				      createAtBlock : data[5],
				      openBlock : null,
				      closeBlock : null,
				      validateBlock : null
				    }
				  }
			  bet.blocks.openBlock = bet.blocks.createAtBlock + data[3][0]
			  bet.blocks.closeBlock = bet.blocks.openBlock + data[3][1]
			  bet.blocks.validateBlock = bet.blocks.closeBlock + data[3][2]
			  
			  checkBetStatus(bet)
			   
			  
		});

	return bet.status
}

async function getBetResult(dataBet, player, nos, scriptHash){
	let playerAdd = wallet.getAddressFromScriptHash(u.reverseHex(hexlify(player)))
	let data = decodeData(dataBet)
	let bet = await instantiateBet(data, playerAdd, nos, scriptHash)
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

	let returnArr = []
	returnArr.push(betResult)
	returnArr.push(bet.group)
	returnArr.push(bet.text)

 	return returnArr
}
	
	
module.exports.list = list
module.exports.create = create
module.exports.getBetStatus = getBetStatus
module.exports.getBetResult = getBetResult
