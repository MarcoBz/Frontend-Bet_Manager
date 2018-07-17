import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function checkNewAddress(newAddress, allAddresses){

	let dimAddress = checkAddress(newAddress[0])
	if (dimAddress != "ok"){
		return "Error in length"
	}

	for (let i = 0; i < allAddresses; i++){
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

	if (address.lenght != 20){
		retStr = "Error in dimension"
		return retStr
	}

	retStr = "ok"
	return reStr
}

function chekBlock(numBlock){

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

	for (let i = 0; i < allProposals; i++){
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