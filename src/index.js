const des = require('./deserialize')
const indexGroup = require('./indexGroup')
const indexBet = require('./indexBet')
import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const address = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')))
const scriptHash = 'a58e6bb2b67ee11f7a5347532d1008ceb06a4622';
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
						console.log(data)
						for (let i = 0; i < data.length; i++){
						  let groupElement = document.createElement("div")
						  groupElement.className = "groupElement"
						  let groupButton = document.createElement("input")
						  groupButton.type = "button"
						  groupButton.className = "btn btn-outline-success groupButton"
						  groupButton.value = data[i]
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
						tableElement.appendChild(tableButton)
						document.getElementById('createGroup').appendChild(tableElement)
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
				  			let text = indexBet.list(dataBet, betterAddress, data[0].length)
				  			$('#side').html(text)
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
	  		});
			////.catch ##############			
		});


	$('#createGroup').on("click", "#createGroupButton", function (){
			$("#recap").empty()
			$("#side").empty()
			$("#main").empty()
			indexGroup.create(nos, scriptHash)
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
})





//perche doppia virgola
//perchè continua dopo ultimo termine
//suddividere per ogni singolo array
//sistemare discorso numeri e address
