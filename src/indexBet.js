import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function list(data, player, nPlayers, nos, scriptHash){
	
	var text = "<b>" + data[1] + "</b></br>"
	text += "Group :" + data[0] + "</br>"
	text += "Created by :" + wallet.getAddressFromScriptHash(u.reverseHex(hexlify(data[2]))) + "</br>"
	text += "Created at block :" + data[5] + "</br>"
	var openBlock = data[5] + data[3][0]
	var closeBlock = openBlock + data[3][1]
	var convalidateBlock = closeBlock + data[3][2]
	var currentBlock = 1000 ////
	text += "Open until block :" + openBlock  + "</br>"
	text += "Close until block :" + closeBlock  + "</br>"
	text += "Convalidation until block :" + convalidateBlock  + "</br>"
	text += "Used token :" + data[3][4] + "</br>"
	text += "Amount to bet :" + data[3][3] + "</br>"
	if (data[3][5] == "y"){
		text += "Can add results : Yes</br>"
	}
	else{
		text += "Can add results : No</br>"
	}
	
	var checkBet = checkBetStatus(data, currentBlock, openBlock, closeBlock, convalidateBlock)
	var checkPlayer = chekPlayerStatus(data, player, nPlayers, checkBet[1]) 
	text += "<b>" + checkBet[0] + "</b></br>"
	text += "<b>" + checkPlayer[0] + "</b></br>"
	text += "Results : " + checkResults(data, checkBet[1], checkPlayer[1], nPlayers)
	var table = "<table>"
	for (var i = 0; i < data[4].length; i++){
		table += "<tr><td>"

		table += checkProposal(data[4][i][0], checkBet[1], checkPlayer[1])

		table += "</td><td>"
		for (var j = 0;  j < data[4][i][1].length; j++){
			table  += data[4][i][1][j] + "</br>"
		}
		table += "</td><td>"
		
		for (var j = 0;  j < data[4][i][2].length; j++){
			table  += data[4][i][2][j] + "</br>"
		}
		table += "</td></tr>"
	}
	if (data[3][5] == "y" && checkBet[1] == "open" && checkPlayer[1] == "nobet"){
		table += "<tr><td><div class = 'proposalAdd'><input type = 'text' name = 'addProposalInput'><input class = 'proposalButton' type = 'button' value = 'Add Proposal'></div></td><td></td><td></td></tr>"
	}
	table += "</table>"
	text += "Proposals : </br>" + table
	text += "</br></br><input id = 'clearSide' type = 'button' value = 'Clear'>"
	

	$("#side").on("click",".proposalButton", function (){
		let operation 
		let args = []
		args.push(player)
		args.push(data[0])
		args.push(data[1])
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
		nos.invoke({scriptHash,operation,args})
    		.then((txid) => alert(`Invoke txid: ${txid} `))
    		.catch((err) => alert(`Error: ${err.message}`));
	});

	$("#side").on("click","#pay", function (){
		let operation = "pay_bet"
		let args = []
		args.push(player)
		args.push(data[0])
		args.push(data[1])
		nos.invoke({scriptHash,operation,args})
    		.then((txid) => alert(`Invoke txid: ${txid} `))
    		.catch((err) => alert(`Error: ${err.message}`));
	});		
	return text
}

function create(player, groupName, nos, scriptHash){
	console.log(nos)
	let text = "<b> Create new bet </b></br><div id = 'addBetText'>"
	text += "Bet text : <input type = 'text' name = 'betText' ></div>"
	text += "<div id = 'addAmount'> Amount to bet : <input type = 'text' name = 'amount' ></div>"
	text += "<div id = 'openBlock'> Open for blocks : <input type = 'text' name = 'amount' ></div>"
	text += "<div id = 'closeBlock'> Close for blocks : <input type = 'text' name = 'amount' ></div>"
	text += "<div id = 'convalidateBlock'> Convalidation for blocks : <input type = 'text' name = 'amount' ></div>"
	text += "<div id = 'tokenUsed'> Token used : 602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7 </div>"
	text += "<div id = 'addProposal'> Can player add proposals ? <input type = 'checkbox' id = 'addProposalCheckbox'></div>"
	text += "<div id = 'proposals'> Proposals:"
	text += "<input class = 'proposalsButton' type = 'button' value = 'Add Proposal'>"
	let textAdd = "<div class = 'proposal'><div class = 'input'><input type = 'text' name = 'proposalText'></div></div>"
	text += textAdd
	text += "</div>"
	text += "<input id = 'invokeCreateBet' type = 'button' value = 'Create Bet'>"
	text += "</br></br><input id = 'clearSide' type = 'button' value = 'Clear'>"

	$("side").on("click",".proposalsButton", function (){
			$('.proposal').each(function(i) {
				let textNew = ""
				let proposalText
				let nickname
				if ($(this).find(".input").length > 0){
					proposalText = $(this).find('input').val()
					textNew += proposalText + "<input class = 'removeProposalButton' type = 'button' value = 'Remove Proposal'>"
				}
				else{
					proposalText = $(this).data("proposalText")
					textNew += proposalText + "<input class = 'removeProposalButton' type = 'button' value = 'Remove Proposal'>"
				}
				$(this).empty()
				$(this).data("proposalText", proposalText)
				$(this).append(textNew)
			});
			$('#proposals').append(textAdd)	
	  	});

	$("side").on("click",".removeProposalButton", function (){
				$(this).parents('.proposal').remove()	
	  	});

	$("side").on("click","#invokeCreateBet", function (){
		let operation = ('create_bet')
		let args = []
		args.push(player)
		args.push(groupName)
		args.push($("#side").find('#addBetText :input').val())
		args.push($("#side").find('#openBlock :input').val())
		args.push($("#side").find('#closeBlock :input').val())
		args.push($("#side").find('#convalidateBlock :input').val())
		args.push($("#side").find('#addAmount :input').val())
		args.push('602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7')
		if ($("#addProposalCheckbox").is(':checked')){
			args.push('y')
		}
		else{
			args.push('n')
		}
		$('.proposal').each(function(i) {
			let proposalText = $(this).data("proposalText")
			if (proposalText){
				args.push(proposalText)
			}
		});
		nos.invoke({scriptHash,operation,args})
    		.then((txid) => alert(`Invoke txid: ${txid} `))
    		.catch((err) => alert(`Error: ${err.message}`));
	});
	return text
}


