import test from 'node:test';import assert from 'node:assert/strict';import {distance,decode,carriers} from '../scripts/reference.mjs';
test('independent top-down distance matches breadth-first edit search on all 961 short pairs',()=>{
 const strings=[''];for(let n=1;n<=4;n++)for(let k=0;k<2**n;k++)strings.push(k.toString(2).padStart(n,'0').replaceAll('0','a').replaceAll('1','b'));
 const edges=s=>strings.filter(t=>{
  if(s.length===t.length)return [...s].filter((c,i)=>c!==t[i]).length===1;
  const [a,b]=s.length<t.length?[s,t]:[t,s];return b.length===a.length+1&&[...b].some((_,i)=>b.slice(0,i)+b.slice(i+1)===a);
 });
 for(const s of strings){const seen=new Map([[s,0]]),q=[s];for(let i=0;i<q.length;i++)for(const t of edges(q[i]))if(!seen.has(t)){seen.set(t,seen.get(q[i])+1);q.push(t);}
  for(const t of strings)assert.equal(distance(s,t),seen.get(t));}
});
test('distance-five alphabet corrects concrete insertion deletion substitution pairs',()=>{
 const words=[...'abcd'].map(c=>'aaaaa'+c.repeat(5));
 words.forEach((w,symbol)=>carriers(w).forEach(c=>{const r=decode(words,c.text);assert.equal(r.symbol,symbol);assert.equal(r.distance,c.kind==='exact'?0:2);}));
 assert.deepEqual(decode(words,''),{status:'UNCORRECTABLE'});
});
test('arbitrary replacement by another canonical phrase is not authenticated',()=>{
 const words=[...'abcd'].map(c=>c.repeat(10));assert.equal(decode(words,words[2]).symbol,2);
});
