import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function list(data, player, nPlayers, nos, scriptHash){
	let bet = instantiateBet(data, player, nPlayers)
	var text = "<b>" + bet.text + "</b></br>"
	text += "Group :" + bet.group + "</br>"
	text += "Created by :" + bet.creator + "</br>"
	text += "Created at block :" + bet.blocks.createAtBlock + "</br>"
	text += "Open until block :" + bet.blocks.openBlock  + "</br>"
	text += "Close until block :" + bet.blocks.closeBlock  + "</br>"
	text += "Convalidation until block :" + bet.blocks.convalidateBlock  + "</br>"
	text += "Used token :" + bet.usedToken + "</br>"
	text += "Amount to bet :" + bet.amountToBet + "</br>"
	if (bet.addProposal == "y"){
		text += "Can add results : Yes</br>"
	}
	else{
		text += "Can add results : No</br>"
	}
	
	text += "<b>" + getTextBetStatus(bet) + "</b></br>"
	text += "<b>" + getTextPlayerStatus(bet) + "</b></br>"
	text += "Results : " + getTextResults(bet)
	var table = "<table>"
	for (var i = 0; i < bet.nProposals; i++){
		table += "<tr><td>"
		table += getTextProposal(bet, i)

		table += "</td><td>"

		for (var j = 0;  j < bet.proposals[i].nBetters; j++){
			table  += bet.proposals[i].betters[j] + "</br>"
		}
		table += "</td><td>"
		
		for (var j = 0;  j < bet.proposals[i].nConvalidators; j++){
			table  += bet.proposals[i].convalidators[j] + "</br>"
		}
		table += "</td></tr>"
	}
	if ((bet.addProposal == "y" && bet.status == "open") && not (bet.player.hasBet)){
		table += "<tr><td><div class = 'proposalAdd'><input type = 'text' name = 'addProposalInput'><input class = 'proposalButton' type = 'button' value = 'Add Proposal'></div></td><td></td><td></td></tr>"
	}
	table += "</table>"
	text += "Proposals : </br>" + table
	text += "</br></br><input id = 'clearSide' type = 'button' value = 'Clear'>"
	

	$("#side").on("click",".proposalButton", function (){
		let operation 
		let args = []
		args.push(bet.player.address)
		args.push(bet.group)
		args.push(bet.text)
		if ($(this).parent().attr('class') == 'proposalPartecipate'){
			operation = "partecipate_bet"
			args.push($(this).val())
		}
		else if ($(this).parent().attr('class') == 'proposalConvalidation'){
			operation = "convalidate_bet"
			args.push($(this).val())
		}
		else if ($(this).parent().attr('class') == 'proposalAdd'){
			operation = "partecipate_bet"
			args.push($(this).parent().find('input[name = "addProposalInput"]').val())
		}
	console.log('prova1')
		nos.invoke({scriptHash,operation,args})
    		.then((txid) => alert(`Invoke txid: ${txid} `))
    		//.catch((err) => alert(`Error: ${err.message}`));
	});

	$("#side").on("click","#pay", function (){
		let operation = "pay_bet"
		let args = []
		args.push(bet.player.address)
		args.push(bet.group)
		args.push(bet.text)
		nos.invoke({scriptHash,operation,args})
    		.then((txid) => alert(`Invoke txid: ${txid} `))
    		//.catch((err) => alert(`Error: ${err.message}`));
	});		
	return text
}