function checkBetStatus(data, currentBlock, openBlock, closeBlock, convalidateBlock){		
	if (data[6] == 1){
		var text = "Bet payed"
		var status = "payed"
	}
	else{
		if (currentBlock < openBlock){
			var text = "Bet open"
			var status = "open"
		}
		else if((openBlock <= currentBlock) && (currentBlock < closeBlock)){
			var text = "Bet close"
			var status = "close"
		}
		else if((closeBlock <= currentBlock) && (currentBlock < convalidateBlock)){
			var text = "Bet to convalidate"
			var status = "convalidation"
		}
		else{
			var text = "Bet convalidated and to pay"
			var status ="convalidated"
		}
	}
	return [text, status]
}

function chekPlayerStatus(data, player, nPlayers, betStatus){
	var playerStatus = ""
	var playerBet 
	var playerConvalidated
	var status = "" 
	for(var i = 0; i < data[4].length; i++){
		for (var j = 0; j < data[4][i][1].length; j++){
			if (data[4][i][1][j] == player){
				playerBet = data[4][i][0]
			}
		}
		for (var j = 0; j < data[4][i][2].length; j++){
			if (data[4][i][2][j] == player){
				playerConvalidated = data[4][i][0]
			}
		}
	}	
	if (betStatus == "open" || betStatus == "close"){
		if (playerBet){
			playerStatus += "Bet - " + playerBet
			status = "bet"
		}
		else{
			playerStatus += "No Bet"
			status = "nobet"
		}

	}

	else {
		if (playerBet){
			playerStatus += "Bet - " + playerBet
		}
		else{
			playerStatus += "No Bet"
		}
		playerStatus += " / "
		if (playerConvalidated){
			playerStatus += "Convalidated - " + playerConvalidated
			status = "convalidator"
		}
		else{
			playerStatus += "No Convalidation"
			status = "noconvalidator"
		}
		if (betStatus == "convalidated" || betStatus == "payed"){
			var winningProposal = checkWinner(data, nPlayers)
			if (winningProposal[0]){
				if (data[4][winningProposal[1]][1].includes(player)){
					playerStatus += " / Win"
					status = "win"
				}
				else{
					playerStatus += " / Lose"
					status = "lose"
				}
			}
			else{
				playerStatus += " / No winning proposal"
			}
			if (betStatus == "payed"){
				playerStatus += " / Payed"
				status = "payed"
			}
		}
	}
	return [playerStatus,status]
}

function checkWinner(data, nPlayers){
	if (nPlayers % 2 == 0){
		var magicNumber = (nPlayers / 2) + 1
	}
	else{
		var magicNumber = (nPlayers + 1) / 2
	}
	for(var i = 0; i < data[4].length; i++){
		if (data[4][i][2].length >= magicNumber){
			return [true,i]		}
	}
	return [false,-1]
}

function checkProposal(data, betStatus, playerStatus){
	var table = ""
	if ((betStatus == "open" && playerStatus =="bet") || (betStatus == "close") || (betStatus == "payed") || (betStatus == "convalidated")){
		table += "<div class = 'proposalId'>" + data + "</div>"
	}
	else if (betStatus == "open" && playerStatus =="nobet"){
		table += "<div class = 'proposalPartecipate'><input class = 'proposalButton' type = 'button' value = '" + data +"'></div>"  
	}
	else if (betStatus == "convalidation"){
		table += "<div class = 'proposalConvalidation'><input class = 'proposalButton' type = 'button' value = '" + data +"'></div>"  
	}
	return table
}

function checkResults(data, betStatus, playerStatus, nPlayers){
	var text = ""
	var winningProposal
	winningProposal = checkWinner(data, nPlayers)
	if (winningProposal[0]){
		if (data[4][winningProposal[1]].length > 0){
			text += "Winners are : <ol>"
			for (var j = 0; j < data[4][winningProposal[1]][1].length; j++){
				text  += "<li>" + data[4][winningProposal[1]][1][j] + "</li>"
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

	if (betStatus == "convalidated"){
		text += "<div id = 'payBet><input id = 'pay' type = 'button' value = 'Pay the Bet'></div>"  
	}

	else if(betStatus == "payed"){
		text += "Bet Payed  </br>"
	} 
	else{
		text = "No Results  </br>"
	}
	return text
}
module.exports.list = list
module.exports.create = create