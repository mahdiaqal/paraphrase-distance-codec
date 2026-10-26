import assert from 'node:assert/strict';import {abi} from 'genlayer-js';
const id='a'.repeat(64),root='b'.repeat(64);
for(const[name,args]of[['create',['demo','Rin must wait for written approval.']],['get_book',[id]],['get_attempt',[id]],['get_codebook',[id]],
 ['forge',[id,root,'attempt']],['encode',[id,root,root,2]],['decode',[id,root,root,'Noisy text.']]]){
 const b=abi.calldata.encode(abi.calldata.makeCalldataObject(name,args,{}));assert.deepEqual(abi.calldata.encode(abi.calldata.decode(b)),b);
}console.log('7 SDK calldata roundtrips passed');
