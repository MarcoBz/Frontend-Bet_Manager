const des = require('./deserialize')
require('babel-polyfill')
const groupFile = require('./groupFile')
const betFile = require('./betFile')
const recapFile = require('./recapFile')
const checker = require('./checkInput')
import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const address = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')))
const scriptHash = '0d7693d1b7c9145eda625c2d4578579ffe596b75';

const nos = window.NOS.V1;

$(document).ready(function (){
	let player
	let name
	nos.getAddress()
		.then((loggedAddress) => {
			if (loggedAddress){
				document.getElementById('chooseGroup').innerHTML = "";
				document.getElementById('createGroup').innerHTML = "";
				let key = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(loggedAddress)))
				player = key
				let decodeOutput = false
				nos.getStorage({scriptHash, key, decodeOutput})
					.then((rawData) =>{
						var data = des.deserialize(rawData)
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
					////.catch ##############
				let createNewElement = document.createElement("div")
				createNewElement.className = "createElement col-6"
				let createButton = document.createElement("input")
				createButton.id = "createGroupButton"
				createButton.type = "button"
				createButton.className = "btn btn-outline-primary"
				createButton.value = "Create new group"
				createNewElement.appendChild(createButton)
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
		.catch((err) => console.log(`Error: ${err.message}`)); //####### 

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
			.catch((err) => console.log(`Error: ${err.message}`)); //#######
		name = key

		$('#main').on("click",".getBetButton", function (){
			$("#side").empty()
			let bet = $(this).val()
			key = name + bet
			decodeOutput = false
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
				.catch((err) => console.log(`Error: ${err.message}`));
		  	});
	});

	$('#main').on("click","#createBet", function (){
		$("#side").empty()
		nos.getAddress()
		.then((betterAddress) => {
			if (betterAddress){
				betterAddress = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(betterAddress)))
				betFile.create(betterAddress, name, nos, scriptHash)
  			}
			else{
				$('#chooseGroup').html("</div> You have to login <div>")
			}
  		});
	});


	$('#createGroup').on("click", "#createGroupButton", function (){
			$("#recap").empty()
			$("#side").empty()
			$("#main").empty()
			groupFile.create(nos, scriptHash)
	  	});

	$("#main").on("click","#addAddressButton", function(){

		let newAddress = []
		let address = $(this).parents("#addAddress").find("#addAddressForm").val()
		let nickname = $(this).parents("#addAddress").find("#addNicknameForm").val()
		newAddress.push(address)
		newAddress.push(nickname)

		let allAddresses = []

		$('.addedAddress').each(function(i) {
			let actualAddress = []
			let addressPartecipant  = $(this).find(".address").val()
			actualAddress.push(addressPartecipant)
			let nicknamePartecipant = $(this).find(".nickname").val()
			actualAddress.push(nicknamePartecipant)
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
	
	$("#main").on("click","#removeAddressButton", function(){
		$(this).parents(".addedAddress").remove()
	});

	$('#main').on("click","#invokeCreateGroup", function (){
		let groupName = document.getElementById("groupName").value
		let checkGroupName = checker.checkString(groupName)
		let operation = ('create_group')
		let args = []
		let addresses = []
		$('.addedAddress').each(function(i) {
			let addressPartecipant  = $(this).find(".address").val()
			if (addressPartecipant){
				args.push(addressPartecipant)
				addresses.push(addressPartecipant)
			}
		});

		$('.addedAddress').each(function(i) {
			let nicknamePartecipant = $(this).find(".nickname").val()
			if (nicknamePartecipant){
				args.push(nicknamePartecipant)
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
				alert(`Invoke txid: ${txid} `)
				window.location.reload(true)
			})
    		//.catch((err) => alert(`Error: ${err.message}`));
	    }
  	});

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

	$("#side").on("click","#removeProposalButton", function(){
		$(this).parents(".addedProposal").remove()
	});

	$("#side").on("click",".proposalButton", function (){
		let operation = $(this).data('operation')
		let args = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($(this).data('text'))
		args.push($(this).val())
		console.lgg('diocan')
		nos.invoke({scriptHash, operation, args})
		.then((txid) => {
			alert(`Invoke txid: ${txid} `)
			window.location.reload(true)
		})					
	});

	$("#side").on("click",".payButton", function (){
		let operation = $(this).data('operation')
		let args = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($(this).data('text'))
		args.push($(this).val())
		nos.invoke({scriptHash, operation, args})
		.then((txid) => {
			alert(`Invoke txid: ${txid} `)
			window.location.reload(true)
		})					
	});

	$("#side").on("click","#addProposalFieldButton", function (){
		let operation = $(this).data('operation')
		let args = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($(this).data('text'))
		args.push($(this).parent().find("#addProposalFieldInput").val())
		console.log(args)
		nos.invoke({scriptHash, operation, args})
		.then((txid) => {
			alert(`Invoke txid: ${txid} `)
			window.location.reload(true)
		})					
	});

	$("#recap").on("click",".proposalButton", function (){
		let operation = $(this).data('operation')
		let args = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($(this).data('text'))
		args.push($(this).val())
		console.log(args)
		nos.invoke({scriptHash, operation, args})
		.then((txid) => {
			alert(`Invoke txid: ${txid} `)
			window.location.reload(true)
		})					
	});

	$("#recap").on("click",".payButton", function (){
		let operation = $(this).data('operation')
		let args = []
		args.push(player)
		args.push($(this).data('group'))
		args.push($(this).data('text'))
		args.push($(this).val())
		console.log(args)
		nos.invoke({scriptHash, operation, args})
		.then((txid) => {
			alert(`Invoke txid: ${txid} `)
			window.location.reload(true)
		})					
	});

	$("#side").on("click","#invokeCreateBetButton", function (){
		let betArgs = ["betText", "amountToBet", "openBlock", "closeBlock", "convalidateBlock"]

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
		args.push(name)
		args.push($("#side").find('#betText').val())    
		args.push(unhexlify(u.reverseHex(int2hex(parseInt($("#side").find('#openBlock').val())))))
		args.push(unhexlify(u.reverseHex(int2hex(parseInt($("#side").find('#closeBlock').val())))))
		args.push(unhexlify(u.reverseHex(int2hex(parseInt($("#side").find('#convalidateBlock').val())))))
		args.push(unhexlify(u.reverseHex(int2hex(parseInt($("#side").find('#amountToBet').val()) * Math.pow(10, 8)))))
		args.push($("#side").find('#tokenUsed').val())
		if ($("#canAddProposal").is(':checked')){
			args.push(0)
		}
		else{
			args.push(1)
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
					alert(`Invoke txid: ${txid} `)
					window.location.reload(true)
				})
				//.catch((err) => alert(`Error: ${err.message}`));				
			}
		}


	});




})





//perche doppia virgola
//perchè continua dopo ultimo termine
//suddividere per ogni singolo array
//sistemare discorso numeri e address
