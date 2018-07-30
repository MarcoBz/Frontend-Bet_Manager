const des = require('./deserialize') //module to deserialize bytearray from the storage
require('babel-polyfill')
const groupFile = require('./groupFile') //module to display group information
const betFile = require('./betFile') //module to display bet information
const recapFile = require('./recapFile') //module to display summary and balance information
const checker = require('./checkInput') //module to check input before sending invocation transaction
const handler = require('./handleFile') //module to handle responses from nos promises
console.log('test')
//import { u, wallet } from '@cityofzion/neon-js';
//import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
//import {unhexlify,hexlify} from 'binascii';
const address = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')))
const scriptHash = '802d0d88b57bd0a4a32289fc3a2a2a2b7fa4be58';

const nos = window.NOS.V1;

//index page 

$(document).ready(function (){
	let player
	nos.getAddress()
		.then((loggedAddress) => {
			if (loggedAddress){

				//display all groups and buttons in the head
				document.getElementById('chooseGroup').innerHTML = "";
				document.getElementById('createGroup').innerHTML = "";
				let key = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(loggedAddress)))
				player = key
				let decodeOutput = false
				nos.getStorage({scriptHash, key, decodeOutput})
					.then((rawData) =>{
						let data = des.deserialize(rawData)
						document.getElementById('chooseGroup').innerHTML = "";
						for (let i = 0; i < data[0].length; i++){
							let groupElement = document.createElement("div")
							groupElement.className = "groupElement"
							let groupButton = document.createElement("input")
							groupButton.type = "button"
							groupButton.className = "btn btn-outline-success groupButton"
							groupButton.value = data[0][i]
							groupElement.appendChild(groupButton)
							document.getElementById('chooseGroup').appendChild(groupElement)
							}

						$('#createGroup').on("click", "#recapButton", function (){
							$("#recap").empty()
							$("#main").empty()
							$("#side").empty()
							let dataRecap = []
							for (let i = 0; i < data[1].length; i++){
								let dataTemp = {
									betText : data[1][i][0],
									groupName : data[1][i][1],
									blocks : data[1][i][2],
									createdAt : data[1][i][3],
									payed : parseInt(data[1][i][4], 10),
									amountBet : parseFloat(data[1][i][5]) / Math.pow(10, 8)
								}
								dataRecap.push(dataTemp)
							}
						recapFile.table(dataRecap, nos, scriptHash)
						});

						$('#createGroup').on("click", "#balanceButton", function (){
							$("#recap").empty()
							$("#main").empty()
							$("#side").empty()
							let dataBalance = []
							let totalBalance = data[3]
							let sign = data[4]
							for (let i = 0; i < data[2].length; i++){
								let dataTemp = {
									betText : data[2][i][0],
									groupName : data[2][i][1],
									tokenFlow : data[2][i][2],
									amount : data[2][i][3]
								}
								dataBalance.push(dataTemp)
							}
						recapFile.balance(dataBalance, totalBalance)
						});

					})
					
				let createNewElement = document.createElement("div")
				createNewElement.className = "createElement col-6"
				let createButton = document.createElement("input")
				createButton.id = "createGroupButton"
				createButton.type = "button"
				createButton.className = "btn btn-outline-primary"
				createButton.value = "Create new group"
				createNewElement.appendChild(createButton)
				let getBlock = document.createElement("input")
				getBlock.id = "getBlockButton"
				getBlock.type = "button"
				getBlock.className = "btn btn-outline-primary"
				getBlock.value = "Get current block"
				createNewElement.appendChild(getBlock)
				document.getElementById('createGroup').appendChild(createNewElement)
				let tableElement = document.createElement("div")
				tableElement.className = "tableElement col-6"
				let tableButton = document.createElement("input")
				tableButton.type = "button"
				tableButton.className = "btn btn-outline-primary"
				tableButton.value = "Recap"
				tableButton.id = "recapButton"
				tableElement.appendChild(tableButton)
				let balanceButton = document.createElement("input")
				balanceButton.type = "button"
				balanceButton.className = "btn btn-outline-primary"
				balanceButton.value = "Balance"
				balanceButton.id = "balanceButton"
				tableElement.appendChild(balanceButton)
				document.getElementById('createGroup').appendChild(tableElement)
			}
			else{
				$('#chooseGroup').html("</div> You have to login <div>")
			}
		})

	//show group details
	$('#chooseGroup').on("click",".groupButton", function (){
		$("#recap").empty()
		$("#main").empty()
		$("#side").empty()
		let key = $(this).val()
		let decodeOutput = false
		let data 
		nos.getStorage({scriptHash, key, decodeOutput})
	  		.then((rawData) => {
	  			data = des.deserialize(rawData)
	  			groupFile.list(data, key, nos, scriptHash)
	  		})
			.catch((err) => handler.handleStorage(err));
	});

	//show bet details
	$('#main').off("click",".getBetButton")
	$('#main').on("click",".getBetButton", function (){
		$("#side").empty()
		let bet = $(this).val()
		let group = $(this).data('group')
		let key = group + bet
		let decodeOutput = false
		nos.getStorage({scriptHash, key, decodeOutput})
	  		.then((rawData) => {
	  			nos.getAddress()
				.then((betterAddress) => {
					if (betterAddress){
						betterAddress = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(betterAddress)))
			  			let dataBet = des.deserialize(rawData)
			  			Promise.resolve(betFile.list(dataBet, betterAddress, nos, scriptHash))
		  			}
					else{
						$('#chooseGroup').html("</div> You have to login <div>")
					}
		  		});
	  		})
			.catch((err) => handler.handleStorage(err));
	  	});

	//show page to create a new bet
	$('#main').off("click","#createBet")
	$('#main').on("click","#createBet", function (){
		$("#side").empty()
		let groupName = $(this).data('group')
		nos.getAddress()
		.then((betterAddress) => {
			if (betterAddress){
				betterAddress = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(betterAddress)))
				betFile.create(betterAddress, groupName, nos, scriptHash)
  			}
			else{
				$('#chooseGroup').html("</div> You have to login <div>")
			}
  		});
	});

	//show page to create a new group
	$('#createGroup').off("click", "#createGroupButton")
	$('#createGroup').on("click", "#createGroupButton", function (){
			$("#recap").empty()
			$("#side").empty()
			$("#main").empty()
			groupFile.create()
	  	});

	$('#createGroup').on("click", "#getBlockButton", function (){
		handler.getBlock()
  	});

	//add address in the page for the creation of a new group
	$("#main").off("click","#addAddressButton")
	$("#main").on("click","#addAddressButton", function(){
		let newAddress = []
		let address = $(this).parents("#addAddress").find("#addAddressForm").val()
		let nickname = $(this).parents("#addAddress").find("#addNicknameForm").val()
		newAddress.push(address)
		newAddress.push(nickname)

		let allAddresses = []

		$('.addedAddress').each(function(i) {
			let actualAddress = []
			let addressParticipant  = $(this).find(".address").val()
			actualAddress.push(addressParticipant)
			let nicknameParticipant = $(this).find(".nickname").val()
			actualAddress.push(nicknameParticipant)
			allAddresses.push(actualAddress)
		});

		let checkerNewAddress = checker.checkNewAddress(newAddress, allAddresses)
		if (checkerNewAddress != "ok"){
			document.getElementById("addAddressForm").parentNode.parentNode.className += " border border-danger border-15"
			alert(`Error: ${checkerNewAddress}`)	
		}

		else{
			$(this).parents("#addAddress").find("#addAddressForm").val("")
			$(this).parents("#addAddress").find("#addNicknameForm").val("")
			let addedAddress = document.createElement("div")
			addedAddress.className = "form-row addedAddress"
			let div5 = document.createElement("div")
			div5.className = "col-6"
			let inputAddress = document.createElement("input")
			inputAddress.className = "form-control address"
			inputAddress.disabled = true
			inputAddress.type = "text"
			inputAddress.value = address
			div5.appendChild(inputAddress)
			addedAddress.appendChild(div5)
			let div6 = document.createElement("div")
			div6.className = "col-5"
			let inputNickname = document.createElement("input")
			inputNickname.className = "form-control nickname"
			inputNickname.disabled = true
			inputNickname.type = "text"
			inputNickname.value = nickname
			div6.appendChild(inputNickname)
			addedAddress.appendChild(div6)
			let div7 = document.createElement("div")
			div7.className = "col-auto"
			let added = document.createElement("input")
			added.type = "button"
			added.className = "btn btn-dark"
			added.id =  "removeAddressButton"
			added.innerHTML = ""
			div7.appendChild(added)
			addedAddress.appendChild(div7)
			document.getElementById("createGroupForm").appendChild(addedAddress)
		}
	});

	//remove address in the page for the creation of a new group	
	$("#main").on("click","#removeAddressButton", function(){
		$(this).parents(".addedAddress").remove()
	});

	//send invocation transaction to create a new group in the blockchain
	$('#main').off("click","#invokeCreateGroup")
	$('#main').on("click","#invokeCreateGroup", function (){
		let groupName = document.getElementById("groupName").value
		let checkGroupName = checker.checkString(groupName)
		let operation = ('create_group')
		let args = []
		let addresses = []
		$('.addedAddress').each(function(i) {
			let addressParticipant  = $(this).find(".address").val()
			if (addressParticipant){
				args.push(unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(addressParticipant))))
				addresses.push(addressParticipant)
			}
		});

		$('.addedAddress').each(function(i) {
			let nicknameParticipant = $(this).find(".nickname").val()
			if (nicknameParticipant){
				args.push(nicknameParticipant)
			}
		});
		let checkNumAddresses = checker.checkNumAddress(addresses)
		if (checkGroupName != "ok"){
			document.getElementById("groupName").parentNode.parentNode.className += " border border-danger border-15"
			alert(`Error: ${checkGroupName}`)			
		}

		else if (checkNumAddresses != "ok"){
			alert(`Error: ${checkNumAddresses}`)
		}

		else{
			args.push(groupName)
			nos.invoke({scriptHash, operation, args})
			.then((txid) => {
				console.log(args)
				handler.handleConfirmationTime(txid)
			})
    		.catch((err) => handler.handleInvocation(err));
	    }
  	});

	//clear pages
	$('#recap').on("click", "#clearRecapButton", function (){
		$("#recap").empty()
	});

	$('#recap').on("click", "#clearBalanceButton", function (){
		$("#recap").empty()
	});

	$('#main').on("click", "#clearMainButton", function (){
		$("#side").empty()
		$("#main").empty()
	});

	$("#side").on("click", "#clearSideButton", function (){
		$("#side").empty()
	});

	$("#recap").on("click", ".notifyButton", function (){
		$("#recap").empty()
		window.location.reload(true)
	});
	
	//add proposal in the page for the creation of a new bet
	$("#side").off("click","#addProposalButton")
	$("#side").on("click","#addProposalButton", function(){
		let newProposal = $(this).parents("#addProposal").find("#addProposalForm").val()
		let allProposals = []
		$('.addedProposal').each(function(i) {
			let addedProposal  = $(this).find(".proposal").val()
			if (addedProposal){
				allProposals.push(addedProposal)
			}
		});		

		let checkerNewProposals = checker.checkNewProposal(newProposal, allProposals)
		if (checkerNewProposals != "ok"){
			document.getElementById("addProposalForm").parentNode.parentNode.className += " border border-danger border-15"
			alert(`Error: ${checkerNewProposals}`)	
		}

		else{
			$(this).parents("#addProposal").find("#addProposalForm").val("")
			let addedProposal = document.createElement("div")
			addedProposal.className = "form-row addedProposal"
			let div5 = document.createElement("div")
			div5.className = "col-11"
			let inputProposal = document.createElement("input")
			inputProposal.className = "form-control proposal"
			inputProposal.disabled = true
			inputProposal.type = "text"
			inputProposal.value = newProposal
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
		}
	});

	//remove proposal in the page for the creation of a new bet
	$("#side").on("click","#removeProposalButton", function(){
		$(this).parents(".addedProposal").remove()
	});

	//participate or convalidate a proposal
	$("#side").on("click",".proposalButton", function (){
		let operation = $(this).data('operation')
		let args = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($(this).data('text'))
		args.push($(this).val())
		nos.invoke({scriptHash, operation, args})
		.then((txid) => {
			handler.handleConfirmationTime(txid)
		})	
		.catch((err) => handler.handleInvocation(err));				
	});

	//get winning or refund in the bet page
	$("#side").on("click",".payButton", function (){
		let operation = $(this).data('operation')
		let args = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($(this).data('text'))
		nos.invoke({scriptHash, operation, args})
		.then((txid) => {
			handler.handleConfirmationTime(txid)
		})	
		.catch((err) => handler.handleInvocation(err));				
	});

	//add a new proposal and participate 
	$("#side").on("click","#addProposalFieldButton", function (){
		let newProposal = $(this).parent().find("#addProposalFieldInput").val()
		let allProposals = []
		$('.proposalButton').each(function(i) {
			let addedProposal = $(this).val()
			if (addedProposal){
				allProposals.push(addedProposal)
			}
			console.log(addedProposal)
		});		

		let checkerNewProposals = checker.checkNewProposal(newProposal, allProposals)
		if (checkerNewProposals != "ok"){
			alert(`Error: ${checkerNewProposals}`)	
		}

		else{
			let operation = $(this).data('operation')
			let args = []
			args.push(player)
			args.push($(this).data('group'))
			args.push($(this).data('text'))
			args.push(newProposal)
			console.log(args)
			nos.invoke({scriptHash, operation, args})
			.then((txid) => {
				handler.handleConfirmationTime(txid)
			})	
			.catch((err) => handler.handleInvocation(err));		
		}		
	});

	//get winning or refund in the recap page
	$("#recap").on("click",".payButton", function (){
		let operation = $(this).data('operation')
		let args = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($(this).data('text'))
		console.log(args)
		nos.invoke({scriptHash, operation, args})
		.then((txid) => {
			handler.handleConfirmationTime(txid)
		})	
		.catch((err) => handler.handleInvocation(err));				
	});

	//send invocation transaction to create a new bet in the blockchain
	$("#side").off("click","#invokeCreateBetButton")
	$("#side").on("click","#invokeCreateBetButton", function (){
		let betArgs = ["betText", "amountToBet", "openBlock", "closeBlock", "validateBlock"]

		let checkAllFields = true

		for (let i = 0; i < betArgs.length; i++){
			if (checkAllFields){
				let inputValue = document.getElementById(betArgs[i]).value
				let checkInputValue
				if (betArgs[i] == "betText"){
					checkInputValue = checker.checkString(inputValue)
				}
				else if (betArgs[i] == "amountToBet"){
					checkInputValue = checker.checkAmount(inputValue)
				}
				else{
					checkInputValue = checker.checkBlock(inputValue)
				}
				if (checkInputValue != "ok"){
					document.getElementById(betArgs[i]).parentNode.parentNode.className += " border border-danger border-15"
					alert(`Error: ${checkInputValue}`)
					checkAllFields = false			
				}
			}
		}
		let operation = ('create_bet')
		let args = []
		let proposals = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($("#side").find('#betText').val())    
		args.push(unhexlify(u.reverseHex(int2hex(parseInt($("#side").find('#openBlock').val())))))
		args.push(unhexlify(u.reverseHex(int2hex(parseInt($("#side").find('#closeBlock').val())))))
		args.push(unhexlify(u.reverseHex(int2hex(parseInt($("#side").find('#validateBlock').val())))))
		args.push(unhexlify(u.reverseHex(int2hex(parseInt($("#side").find('#amountToBet').val()) * Math.pow(10, 8)))))
		args.push($("#side").find('#tokenUsed').val())
		if ($("#canAddProposal").is(':checked')){
			args.push(1)
		}
		else{
			args.push(0)
		}
		$('.addedProposal').each(function(i) {
			let addedProposal  = $(this).find(".proposal").val()
			if (addedProposal){
				args.push(addedProposal)
				proposals.push(addedProposal)
			}

		});		
		let checkNumProposals = checker.checkNumProposals(proposals)

		if (checkAllFields){
			if (checkNumProposals != "ok"){
				alert(`Error: ${checkNumProposals}`)
			}
			else {
				nos.invoke({scriptHash, operation, args})
				.then((txid) => {
					handler.handleConfirmationTime(txid)
				})
				.catch((err) => handler.handleInvocation(err));				
			}
		}


	});
})


