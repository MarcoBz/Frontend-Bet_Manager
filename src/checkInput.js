import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function checkNewAddress(newAddress, allAddresses){

	let dimAddress = checkAddress(newAddress[0])
	let dimNickname = checkString(newAddress[1])
	if (dimAddress != "ok"){
		return dimAddress
	}

	if (dimNickname != "ok"){
		return dimNickname
	}

	for (let i = 0; i < allAddresses.length; i++){
		if (allAddresses[i][0] == newAddress[0]){
			return "Address already present"
		}
		if (allAddresses[i][1] == newAddress[1]){
			return "Nickname already present"
		}
	}

	return "ok"
}

function checkAddress(address){

	let retStr = ""

	if (address.length != 34){
		retStr = "Error in Address length"
		return retStr
	}

	retStr = "ok"
	return retStr
}

function checkBlock(numBlock){

	let dimBlockString = checkString(numBlock)

	if (dimBlockString != "ok"){
		return dimBlockString
	}
	
	let intBlock = parseFloat(numBlock)
	if (isNaN(intBlock)){
		return "Not right number"
	}

	if (!Number.isInteger(intBlock)){
		return "Not right number"		
	}

	if (intBlock < 0){
		return "Not right number"			
	}

	return "ok"
}

function checkAmount(amount){

	let dimAmountString = checkString(amount)

	if (dimAmountString != "ok"){
		return dimAmountString
	}

	let numAmount = parseFloat(amount)
	if (isNaN(numAmount)){
		return "Not right amount"
	}		

	if (numAmount < 0){
		return "Not right amount"			
	}

	return "ok"
}

function checkNewProposal(newProposal, allProposals){

	let dimProposal = checkString(newProposal)

	if (dimProposal != "ok"){
		return dimProposal
	}

	for (let i = 0; i < allProposals.length; i++){
		if (allProposals[i][0] == newProposal[0]){
			return "Proposal already present"
		}
	}	

return "ok"
}

function checkNumProposals(proposals){

	if(proposals.length < 2){
		return "At least 2 proposals"
	}

	return "ok"
}

function checkNumAddress(addresses){
	if(addresses.length < 3){
		return "At least 3 addresses"
	}

return "ok"
}

function checkString(string){

	if (string.length == 0){
		return "At least 1 letter"
	}
return "ok"
}

module.exports.checkString = checkString
module.exports.checkNumAddress = checkNumAddress
module.exports.checkNumProposals = checkNumProposals
module.exports.checkNewProposal = checkNewProposal
module.exports.checkNewAddress = checkNewAddress
module.exports.checkBlock = checkBlock
module.exports.checkAmount = checkAmount