import ast
import copy
import hashlib
import itertools
import json
import re
from collections import deque
from pathlib import Path
from types import SimpleNamespace
import pytest

SOURCE=Path(__file__).resolve().parents[1]/'contracts/ParaphraseDistanceCodec.py'
HELPERS=[n for n in ast.parse(SOURCE.read_text()).body if isinstance(n,(ast.Assign,ast.FunctionDef))]


def namespace(gl=None):
    ns=dict(hashlib=hashlib,json=json,re=re,gl=gl)
    exec(compile(ast.Module(body=HELPERS,type_ignores=[]),str(SOURCE),'exec'),ns)
    return ns


NS=namespace()
ORIGINAL='Rin must get written approval before opening the crate.'
WORDS=['Rin is required to obtain written approval before opening the crate.',
       'Before Rin opens the crate, Rin must receive approval in writing.',
       'Written approval is a prerequisite for Rin to open the crate.',
       'Rin must not open the crate before Rin has obtained written approval.']
PASS=[['PASS']*4 for _ in range(4)]


def spec():return dict(book_id='book',input_root='source',original=ORIGINAL)
def attempt():return dict(book_id='book',caller='caller',nonce='try',id='attempt')


def neighbors(s,alphabet='ab',cap=4):
    for i in range(len(s)):yield s[:i]+s[i+1:]
    for i in range(len(s)):
        for c in alphabet:yield s[:i]+c+s[i+1:]
    if len(s)<cap:
        for i in range(len(s)+1):
            for c in alphabet:yield s[:i]+c+s[i:]


def test_all_961_short_string_distances_match_independent_breadth_first_edit_graph():
    strings=[''.join(p) for n in range(5) for p in itertools.product('ab',repeat=n)]
    for start in strings:
        levels={start:0};queue=deque([start])
        while queue:
            s=queue.popleft()
            for other in neighbors(s):
                if other not in levels:levels[other]=levels[s]+1;queue.append(other)
        assert len(levels)==31
        for target in strings:assert NS['distance'](start,target)==levels[target]


def test_spacing_five_guarantees_supported_two_edit_unique_decoding():
    words=['aaaaa'+c*5 for c in 'abcd'];pairs=NS['spacing'](words)
    assert min(p['distance'] for p in pairs)==5
    book={'codewords':words}
    checked=0
    for symbol,word in enumerate(words):
        # Every <=2 edit result over a reduced alphabet for this boundary code.
        carriers={word}
        frontier={word}
        for _ in range(2):
            frontier={n for s in frontier for n in neighbors(s,'abcd',12)}
            carriers.update(frontier)
        for received in carriers:
            result=NS['decode_words'](book,received)
            assert result['status']=='DECODED' and result['symbol']==symbol
            assert result['canonical']==word and result['distance']<=2
            checked+=1
    assert checked==7253


def test_far_carrier_and_more_than_two_edits_are_not_authentication():
    book={'codewords':WORDS}
    assert NS['decode_words'](book,'')['status']=='UNCORRECTABLE'
    # Replacing a carrier with another canonical codeword changes its symbol.
    assert NS['decode_words'](book,WORDS[1])['symbol']==1


def test_decoder_fails_closed_if_an_invalid_alphabet_has_overlapping_balls():
    with pytest.raises(ValueError,match='Ambiguous'):
        NS['decode_words']({'codewords':['aaaaaaaaaa','aaaaaaaaba','bbbbbbbbbb','cccccccccc']},'aaaaaaaaaa')


@pytest.mark.parametrize('words',[['x']*4,[WORDS[0]]*4,WORDS[:3],['a'*161]+WORDS[1:],['é'*20]+WORDS[1:]])
def test_invalid_codebooks(words):
    with pytest.raises(ValueError):NS['spacing'](words)


@pytest.mark.parametrize('raw',[None,[],{}, {'audits':PASS,'approved':True}, {'audits':[['PASS']]*4},
                               {'audits':[['yes']*3]*4}, '{"audits":[],"audits":[]}'])
def test_malformed_audits(raw):
    with pytest.raises((ValueError,TypeError)):NS['audits'](raw)


def test_each_of_sixteen_audits_is_consequential():
    assert NS['report_for'](spec(),attempt(),WORDS,PASS)['status']=='PUBLISHED'
    for i in range(4):
        for j in range(4):
            for label in ['FAIL','UNKNOWN']:
                rows=copy.deepcopy(PASS);rows[i][j]=label
                report=NS['report_for'](spec(),attempt(),WORDS,rows)
                assert report['status']=='REJECTED'


def deploy(vm,factory,actor):vm.sender=actor;return factory(str(SOURCE))
def forge(c,vm,book,nonce='try',rows=None,words=None):
    vm.clear_mocks();vm.mock_llm('.*PARAPHRASE_CODEBOOK_V1.*',json.dumps({'codewords':WORDS if words is None else words}))
    vm.mock_llm('.*PARAPHRASE_FIDELITY_V1.*',json.dumps({'audits':PASS if rows is None else rows}))
    return c.forge(book,c.get_book(book)['input_root'],nonce)


