import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

//module to handle responses from nos promises

//display information during the transaction confirmation
function handleConfirmationTime(txid){

	document.getElementById("main").innerHTML = ""
	document.getElementById("side").innerHTML = ""
	document.getElementById("recap").innerHTML = ""

	let h = screen.height
	let w = screen.width

	let notifyRow = document.createElement("div")
	notifyRow.className = "row"

	let notifyDiv0 = document.createElement("div")
	notifyDiv0.className = "col col-2"

	let notifyDiv = document.createElement("div")
	notifyDiv.className = "col col-8"
	notifyDiv.style.top = '200px'

	notifyRow.appendChild(notifyDiv0)
	notifyRow.appendChild(notifyDiv)
	document.getElementById("recap").appendChild(notifyRow)

	let notify = document.createElement("div")
	notify.innerHTML = "Transaction Confirmation <br> txid : " + txid
	notify.className = "text-center"
	notifyDiv.appendChild(notify)

	let notifyProgress = document.createElement("div")
	notifyProgress.className = "text-center" 
	notifyDiv.appendChild(notifyProgress)


	let progressCounter = 0
	let finishedTime = false
	let confirmation = window.setInterval(progress, 1000, txid)




	function progress(txid){

		progressCounter += 1
		if (progressCounter == 240){
			notify.innerHTML = "Something went wrong, check the operation manually"
			notifyProgress.innerHTML = ""
			notify.className += " text-danger text-center"
			let notifyRow1 = document.createElement("div")
			notifyRow1.className = 'row'
			let notifyDiv1 = document.createElement("div")
			notifyDiv1.className = 'col'
			let notifyDiv2 = document.createElement("div")
			notifyDiv2.className = 'col'
			let notifyDiv3 = document.createElement("div")
			notifyDiv3.className = 'col'
			notifyRow1.appendChild(notifyDiv1)
			notifyRow1.appendChild(notifyDiv2)
			notifyRow1.appendChild(notifyDiv3)
			let notifyButton = document.createElement("input")
	        notifyButton.type = "button"
	        notifyButton.className = "btn btn-dark notifyButton"  
	        notifyButton.value = "Ok"
	        notifyDiv2.appendChild(notifyButton)
	        notifyDiv.appendChild(notifyRow1)	
			finishedTime = true		
			clearInterval(confirmation)
		}
		else{
			let transaction = new XMLHttpRequest()
			transaction.open('GET', 'https://localhost:4000//api/main_net/v1/get_transaction/' + txid,true)
			transaction.onload = function(){ 
				let transactionData = JSON.parse(this.response); 
				notifyProgress.className += " text-center"
				notifyProgress.innerHTML = "Elapsed time : " + progressCounter
				if (transactionData.txid == txid){
					notify.className += " text-success"
					notify.innerHTML = "SUCCESS"
					notifyProgress.innerHTML = ""
					let notifyRow1 = document.createElement("div")
					notifyRow1.className = 'row'
					let notifyDiv1 = document.createElement("div")
					notifyDiv1.className = 'col'
					let notifyDiv2 = document.createElement("div")
					notifyDiv2.className = 'col'
					let notifyDiv3 = document.createElement("div")
					notifyDiv3.className = 'col'
					notifyRow1.appendChild(notifyDiv1)
					notifyRow1.appendChild(notifyDiv2)
					notifyRow1.appendChild(notifyDiv3)
					let notifyButton = document.createElement("input")
			        notifyButton.type = "button"
			        notifyButton.className = "btn btn-dark notifyButton"  
			        notifyButton.value = "Ok"
			        notifyDiv2.appendChild(notifyButton)
			        notifyDiv.appendChild(notifyRow1)	
					clearInterval(confirmation)
				}
			}
			transaction.send();			
		}
	}
}

//Alert if there is a problem in the nos.getStorage module
function handleStorage(err){	
	console.log(`${err.message}`)
	alert('Something went wrong - Reload the page')
	window.location.reload(true)
}

//Alert if there is a problem connecting to the network
function handleInvocation(err){	
	console.log(`${err.message}`)
	if (err.message == "Cancelled by user."){
		alert(err.message)
	}
	else{
		alert('Error in network connection - Try again')
	}
}

//Get the block height from neo scan API
function getBlock(){
	let height = new XMLHttpRequest()
	height.open('GET', 'https://localhost:4000//api/main_net/v1/get_height',true)
	let currentBlockHeight
	height.onload = function(){ 
		let data = JSON.parse(this.response); 
		alert(`Current Block : ${data.height}`)
	}
	height.send();
}

module.exports.handleConfirmationTime = handleConfirmationTime
module.exports.handleStorage = handleStorage
module.exports.handleInvocation = handleInvocation
module.exports.getBlock = getBlock