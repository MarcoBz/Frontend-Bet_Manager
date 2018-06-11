const des = require('./deserialize')
const indexBet = require('./indexBet')
import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';
const address = unhexlify(u.reverseHex(wallet.getScriptHashFromAddress('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')))
const scriptHash = 'd2ad7e45c8adafd3d3dd11766451d3969e8f3330';
const nos = window.NOS.V1;

$(document).ready(function (){	
	let data = ["lega1","Is Neo the Best",'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',[200,200,200,50,"GAS","y"],[["yes",['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y','b'],['AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y','c']],["no",['c'],[]]],900,false]
	let text = indexBet.list(data,'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',3)
	//let text = indexBet.create('marco','lega1')
	$('#side').html(text)
})