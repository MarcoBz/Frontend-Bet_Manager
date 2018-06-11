import { u, wallet } from '@cityofzion/neon-js';
import { str2hexstring, int2hex, hexstring2str } from '@cityofzion/neon-js/src/utils'
import {unhexlify,hexlify} from 'binascii';

function deserialize(rawData){
	let rawSplitted = rawData.match(/.{2}/g);
	let offset = 0
	let data = []
	let allData = deserializeRawData([offset, rawSplitted, data])
	
	return allData[2]
}


function getLen(offset,rawSplitted){
	let len = parseInt(rawSplitted[offset], 16);
	return len
}


function deserializeRawData([offset, rawSplitted, rdata]){
	let data = []
	if (rawSplitted[offset] == 80){
		offset ++ 
		var arrayLen = getLen(offset, rawSplitted)
		offset ++ 
		for ( let j = 0; j<arrayLen; j++){
			[offset, rawSplitted, rdata] = deserializeRawData([offset, rawSplitted, rdata]) 
			data.push(rdata)
		}
		return [offset,rawSplitted, data];
	}
	if (rawSplitted[offset] == 2){
		offset ++
		var itemLen = getLen(offset, rawSplitted)
		offset ++ 
		rdata = concatBytes(rawSplitted,offset,itemLen + offset);
		rdata = parseInt(u.reverseHex((rdata)),16);
		offset = offset + itemLen
		return [offset,rawSplitted, rdata];

	}
	if (rawSplitted[offset] == 0){
		offset ++
		itemLen = getLen(offset, rawSplitted)
		offset ++ 
		rdata = concatBytes(rawSplitted,offset,itemLen + offset);
		rdata = u.hexstring2str(rdata);
		offset = offset + itemLen
		return [offset,rawSplitted, rdata];
	}
}

function concatBytes(source, start, length) {
    var temp = "";
    for (var i = start; i < length; i += 1) temp += source[i];
    return temp;
};

module.exports.deserialize = deserialize