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
		let key = $(this).val()
		let decodeOutput = false
		let data 
		nos.getStorage({scriptHash, key, decodeOutput})
	  		.then((rawData) => {
	  			data = des.deserialize(rawData)
	  			let text = indexGroup.list(data, key, nos, scriptHash)
	  			$('#main').html(text)
	  		})
			//.catch((err) => console.log(`Error: ${err.message}`)); //#######
		let name = key

		$('#main').on("click",".getBetButton", function (){
			let bet = $(this).val()
			key = name + bet
			decodeOutput = false
			console.log(key)
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
  			nos.getAddress()
			.then((betterAddress) => {
				if (betterAddress){
					betterAddress = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(betterAddress)))
					let text = indexBet.create(betterAddress, name, nos, scriptHash)
		  			$('#side').html(text)
	  			}
	  		});
			////.catch ##############			
		});


	$('#createGroup').on("click", "#createGroupButton", function (){
			$("#main").html("")
			let text = indexGroup.create(nos, scriptHash)
	  		$('#main').html(text)
	  	});

	$('#main').on("click", "#clearMain", function (){
				$("#side").empty()
				$("#main").empty()
	  	});

	$("#side").on("click", "#clearSide", function (){
				$("#side").empty()
	  	});
})





//perche doppia virgola
//perchè continua dopo ultimo termine
//suddividere per ogni singolo array
//sistemare discorso numeri e address
