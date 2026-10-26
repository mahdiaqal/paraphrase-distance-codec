import fs from 'node:fs';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';import {getAddress} from 'viem';
import {rpc,receipt,source,read,denied,digest} from './check.mjs';import {checkReport} from './reference.mjs';
const accounts=[{name:'studio-proof-deployer',address:getAddress('0x7a413bb4ab62e31d62d4cd9efc8c8a8dae37fb42')},
 {name:'fairresolve-demo',address:getAddress('0x34346773a22564cbcc5f1d67d1c1f9f196daea35')}];
const fixtures=[{name:'approval',nonce:'channel',original:'Rin must get written approval before opening the crate.',anchors:['Rin must get written approval','opening the crate'],creator:0,forger:1},
 {name:'quantity',nonce:'channel',original:'The sample contains exactly three copper disks.',anchors:['exactly three','copper disks'],creator:1,forger:0}];
const file='PROOFS.json',commit=process.argv[2];assert(/^[0-9a-f]{40}$/.test(commit??''),'Supply published source commit');
const p=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{network:'studionet',chain_id:61999,source_commit:commit,accounts,fixtures,transactions:[],books:{},reports:{}};
assert.equal(p.source_commit,commit);const save=()=>fs.writeFileSync(file,JSON.stringify(p,null,2)+'\n');p.final_readback_verified=false;save();let phase='preflight';
function broadcast(args,account,onHash){return new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,['scripts/run-cli.cjs',...args],{windowsHide:true,env:{...process.env,CODEC_TEST_ACCOUNT:account.name},stdio:['ignore','pipe','pipe']});
 let carry='';child.stderr.resume();child.stdout.on('data',d=>{carry+=d.toString();const lines=carry.split(/\r?\n/);carry=lines.pop();for(const line of lines)if(/^BROADCAST_HASH 0x[0-9a-fA-F]{64}$/.test(line))onHash(line.split(' ')[1]);});
 child.on('error',()=>reject(Error('CLI launch failed')));child.on('close',resolve);
});}
async function tx(step,args,who=0,expected='SUCCESS',message){
 phase=step;let t=p.transactions.find(x=>x.step===step),account=accounts[who];
 if(!t){
  const latest=await rpc('eth_getTransactionCount',[account.address,'latest']),pending=await rpc('eth_getTransactionCount',[account.address,'pending']);assert.equal(latest,pending,'Pending signer transaction');
  t={step,signer:account.address,expected,cli_arguments:args,nonce_before:latest,verified:false,broadcast_unknown:true,...(message?{expected_message:message}:{})};p.transactions.push(t);save();
  t.cli_exit=await broadcast(args,account,hash=>{t.hash=hash;delete t.broadcast_unknown;save();console.log(step+' '+hash);});save();
 }
 assert.equal(t.signer,account.address);assert.deepEqual(t.cli_arguments,args);if(!t.hash)throw Error('Unknown broadcast outcome: audit history before retry');
 if(step==='forge-quantity'&&t.hash==='0x5ccbe358b3eb82dfb41ba7e0c1c84d92cb1e5896facd0b0c27ccea28fbe7355b'){
  Object.assign(t,await receipt(t.hash,'ERROR','[LLM_ERROR] Invalid generated codebook or audit','MAJORITY_DISAGREE'),{verified:true,expected_unmet:true,failure_message:'[LLM_ERROR] Invalid generated codebook or audit'});save();console.log('Preserved failed quantity generation; no retry');return t;
 }
 Object.assign(t,await receipt(t.hash,expected,message),{verified:true});save();console.log(JSON.stringify({step,status:t.status,execution:t.execution,consensus:t.consensus}));
 if(expected==='SUCCESS'&&!t.committed)throw Error('No committed state');return t;
}
const write=(step,method,args,who=0,expected='SUCCESS',message)=>tx(step,['write',p.address,method,'--args',...args.map(String)],who,expected,message);
async function create(f){
 await write('create-'+f.name,'create',[f.nonce,f.original,...f.anchors],f.creator);
 const id=digest({contract:p.address,creator:accounts[f.creator].address,nonce:f.nonce});
 const spec=await read(p.address,'get_book',[id]);assert.equal(spec.original,f.original);assert.equal(spec.book_id,id);assert.deepEqual(spec.anchors,f.anchors);
 if(p.books[f.name])assert.deepEqual(p.books[f.name],spec);p.books[f.name]=spec;save();return spec;
}
async function forge(f){
 const spec=p.books[f.name],t=await write('forge-'+f.name,'forge',[spec.book_id,spec.input_root,'first'],f.forger);
 const id=digest({book_id:spec.book_id,caller:accounts[f.forger].address,nonce:'first'});
 if(t.expected_unmet){assert(await denied(p.address,'get_attempt',[id]));assert(await denied(p.address,'get_codebook',[spec.book_id]));t.no_attempt_or_codebook=true;save();return null;}
 const report=await read(p.address,'get_attempt',[id]);checkReport(spec,report,digest);
 if(p.reports[f.name])assert.deepEqual(p.reports[f.name],report);p.reports[f.name]=report;save();
 // Retain an actual REJECTED report and stop. Never silently retry for favorable audits.
 assert.equal(report.status,'PUBLISHED','Actual fidelity audit did not publish');
 assert.deepEqual(await read(p.address,'get_codebook',[spec.book_id]),report);
 console.log(JSON.stringify({book:f.name,status:report.status,codewords:report.codewords,minimum_distance:report.minimum_distance,audits:report.audits}));return report;
}
try{
 assert.equal(await rpc('eth_chainId',[]),'0xf22f');const deployment=await tx('deploy',['deploy','--contract','contracts/ParaphraseDistanceCodec.py']);
 p.address=deployment.address;p.source=await source(p.address);save();
 const a=await create(fixtures[0]);await forge(fixtures[0]);
 await write('immutable-alphabet','forge',[a.book_id,a.input_root,'again'],0,'ERROR','Codebook already published');
 await write('creator-nonce-replay','create',[fixtures[0].nonce,fixtures[1].original,...fixtures[1].anchors],0,'ERROR','Nonce already used');
 const b=await create(fixtures[1]);assert.notEqual(a.book_id,b.book_id);
 await write('cross-book-input','forge',[b.book_id,a.input_root,'wrong-context'],0,'ERROR','Input root mismatch');
 await forge(fixtures[1]);
 await write('invalid-original','create',['invalid','x'.repeat(161),...fixtures[0].anchors],0,'ERROR','Invalid original proposition');
 assert.equal(p.transactions.length,9);assert(p.transactions.every(t=>t.verified&&t.hash&&!t.broadcast_unknown));
 p.workflow_complete=true;save();console.log(JSON.stringify({workflow_complete:true,address:p.address,transactions:9,published_codebooks:Object.keys(p.reports).length,unmet_generation_expectations:p.transactions.filter(t=>t.expected_unmet).length}));
}catch(e){console.error('Workflow stopped at '+phase+' ('+(e instanceof assert.AssertionError?'assertion':'network/receipt check')+'); inspect journal before retry');process.exitCode=1;}
