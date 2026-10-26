import assert from 'node:assert/strict';
export function distance(a,b){
 const memo=new Map();
 function d(i,j){
  if(i===a.length)return b.length-j;if(j===b.length)return a.length-i;
  const k=i+':'+j;if(memo.has(k))return memo.get(k);
  const value=a[i]===b[j]?d(i+1,j+1):1+Math.min(d(i+1,j),d(i,j+1),d(i+1,j+1));
  memo.set(k,value);return value;
 }return d(0,0);
}
export function checkReport(spec,report,digest){
 const {codewords:words,audits:rows,attempt}=report;
 assert.equal(words.length,4);assert(words.every(w=>typeof w==='string'&&w.length>=10&&w.length<=160&&/^[\x20-\x7e]+$/.test(w)&&w.trim()));
 assert.equal(rows.length,4);assert(rows.every(r=>r.length===4&&r.every(x=>['PASS','FAIL','UNKNOWN'].includes(x))));assert(words.every(w=>w!==spec.original));
 const pairs=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)pairs.push({left:i,right:j,distance:distance(words[i],words[j])});
 assert(pairs.every(p=>p.distance>=5));
 assert.equal(attempt.book_id,spec.book_id);assert.equal(attempt.id,digest({book_id:spec.book_id,caller:attempt.caller,nonce:attempt.nonce}));
 const expectedCounts=spec.anchors.map(a=>spec.original.split(a).length-1);
 const observedCounts=words.map(w=>spec.anchors.map(a=>w.split(a).length-1));
 assert(observedCounts.every(row=>row.every((n,i)=>n===expectedCounts[i])));
 const value={policy:'paraphrase-distance-codec-v2',book_id:spec.book_id,input_root:spec.input_root,attempt,codewords:words,
  dimensions:['EQUIVALENCE','CRITICAL_DETAILS','NO_ADDITIONS','NATURAL_REPHRASING'],audits:rows,pair_distances:pairs,
  protected_phrases:{anchors:spec.anchors,expected_counts:expectedCounts,observed_counts:observedCounts},
  minimum_distance:Math.min(...pairs.map(p=>p.distance)),correction_radius:2,alphabet:'PRINTABLE_ASCII',symbol_count:4,
  status:rows.every(r=>r.every(x=>x==='PASS'))?'PUBLISHED':'REJECTED'};
 value.root=digest(value);assert.deepEqual(report,value);return true;
}
export function decode(words,carrier){
 const candidates=words.map((w,symbol)=>({symbol,canonical:w,distance:distance(w,carrier)})).filter(x=>x.distance<=2);
 assert(candidates.length<=1);return candidates.length?{status:'DECODED',...candidates[0]}:{status:'UNCORRECTABLE'};
}
export function carriers(word){
 const swapped=[...word];swapped[0]=swapped[0]==='~'?'!':'~';swapped[1]=swapped[1]==='~'?'!':'~';
 return [{kind:'exact',text:word},{kind:'two_insertions',text:'!!'+word},{kind:'two_deletions',text:word.slice(2)},
  {kind:'two_substitutions',text:swapped.join('')}];
}