function create(player, groupName, nos, scriptHash){
	let side = document.getElementById("side");
	//while (side.firstChild) {
		//side.removeChild(side.firstChild);
	//}
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
	labelCheckBox.className = "form-check-label"
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
	
	$("#side").on("click","#addProposalButton", function(){
		let Proposal = $(this).parents("#addProposal").find("#addProposalForm").val()
		$(this).parents("#addProposal").find("#addProposalForm").val("")
		let addedProposal = document.createElement("div")
		addedProposal.className = "form-row addedProposal"
		let div5 = document.createElement("div")
		div5.className = "col-11"
		let inputProposal = document.createElement("input")
		inputProposal.className = "form-control proposal"
		inputProposal.disabled = true
		inputProposal.type = "text"
		inputProposal.value = Proposal
		div5.appendChild(inputProposal)
		addedProposal.appendChild(div5)
		let div7 = document.createElement("div")
		div7.className = "col-auto"
		let added = document.createElement("input")
		added.type = "button"
		added.className = "btn btn-dark"
		added.id =  "removeProposalButton"
		added.innerHTML = ""
		div7.appendChild(added)
		addedProposal.appendChild(div7)
		document.getElementById("createBetForm").appendChild(addedProposal)
	});

	$("#side").on("click","#removeProposalButton", function(){
		$(this).parents(".addedProposal").remove()
	});
	$("#side").on("click","#invokeCreateBetButton", function (){
		let operation = ('create_bet')
		let args = []
		args.push(player)
		args.push(groupName)
		args.push($("#side").find('#betText').val())
		args.push($("#side").find('#openBlock').val())
		args.push($("#side").find('#closeBlock').val())
		args.push($("#side").find('#convalidateBlock').val())
		args.push($("#side").find('#amountToBet').val())
		args.push($("#side").find('#tokenUsed').val())
		if ($("#canAddProposal").is(':checked')){
			args.push('y')
		}
		else{
			args.push('n')
		}
		$('.addedProposal').each(function(i) {
			let addedProposal  = $(this).find(".proposal").val()
			if (addedProposal){
				args.push(addedProposal)
			}

		});
		nos.invoke({scriptHash,operation,args})
		.then((txid) => alert(`Invoke txid: ${txid} `))
		//.catch((err) => alert(`Error: ${err.message}`));
	});
}


function checkBetStatus(bet){
	if (bet.alreadyPayed == 1){
		bet.status = "payed"
	}
	else{
		if (bet.currentBlock < bet.openBlock){
			bet.status = "open"
		}
		else if((bet.openBlock <= bet.currentBlock) && (bet.currentBlock < bet.closeBlock)){
			bet.status = "close"
		}
		else if((bet.closeBlock <= bet.currentBlock) && (bet.currentBlock < bet.convalidateBlock)){
			bet.status = "onConvalidation"
		}
		else{
			bet.status ="convalidated"
		}
	}
	return bet
}

