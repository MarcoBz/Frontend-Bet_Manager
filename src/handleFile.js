import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function handleConfirmationTime(txid){

	document.getElementById("main").innerHTML = ""
	document.getElementById("side").innerHTML = ""
	document.getElementById("recap").innerHTML = ""

	let notifyDiv = document.createElement("div")
	document.getElementById("recap").appendChild(notifyDiv)

	let notify = document.createElement("div")
	notify.className = "notify"
	notify.innerHTML = "Transaction Confirmation <br> txid : " + txid

	notifyDiv.appendChild(notify)

	let notifyProgress = document.createElement("div")
	notifyProgress.className = "notify"

	notifyDiv.appendChild(notifyProgress)


	let progressCounter = 0

	let confirmation = window.setInterval(progress, 1000, txid)

	function progress(txid){

		progressCounter += 1
		let transaction = new XMLHttpRequest()
		transaction.open('GET', 'http://localhost:4000//api/main_net/v1/get_transaction/' + txid,true)
		transaction.onload = function(){ 
			let transactionData = JSON.parse(this.response); 
			notifyProgress.innerHTML = "Elapsed time : " + progressCounter
			console.log(txid)
			console.log(ransactionData.txid)
			if (transactionData.txid == txid){
				notify.className += " text-success"
				notify.innerHTML = "SUCCESS"
	            let notifyButton = document.createElement("input")
	            notifyButton.type = "button"
	            notifyButton.className = "btn btn-dark notifyButton"  
	            notifyButton.value = "Ok"
	            notifyDiv.appendChild(notifyButton)
				clearInterval(confirmation)
			}
		}
		transaction.send();

		if (progressCounter == 60){
			clearInterval(confirmation)
			notifyProgress.innerHTML = "Something went wrong, check the operation manually"
			notifyProgress.className += " text-danger"
			let notifyButton = document.createElement("input")
	        notifyButton.type = "button"
	        notifyButton.className = "btn btn-dark notifyButton"  
	        notifyButton.value = "Ok"
	        notifyDiv.appendChild(notifyButton)			
		}

	}
}



function handleStorage(err){	
	console.log(`Error: ${err.message}`)
	alert('Something went wrong - Reload the page')
	window.location.reload(true)
}

function handleInvocation(err){	
	console.log(`Error: ${err.message}`)
	alert('Error in network connection - Try again')
}


module.exports.handleConfirmationTime = handleConfirmationTime
module.exports.handleStorage = handleStorage
module.exports.handleInvocation = handleInvocation