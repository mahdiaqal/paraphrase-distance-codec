// Read-only; no CLI, keys, generation, signing or transaction send path.
import fs from 'node:fs';import assert from 'node:assert/strict';
import {rpc,receipt,source,read,denied,digest} from './check.mjs';import {checkReport,decode,carriers} from './reference.mjs';
const p=JSON.parse(fs.readFileSync('PROOFS.json','utf8'));assert(p.workflow_complete);assert.equal(await rpc('eth_chainId',[]),'0xf22f');
assert.equal(p.transactions.length,9);assert.equal(new Set(p.transactions.map(t=>t.hash)).size,9);
for(const t of p.transactions){
 assert(t.verified&&!t.broadcast_unknown);const r=t.expected_unmet?await receipt(t.hash,'ERROR',t.failure_message,'MAJORITY_DISAGREE'):await receipt(t.hash,t.expected,t.expected_message);assert.equal(r.address,p.address);assert.equal(r.committed,t.expected==='SUCCESS'&&!t.expected_unmet);
 const native=await rpc('eth_getTransactionByHash',[t.hash]);assert.equal(native.from_address.toLowerCase(),t.signer.toLowerCase());assert.equal(BigInt(native.nonce),BigInt(t.nonce_before));assert.equal(BigInt(native.value),0n);
}console.log('Verified nine receipts, signers, native nonces and zero values');
p.source=await source(p.address);p.native_roundtrips=[];p.consumer_rejections=[];
for(const f of p.fixtures){
 const spec=await read(p.address,'get_book',[p.books[f.name].book_id]);assert.deepEqual(spec,p.books[f.name]);
 assert.equal(spec.contract,p.address);assert.equal(spec.creator,p.accounts[f.creator].address);assert.equal(spec.nonce,f.nonce);assert.equal(spec.original,f.original);assert.deepEqual(spec.anchors,f.anchors);
 assert.equal(spec.book_id,digest({contract:p.address,creator:spec.creator,nonce:f.nonce}));assert.equal(spec.input_root,digest(Object.fromEntries(Object.entries(spec).filter(([k])=>k!=='input_root'))));
 if(!p.reports[f.name]){
  const failure=p.transactions.find(t=>t.step==='forge-'+f.name);assert(failure.expected_unmet&&failure.no_attempt_or_codebook);
  assert(await denied(p.address,'get_attempt',[digest({book_id:spec.book_id,caller:p.accounts[f.forger].address,nonce:'first'})]));
  assert(await denied(p.address,'get_codebook',[spec.book_id]));
  console.log(JSON.stringify({book:f.name,published:false,failed_generation_preserved:true}));continue;
 }
 const report=await read(p.address,'get_codebook',[spec.book_id]);assert.deepEqual(report,p.reports[f.name]);checkReport(spec,report,digest);assert.equal(report.status,'PUBLISHED');
 assert.equal(report.attempt.caller,p.accounts[f.forger].address);assert.equal(report.attempt.nonce,'first');assert.deepEqual(await read(p.address,'get_attempt',[report.attempt.id]),report);
 for(let symbol=0;symbol<4;symbol++){
  const bound={input_root:spec.input_root,codebook_root:report.root};
  const encoded=await read(p.address,'encode',[spec.book_id,spec.input_root,report.root,symbol]);assert.deepEqual(encoded,{symbol,carrier:report.codewords[symbol],...bound});
  for(const c of carriers(encoded.carrier)){
   const result=await read(p.address,'decode',[spec.book_id,spec.input_root,report.root,c.text]);const expected=decode(report.codewords,c.text);
   assert.deepEqual(result,{...expected,...bound});assert.equal(result.symbol,symbol);assert.equal(result.distance,c.kind==='exact'?0:2);
   p.native_roundtrips.push({book:f.name,symbol,kind:c.kind,carrier:c.text,result});
  }
 }
 assert.deepEqual(await read(p.address,'decode',[spec.book_id,spec.input_root,report.root,'']),{status:'UNCORRECTABLE',input_root:spec.input_root,codebook_root:report.root});
 const other=p.fixtures.find(x=>x.name!==f.name),otherSpec=p.books[other.name],wrongRoot=digest({wrong_codebook:report.root});
 for(const[method,args,why]of[
  ['encode',[spec.book_id,otherSpec.input_root,report.root,0],'cross-source root'],
  ['decode',[spec.book_id,spec.input_root,wrongRoot,report.codewords[0]],'mismatched alphabet root'],
  ['encode',[spec.book_id,spec.input_root,report.root,4],'invalid symbol'],
  ['decode',[spec.book_id,spec.input_root,report.root,'x'.repeat(163)],'oversized carrier'],
  ['decode',[spec.book_id,spec.input_root,report.root,'é'],'unsupported alphabet']]){
  assert(await denied(p.address,method,args));p.consumer_rejections.push({book:f.name,method,why});
 }
 console.log(JSON.stringify({book:f.name,minimum_distance:report.minimum_distance,all_audits:'PASS',native_encodings:4,native_decodings:16}));
}
assert.equal(p.native_roundtrips.length,16*Object.keys(p.reports).length);const bad=digest({contract:p.address,creator:p.accounts[0].address,nonce:'invalid'});assert(await denied(p.address,'get_book',[bad]));
const history=await rpc('sim_getTransactionsForAddress',[p.address]);assert.deepEqual(history.map(t=>t.hash).sort(),p.transactions.map(t=>t.hash).sort());
p.contract_history_matched=true;p.final_readback_verified=true;fs.writeFileSync('PROOFS.json',JSON.stringify(p,null,2)+'\n');
console.log(JSON.stringify({verified:true,address:p.address,source:p.source,transactions:9,native_roundtrips:p.native_roundtrips.length,consumer_rejections:p.consumer_rejections.length}));
