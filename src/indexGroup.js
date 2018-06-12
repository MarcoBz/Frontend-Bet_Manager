import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const des = require('./deserialize')
const indexBet = require('./indexBet')

function list(data, name, nos, scriptHash){

	document.getElementById('main').innerHTML = "";
	let groupName = document.createElement("h2")
	groupName.className = "text-center"
	groupName.innerHTML = name
	document.getElementById('main').appendChild(groupName)
	let table = document.createElement("div")
	table.classname = "col col-4"
	let peopleTable = document.createElement("ul")
	peopleTable.className = ("list-group")
	let title = document.createElement("li")
	title.className = ("list-group-item active bg-success text-center")
	title.innerHTML = "People"
	peopleTable.appendChild(title)
	for (let i = 0; i< data[0].length; i++){
	  let person = document.createElement("li")
	  person.className = ("list-group-item text-center")
	  person.innerHTML = (wallet.getAddressFromScriptHash(u.reverseHex(hexlify(data[0][i][0]))) + " : " + data[0][i][1])
	  peopleTable.appendChild(person)
	}
	table.appendChild(peopleTable)
	let betsTable = document.createElement("div")
	betsTable.className = ("list-group")
	let betsTitle = document.createElement("div")
	betsTitle.className = ("list-group-item active bg-success text-center")
	betsTitle.innerHTML = "Bets"
	betsTable.appendChild(betsTitle)
	for (let i = 0; i< data[1].length; i++){
		let bet = document.createElement("button")
		bet.type = "button"
		bet.className = ("list-group-item list-group-item-action text-center getBetButton")
		bet.value = data[1][i]
		bet.innerHTML = data[1][i]
		let badge = document.createElement("span")
		badge.className = "glyphicon glyphicon-refresh"
		bet.appendChild(badge)
		betsTable.appendChild(bet)
		let key = name + data[1][i]
		let decodeOutput = false
		nos.getStorage({scriptHash, key, decodeOutput})
			.then((rawData) => {
				console.log('a')
				let dataBet = des.deserialize(rawData)
				let betStatus = indexBet.getBetStatus(dataBet)

				if (betStatus == "open"){
					badge.className = "badge badge-primary"
					badge.innerHTML = "Open"
				}
				else if (betStatus == "close"){
					badge.className = "badge badge-secondary"
					badge.innerHTML = "Closed"    
				}
				else if (betStatus == "onConvalidation"){
					badge.className = "badge badge-warning"
					badge.innerHTML = "On convalidation"    
				}
				else if (betStatus == "convalidated"){
					badge.className = "badge badge-success"
					badge.innerHTML = "Convalidated"    
				}

				})
			//.catch((err) => console.log(`Error: ${err.message}`));
	}
	let createBet = document.createElement("div")
	createBet.className = ("list-group-item list-group-item-action active bg-success text-center") 
	createBet.innerHTML = "Create new bet"
	createBet.id = "createBet"
	table.appendChild(betsTable)
	table.appendChild(createBet)
	document.getElementById('main').appendChild(table)
	
}

function create(data, nos, scriptHash){
	let text = "<div id = 'addGroupName'>"
	text += "Group Name : <input type = 'text' name = 'groupName' ></div>"
	text += "<div id = 'addPartecipant'> Add Partecipant:"
	text += "<input class = 'addPartecipantButton' type = 'button' value = 'Add Partecipant'>"
	let textAdd = "<div class = 'partecipant'><div class = 'inputProposal'><input type = 'text' name = 'addressPartecipant'></div><input type = 'text' name = 'nicknamePartecipant'></div>"
	text += textAdd
	text += "</div>"
	text += "<input id = 'invokeCreateGroup' type = 'button' value = 'Create Group'>"
	text += "</br></br><input id = 'clearMain' type = 'button' value = 'Clear'>"
	
	$('#main').on("click",".addPartecipantButton", function (){

			$('.partecipant').each(function(i) {
				let textNew = ""
				let address
				let nickname
				if ($(this).find(".inputProposal").length > 0){
					address = $(this).find('input[name = "addressPartecipant"]').val()
					nickname = $(this).find('input[name = "nicknamePartecipant"]').val()
					textNew += address + "    -    " + nickname + "<input class = 'removePartecipantButton' type = 'button' value = 'Remove Partecipant'>"
				}
				else{
					address = $(this).data("address")
					nickname = $(this).data("nickname")
					textNew += address + "    -    " + nickname + "<input class = 'removePartecipantButton' type = 'button' value = 'Remove Partecipant'>"
				}
				$(this).empty()
				$(this).data("address", address)
				$(this).data("nickname",nickname)
				$(this).append(textNew)
			});
			$('#addPartecipant').append(textAdd)	
	  	});

	$('#main').on("click",".removePartecipantButton", function (){
				$(this).parents('.partecipant').remove()	
	  	});

	$('#main').on("click","#invokeCreateGroup", function (){
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
				
		nos.invoke({scriptHash, operation, args})
    		.then((txid) => alert(`Invoke txid: ${txid} `))
    		//.catch((err) => alert(`Error: ${err.message}`));
  	});

	return text

}

module.exports.list = list
module.exports.create = create