function checkPlayerStatus(bet){
 
	for(var i = 0; i < bet.nProposals; i++){
		for (var j = 0; j < bet.proposals[i].nBetters; j++){
			if (bet.proposals[i].betters[j] == bet.player.address){
				bet.player.hasBet = true,
				bet.player.betProposal = bet.proposals[i].text
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
		if (bet.player.betProposal == bet.winningProposal){
			bet.player.hasWon = true
		}
		else{
			bet.player.hasWon = false
		}
	}
	return  bet
}

function checkWinningProposal(bet){		
	for(var i = 0; i < bet.nProposals; i++){
		if (bet.proposals[i].nConvalidators >= bet.magicNumber){
			bet.hasWinningProposal = true
			bet.winningProposalIndex = i
			bet.winningProposal = bet.proposals[bet.winningProposalIndex].text
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
	if (bet.alreadyPayed == 1){
		var text = "Bet payed"
	}
	else{
		if (bet.currentBlock < bet.openBlock){
			var text = "Bet open"
		}
		else if((bet.openBlock <= bet.currentBlock) && (bet.currentBlock < bet.closeBlock)){
			var text = "Bet close"
		}
		else if((bet.closeBlock <= bet.currentBlock) && (bet.currentBlock < bet.convalidateBlock)){
			var text = "Bet to convalidate"
		}
		else{
			var text = "Bet convalidated and to pay"
		}
	}
	return text
}


function getTextPlayerStatus(bet){
	let text = ""
	text += "Player : <ol>"
	text += "<li>"

	if (bet.player.hasBet){
		text += "Bet : " + bet.player.betProposal 
	}
	else {
		text += "No Bet"
	}
	text += "</li><li>"

	if (bet.player.hasConvalidated){
		text += "Convalidation : " + bet.player.convalidationProposal 
	}
	else {
		text += "No Convalidation"
	}
	text += "</li><li>"

	if (bet.status == "convalidated" || bet.staus == "payed"){
		if (bet.player.hasBet && bet.hasWinningProposal){
				if (bet.player.hasWon){
					text += "Winner" //aggiungere quantità vinta?
				}
				else {
					text += "Loser" //aggiungere quantità persa?
				}
			}
			else{
				text += "No Winning Proposal"
			}	
	}

	text += "</li>" //gestire il payed
	return text
}
	
function getTextResults(bet){
	let text = ""
	if (bet.hasWinningProposal){
		if (bet.winners.length > 0){
			text += "Winners are : <ol>"
			for (var j = 0; j < bet.winners.length; j++){
				text  += "<li>" + bet.winners[j] + "</li>"
			}
			text += "</ol>  </br>"
		}
		else{
			text += "No winners  </br>"			
		}
	}
	else{
		text += "No convalidated proposal </br>"
	}
	if (bet.status == "convalidated"){
		text += "<div id = 'payBet><input id = 'pay' type = 'button' value = 'Pay the Bet'></div>" //gestire il pagamento / refund  
	}

	else if(bet.status == "payed"){
		text += "Bet Payed  </br>"
	} 
	else{
		text = "No Results  </br>"
	}
	return text
}

function getTextProposal(bet, index){
	var table = ""
	if ((bet.status == "open" && bet.player.hasBet) || (bet.status == "close") || (bet.status == "payed") || (bet.status == "convalidated")){
		table += "<div class = 'proposalId'>" + bet.proposals[index].text + "</div>"
	}
	else if((bet.status == "open") && not (bet.player.hasBet)){
		table += "<div class = 'proposalPartecipate'><input class = 'proposalButton' type = 'button' value = '" + bet.proposals[index].text +"'></div>"  
	}
	else if (bet.status == "onConvalidation"){
		table += "<div class = 'proposalConvalidation'><input class = 'proposalButton' type = 'button' value = '" + bet.proposals[index].text +"'></div>"  
	}
	return table
}

function instantiateBet(data, player, nPlayers){

	let bet = {
		text : data[1],
		status : null, //open, close, onConvalidation, convalidated, payed
		group : data[0],
		creator : data[2], 
		amountToBet : data[3][3],
		usedToken : data[3][4],
		magicNumber : null,
		nPlayers : nPlayers,
		blocks : {
			currentBlock : null, ////capire come fare
			createAtBlock : data[5],
			openBlock : null,
			closeBlock : null,
			convalidateBlock : null
		},
		nProposals : null,
		addProposal : null, //true, false
		proposals : [],
			// ["yes" , { betters : null, convalidators : null }]
		player : {
			address : player,
			hasBet : false, //yes, no
			betProposal : null,
			hasConvalidated : false, //yes, no
			convalidationProposal : null, 
			hasWon : false, //yes, no
			payed : false //check nello storage ?
		},
		hasWinningProposal : false,
		winningProposalIndex : null,
		winningProposal : null,
		winners : [],
		alreadyPayed : data[6]
	}
	bet.blocks.openBlock = bet.blocks.createAtBlock + data[3][0]
	bet.blocks.closeBlock = bet.blocks.openBlock + data[3][1]
	bet.blocks.convalidateBlock = bet.blocks.closeBlock + data[3][2]

	bet.nProposals = data[4].length

	for (var i = 0; i < bet.nProposals; i++){
		bet.proposals.push({text : data[4][i][0], betters : [], convalidators : [], nBetters : 0, nConvalidators : 0 })
		for(var j = 0; j < data[4][i][1].length; j++){
			bet.proposals[i].betters.push(data[4][i][1][j])
		}
		for(var j = 0; j < data[4][i][2].length; j++){
			bet.proposals[i].convalidators.push(data[4][i][2][j])
		}
		bet.proposals[i].nBetters = data[4][i][1].length
		bet.proposals[i].nConvalidators = data[4][i][2].length
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
	return bet
}

function getBetStatus(data){
  let bet = {
    alreadyPayed : null,
    status : null, //open, close, onConvalidation, convalidated, payed
    blocks : {
      currentBlock : null, ////capire come fare
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
  return bet.status
}
	
module.exports.list = list
module.exports.create = create
module.exports.getBetStatus = getBetStatus