def test_peer_forges_reusable_encode_decode_with_both_roots_pinned(direct_vm,direct_deploy,direct_alice,direct_bob):
    c=deploy(direct_vm,direct_deploy,direct_alice);key=c.create('book',ORIGINAL);s=c.get_book(key)
    direct_vm.sender=direct_bob
    root=forge(c,direct_vm,key);book=c.get_codebook(key)
    assert root==book['root']
    for symbol in range(4):
        out=c.encode(key,s['input_root'],root,symbol);assert out['carrier']==WORDS[symbol]
        for noisy in [out['carrier'],'!'+out['carrier'],out['carrier'][2:]]:
            decoded=c.decode(key,s['input_root'],root,noisy)
            assert decoded['symbol']==symbol and decoded['canonical']==WORDS[symbol]
    assert c.get_codebook(key)==book and c.get_book(key)==s
    assert c.decode(key,s['input_root'],root,'')['status']=='UNCORRECTABLE'
    with direct_vm.expect_revert('already published'):forge(c,direct_vm,key,'again')


def test_rejected_candidate_retained_but_cannot_encode_and_nonce_cannot_replay(direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice);key=c.create('book',ORIGINAL);rows=copy.deepcopy(PASS);rows[2][1]='UNKNOWN'
    root=forge(c,direct_vm,key,rows=rows)
    ctx=dict(book_id=key,caller=c.get_book(key)['creator'],nonce='try');ident=NS['digest'](ctx)
    report=c.get_attempt(ident);assert report['root']==root and report['status']=='REJECTED'
    with direct_vm.expect_revert('No published'):c.get_codebook(key)
    with direct_vm.expect_revert('Attempt already'):forge(c,direct_vm,key)
    forge(c,direct_vm,key,'different')
    assert c.get_attempt(ident)==report


def test_both_roots_cross_book_and_native_nonce_bindings(direct_vm,direct_deploy,direct_alice,direct_bob):
    c=deploy(direct_vm,direct_deploy,direct_alice);a=c.create('same',ORIGINAL);b=c.create('second',ORIGINAL)
    with direct_vm.expect_revert('Nonce already'):c.create('same','A different complete authored proposition.')
    direct_vm.sender=direct_bob;peer=c.create('same',ORIGINAL);assert peer!=a
    sa=c.get_book(a);sb=c.get_book(b)
    with direct_vm.expect_revert('Input root'):c.forge(b,sa['input_root'],'wrong')
    root=forge(c,direct_vm,a)
    with direct_vm.expect_revert('Input root'):c.encode(a,sb['input_root'],root,0)
    with direct_vm.expect_revert('Codebook root'):c.encode(a,sa['input_root'],'f'*64,0)
    with direct_vm.expect_revert('Codebook root'):c.decode(a,sa['input_root'],'f'*64,WORDS[0])


@pytest.mark.parametrize('value',[-1,4,True])
def test_symbol_domain(value,direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice);key=c.create('x',ORIGINAL);root=forge(c,direct_vm,key)
    with direct_vm.expect_revert('Symbol must'):c.encode(key,c.get_book(key)['input_root'],root,value)


@pytest.mark.parametrize('bad',['',' '*20,'é'*20,'a'*161,'line\nbreak text'])
def test_source_bounds(bad,direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice)
    with direct_vm.expect_revert('Invalid original'):c.create('bad',bad)


def test_invalid_generated_distance_or_schema_writes_no_attempt(direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice);key=c.create('x',ORIGINAL)
    with direct_vm.expect_revert('LLM_ERROR'):forge(c,direct_vm,key,words=[WORDS[0]]*4)
    ident=NS['digest'](dict(book_id=key,caller=c.get_book(key)['creator'],nonce='try'))
    with direct_vm.expect_revert('Unknown attempt'):c.get_attempt(ident)
    assert forge(c,direct_vm,key)==c.get_codebook(key)['root']


def test_actual_validator_reaudits_substance_and_rejects_rehashed_all_pass_forgery():
    class Return:
        def __init__(self,value):self.calldata=value
    calls=[]
    def llm(prompt,**kwargs):
        if prompt.startswith('PARAPHRASE_CODEBOOK_V1'):calls.append('generate');return {'codewords':WORDS}
        calls.append('independent-audit');assert ORIGINAL in prompt
        rows=copy.deepcopy(PASS)
        if 'without any approval' in prompt:rows[0]=['FAIL']*4
        return {'audits':rows}
    def run(leader,validator):
        honest=leader();assert validator(Return(honest)) is True
        wrong=WORDS[:];wrong[0]='Rin can open the crate without any approval.'
        forged=NS['report_for'](spec(),attempt(),wrong,PASS)
        assert validator(Return(forged)) is False
        forged=copy.deepcopy(honest);forged['input_root']='other-book';forged['root']=NS['digest']({k:v for k,v in forged.items() if k!='root'})
        assert validator(Return(forged)) is False
        assert validator(Exception('LLM_ERROR')) is False
        return honest
    gl=SimpleNamespace(nondet=SimpleNamespace(exec_prompt=llm),vm=SimpleNamespace(Return=Return,run_nondet_unsafe=run,UserError=RuntimeError))
    assert namespace(gl)['forge_report'](spec(),attempt())['status']=='PUBLISHED'
    assert calls.count('generate')==1 and calls.count('independent-audit')==4


def test_padding_style_fails_and_exact_original_copy_cannot_publish():
    words=WORDS[:];words[0]=ORIGINAL+'     '
    rows=copy.deepcopy(PASS);rows[0][3]='FAIL'
    assert NS['report_for'](spec(),attempt(),words,rows)['status']=='REJECTED'
    words[0]=ORIGINAL
    with pytest.raises(ValueError,match='Exact copies'):NS['report_for'](spec(),attempt(),words,PASS)
