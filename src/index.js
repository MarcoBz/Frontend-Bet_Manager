const des = require('./deserialize')
const indexGroup = require('./indexGroup')
const indexBet = require('./indexBet')
import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const address = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')))
const scriptHash = 'a58e6bb2b67ee11f7a5347532d1008ceb06a4622';
console.log(wallet.getAddressFromScriptHash(str2hexstring('0xa58e6bb2b67ee11f7a5347532d1008ceb06a4622')))
const nos = window.NOS.V1;


$(document).ready(function (){
	let a = [1 ,2, [3,4]]
	console.dir(a)
	nos.getAddress()
		.then((loggedAddress) => {
			if (loggedAddress){
				let key = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(loggedAddress)))
				let decodeOutput = false
				nos.getStorage({scriptHash, key, decodeOutput})
					.then((rawData) =>{
						var data = des.deserialize(rawData)
						var text = "";
						for (var i = 0; i < data[0].length; i++){
							text += "<input class = 'groupButton' type = 'button' value = '" + data[0][i] + "'>"
						}
						text += "<input id = 'createGroup' type = 'button' value = 'Create New Group'>"
						$('#chooseGroup').html(text)
					})
			}
			else{
				$('#chooseGroup').html("</div> You have to login <div>")
			}
		})
		.catch((err) => console.log(`Error: ${err.message}`));

	$(document).on("click",".groupButton", function (){
		$("#side").empty()
		let key = $(this).val()
		let decodeOutput = false
		let data 
		nos.getStorage({scriptHash, key, decodeOutput})
	  		.then((rawData) => {
	  			data = des.deserialize(rawData)
	  			let text = indexGroup.list(data, key)
	  			$('#main').html(text)
	  		})
			.catch((err) => console.log(`Error: ${err.message}`));
		name = key

		$(document).on("click",".getBetButton", function (){
			let bet = $(this).data("bet")
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
				.catch((err) => console.log(`Error: ${err.message}`));
		  	});
	  	});

		$(document).on("click","#createBet", function (){
  			nos.getAddress()
			.then((betterAddress) => {
				if (betterAddress){
					betterAddress = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress(betterAddress)))
					let text = indexBet.create(betterAddress,name,nos, scriptHash)
		  			$('#side').html(text)
	  			}
	  		});			
		});


	$(document).on("click","#createGroup", function (){
			$("#main").html("")
			let text = indexGroup.create()
	  		$('#main').html(text)
	  	});

	$(document).on("click","#invokeCreateGroup", function (){
		let operation = ('create_league')
		let args = []
		let groupName = ($("#main").find('input[name = "groupName"]').val())
		
		$('.partecipant').each(function(i) {
			let addressPartecipant = $(this).data("address")
			if (addressPartecipant){
				args.push(addressPartecipant)
			}
		});
		$('.partecipant').each(function(i) {
			let nicknamePartecipant = $(this).data("nickname")
			if (nicknamePartecipant){
				args.push(nicknamePartecipant)
			}
		});
		args.push(groupName)
				
		nos.invoke({scriptHash,operation,args})
    		.then((txid) => alert(`Invoke txid: ${txid} `))
    		.catch((err) => alert(`Error: ${err.message}`));
  	});

	$(document).on("click","#clearMain", function (){
				$("#side").empty()
				$("#main").empty()
	  	});

	$(document).on("click","#clearSide", function (){
				$("#side").empty()
	  	});
})





//perche doppia virgola
//perchè continua dopo ultimo termine
//suddividere per ogni singolo array
//sistemare discorso numeri e address
