import test from 'node:test';
import assert from 'node:assert/strict';
import { budgetCheck, searchProfiles, emails, jevRequest, evaluate, csvCell, ordinaryJob, linkedIdentity } from './modash-source.mjs';

test('Discovery total counts unresolved reservations and cannot exceed 100 credits',()=>{
  const ledger={reserveReleased:true,entries:[{kind:'report',cost:89000},{kind:'search',cost:6000},{kind:'ai',max:4000}]};
  assert.doesNotThrow(()=>budgetCheck(ledger,'report',1000));
  assert.throws(()=>budgetCheck(ledger,'report',1001),/hard limit/);
});
test('reserve requires deliberate release and RAW has an independent ceiling',()=>{
  assert.throws(()=>budgetCheck({entries:[{kind:'report',cost:80000}]},'report',1000),/allocation/);
  assert.doesNotThrow(()=>budgetCheck({initialRaw:100,entries:[{kind:'report',cost:90000}]},'raw',1,true));
  assert.throws(()=>budgetCheck({initialRaw:100,entries:[{rawMax:100}]},'raw',1,true),/hard limit/);
  assert.throws(()=>budgetCheck({initialRaw:0,entries:[]},'raw',1,true),/hard limit/);
});
test('AI percentage units are normalised to the ordinary search fraction',()=>{
  const row=searchProfiles('instagram',{profiles:[{userId:'1',username:'sample',followersCount:12000,engagementRate:2.5}]},'test',true)[0];
  assert.equal(row.engagementRate,.025);
  assert.equal(row.key,'instagram:1');
});
test('email extraction does not invent addresses or accept image filenames',()=>{
  assert.deepEqual(emails('Contact SAMPLE@MAIL.TEST and image@2x.png; missing at mail.test'),['sample@mail.test']);
});
test('Jev receives source text without contact email addresses',()=>{
  const request=jevRequest({bio:'Contact sample@mail.test',posts:[{text:'A reading journal. sample@mail.test',title:'',created:null}]});
  assert.ok(!JSON.stringify(request).includes('sample@mail.test'));
  assert.equal(request.questions.book_0.type,'noul');
});
test('high content score with no dated evidence stays in review',()=>{
  const row={platform:'youtube',bio:'Books',emails:[{email:'sample@mail.test'}],judgment:{answers:{reading:{score:4,confidence:1},product:{score:4,confidence:1},niche:{choice:'clubs'},community:{noul:1}}}};
  const result=evaluate(row);
  assert.equal(result.status,'review');
  assert.equal(result.exception,false);
});
test('active substantive evidence and a sourced email can qualify',()=>{
  const answers={reading:{score:4,confidence:1},product:{score:3,confidence:1},niche:{choice:'trackers'},community:{noul:0}};
  const posts=Array.from({length:10},(_,i)=>{answers[`book_${i}`]={noul:.99};return {text:'Reading journal',created:'2026-09-20T12:00:00.000Z',views:1000,likes:50};});
  const row={platform:'tiktok',posts,emails:[{email:'sample@mail.test'}],judgment:{answers}};
  assert.equal(evaluate(row,Date.parse('2026-09-22')).status,'qualified');
  row.emails[0].domainStatus='invalid';
  assert.equal(evaluate(row,Date.parse('2026-09-22')).status,'no_email');
});
test('searches require an email and CSV cells cannot execute formulas',()=>{
  assert.equal(ordinaryJob('youtube','reading journal').body.filter.influencer.hasContactDetails[0].filterAction,'must');
  assert.equal(csvCell('=1+1'),'"\'=1+1"');
});
test('explicit cross-platform contacts establish identity but a shared agency email does not',()=>{
  const target={key:'instagram:2',platform:'instagram',handle:'reader',url:'https://www.instagram.com/reader/'};
  assert.equal(linkedIdentity(target,[{key:'youtube:1',contacts:[{type:'instagram',value:'https://www.instagram.com/reader/'}]}]),'youtube:1');
  assert.equal(linkedIdentity(target,[{key:'youtube:1',contacts:[{type:'email',value:'agency@mail.test'}]}]),null);
});
