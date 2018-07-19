import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const des = require('./deserialize')
const betFile = require('./betFile')

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
				let dataBet = des.deserialize(rawData)
				let betStatus = betFile.getBetStatus([0,0,0,[dataBet[3][0],dataBet[3][1],dataBet[3][2]],0,dataBet[5]], nos, scriptHash)
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
	main.appendChild(table)

	let clearMain = document.createElement("div")
	clearMain.id = "clearMain"
	clearMain.className = "col-2"
	let clearMainButton = document.createElement("input")
	clearMainButton.id = "clearMainButton"
	clearMainButton.className = "text-center btn btn-dark"
	clearMainButton.type = "button"
	clearMainButton.value = "Clear"
	clearMain.appendChild(clearMainButton)
	main.appendChild(clearMain)

}

function create(nos, scriptHash){
	let form = document.createElement("form")
	form.id = "createGroupForm"
	let nameGroup = document.createElement("div")
	nameGroup.className = "form-group row"
	let labelNameGroup = document.createElement("label")
	labelNameGroup.htmlFor = "groupName"
	labelNameGroup.className = "col-5 col-form-label"
	labelNameGroup.innerHTML = "Name of the Group"
	let div1 = document.createElement("div")
	div1.className = "col-7"
	let inputNameGroup = document.createElement("input")
	inputNameGroup.className = "form-control"
	inputNameGroup.id = "groupName"
	inputNameGroup.type = "text"
	inputNameGroup.placeholder = "Example1"
	div1.appendChild(inputNameGroup)
	nameGroup.appendChild(labelNameGroup)
	nameGroup.appendChild(div1)
	form.appendChild(nameGroup)
	let addAddress = document.createElement("div")
	addAddress.className = "form-row"
	addAddress.id = "addAddress"
	let div2 = document.createElement("div")
	div2.className = "col-6"
	let inputAddress = document.createElement("input")
	inputAddress.className = "form-control"
	inputAddress.id = "addAddressForm"
	inputAddress.type = "text"
	inputAddress.placeholder = "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y"
	div2.appendChild(inputAddress)
	addAddress.appendChild(div2)
	let div3 = document.createElement("div")
	div3.className = "col-5"
	let inputNickname = document.createElement("input")
	inputNickname.className = "form-control"
	inputNickname.id = "addNicknameForm"
	inputNickname.type = "text"
	inputNickname.placeholder = "CozExample"
	div3.appendChild(inputNickname)
	addAddress.appendChild(div3)
	let div4 = document.createElement("div")
	div4.className = "col-auto"
	let add = document.createElement("input")
	add.type = "button"	
	add.className = "btn btn-light"
	add.id =  "addAddressButton"
	add.innerHTML = ""
	div4.appendChild(add)
	addAddress.appendChild(div4)
	form.appendChild(addAddress)
	let  main = document.getElementById("main")
	main.appendChild(form)

	let invokeCreateGroup = document.createElement("div")
	invokeCreateGroup.classname = "text-center"
	let invokeCreateGroupButton = document.createElement("input")
	invokeCreateGroupButton.type = "button"
	invokeCreateGroupButton.id = "invokeCreateGroup"
	invokeCreateGroupButton.value = "Submit to creation new group"
	invokeCreateGroupButton.className = "btn btn-success"

	invokeCreateGroup.appendChild(invokeCreateGroupButton)
	main.appendChild(invokeCreateGroup)

	let clearMain = document.createElement("div")
	clearMain.id = "clearMain"
	clearMain.className = "col-2"
	let clearMainButton = document.createElement("input")
	clearMainButton.id = "clearMainButton"
	clearMainButton.className = "text-center btn btn-dark"
	clearMainButton.type = "button"
	clearMainButton.value = "Clear"
	clearMain.appendChild(clearMainButton)
	main.appendChild(clearMain)	

	$("input").keydown(function(){
		$(this).parent().parent().removeClass("border border-danger border-15")
	});

}

module.exports.list = list
module.exports.create = create
