const des = require('./deserialize')
const indexGroup = require('./indexGroup')
const indexBet = require('./indexBet')

import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const address = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')))
const scriptHash = '7cbd0436107124b6d4c45edfcef99a7013e5afeb';
const nos = window.NOS.V1;

$(document).ready(function (){
	nos.getAddress()
		.then((loggedAddress) => {
			if (loggedAddress){
				let key = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(loggedAddress)))
				let decodeOutput = false
				nos.getStorage({scriptHash, key, decodeOutput})
					.then((rawData) =>{
						var data = des.deserialize(rawData)
						document.getElementById('chooseGroup').innerHTML = "";
						document.getElementById('createGroup').innerHTML = "";
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
						document.getElementById('createGroup').appendChild(tableElement)

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
									payed : data[1][i][4],
									amountBet : data[1][i][5]
								}
								dataRecap.push(dataTemp)
							}
							indexRecap.table(dataRecap, nos, scriptHash)
						});
					})
					////.catch ##############
			}
			else{
				$('#chooseGroup').html("</div> You have to login <div>")
			}


		})
		//.catch((err) => console.log(`Error: ${err.message}`)); //#######



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
	  			indexGroup.list(data, key, nos, scriptHash)
	  		})
			//.catch((err) => console.log(`Error: ${err.message}`)); //#######
		let name = key

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
				  			let text = indexBet.list(dataBet, betterAddress, nos, scriptHash)
				  			$('#side').html(text)
			  			}
						else{
							$('#chooseGroup').html("</div> You have to login <div>")
						}
			  		});
		  		})
				//.catch((err) => console.log(`Error: ${err.message}`));
		  	});
	});

	$('#main').on("click","#createBet", function (){
		$("#side").empty()
			nos.getAddress()
			.then((betterAddress) => {
				if (betterAddress){
					betterAddress = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(betterAddress)))
					indexBet.create(betterAddress, name, nos, scriptHash)
				}
				else{
					$('#chooseGroup').html("</div> You have to login <div>")
				}
  		});
		////.catch ##############			
	});


	$('#createGroup').on("click", "#createGroupButton", function (){
			$("#recap").empty()
			$("#side").empty()
			$("#main").empty()
			indexGroup.create(nos, scriptHash)
	});

	$("#main").on("click","#addAddressButton", function(){
		let address = $(this).parents("#addAddress").find("#addAddressForm").val()
		let nickname = $(this).parents("#addAddress").find("#addNicknameForm").val()
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
	});
	
	$("#main").on("click","#removeAddressButton", function(){
		$(this).parents(".addedAddress").remove()
	});

	$('#main').on("click","#invokeCreateGroup", function (){
		let operation = ('create_league')
		let args = []
		let groupName = document.getElementById("groupName").value
		$('.addedAddress').each(function(i) {
			let addressPartecipant  = $(this).find(".address").val()
			if (addressPartecipant){
				args.push(addressPartecipant)
			}
		});

		$('.addedAddress').each(function(i) {
			let nicknamePartecipant = $(this).find(".nickname").val()
			if (nicknamePartecipant){
				args.push(nicknamePartecipant)
			}
		});

		args.push(groupName)
		nos.invoke({scriptHash, operation, args})
    		.then((txid) => alert(`Invoke txid: ${txid} `))
    		//.catch((err) => alert(`Error: ${err.message}`));
  	});

	
	$('#recap').on("click", "#clearRecapButton", function (){
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
})





