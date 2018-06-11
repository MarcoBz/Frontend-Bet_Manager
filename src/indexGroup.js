import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function list(data, name, nos, scriptHash){

	let text = "<b>" + name + "</b></br>"
	text += "People : <ol>"
	for (let i = 0; i < data[0].length; i++){
		let address = wallet.getAddressFromScriptHash(u.reverseHex(hexlify(data[0][i][0])))
		text  += "<li>" + address + "    -    " + data[0][i][1] + "</li>"
	}
	text += "</ol> Bets : <ol>"
	for (let j = 0; j < data[1].length; j++){
		text  += "<li><input data-bet = '" + data[1][j] + "' type = 'button' class = 'getBetButton' value ='" + data[1][j] + "'</li>"
	}
	text += "</br><input id = 'createBet' type = 'button' value = 'Create New Bet'>"
	text += "</ol> Finished Bets :" + data[2][0]
	text += "</br></br><input id = 'clearMain' type = 'button' value = 'Clear'>"

	return text
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
	
	$('#main''#main''#main').on("click",".addPartecipantButton", function (){

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

	$('#main''#main').on("click",".removePartecipantButton", function (){
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
    		.catch((err) => alert(`Error: ${err.message}`));
  	});

	return text

}

module.exports.list = list
module.exports.create = create
