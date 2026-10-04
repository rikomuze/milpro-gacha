(() => {
'use strict';

const MEMBERS = [
  {id:'amakami-konomi',name:'甘狼このみ',gold:false},
  {id:'nonono-nono',name:'音ノ乃のの',gold:false},
  {id:'akubi-demonspade',name:'あくび・でもんすぺーど',gold:false},
  {id:'otonose-raco',name:'音ノ瀬らこ',gold:false},
  {id:'yuragi-yura',name:'ゆらぎゆら',gold:true},
  {id:'komawari-koma',name:'小廻こま',gold:true},
  {id:'nemukumo-tsukuri',name:'眠雲ツクリ',gold:false},
  {id:'amayo-liz',name:'雨夜リズ',gold:false},
  {id:'nijipuka-nuhu',name:'虹深°ぬふ',gold:true},
  {id:'yugiri-ray',name:'夕霧レイ',gold:false},
  {id:'kano-mahoro',name:'鹿乃まほろ',gold:false}
];

// Canva素材が揃ったら badges.json の image / expression を増やす。
// 今は各メンバー1種の仮バッジでガチャ挙動を確認できる。
const BADGES = MEMBERS.map((m,i)=>({
  id:m.id+'-base'+(m.gold?'-gold':''),
  memberId:m.id,
  member:m.name,
  expression:'base',
  expressionLabel:'基本',
  rarity:m.gold?'gold':'normal',
  image:'',
  order:i
}));

const KEY='milpro-gacha-v1';
let state = JSON.parse(localStorage.getItem(KEY)||'null') || {pulls:0,items:{},history:[],oshi:MEMBERS[0].id};
let tab='collection';

const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const member=id=>MEMBERS.find(m=>m.id===id);
const badge=id=>BADGES.find(b=>b.id===id);
const initials=name=>name.replace(/[°・]/g,'').slice(0,2);

function init(){
  $('#oshi').innerHTML=MEMBERS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
  $('#oshi').value=state.oshi;
  $('#oshi').onchange=e=>{state.oshi=e.target.value;save();renderPanel();};
  $('#pullBtn').onclick=pull;
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{
    tab=b.dataset.tab;
    document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));
    renderPanel();
  });
  renderCount();renderPanel();
}

function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function draw(){
  const goldPool=BADGES.filter(b=>b.rarity==='gold');
  const normalPool=BADGES.filter(b=>b.rarity==='normal');
  const isGold=Math.random()<0.15 && goldPool.length;
  const pool=isGold?goldPool:normalPool;
  const memberIds=[...new Set(pool.map(b=>b.memberId))];
  const chosenMember=pick(memberIds);
  return pick(pool.filter(b=>b.memberId===chosenMember));
}

function pull(){
  const b=draw();
  state.pulls++;
  state.items[b.id]=(state.items[b.id]||0)+1;
  state.history.unshift({id:b.id,t:Date.now()});
  state.history=state.history.slice(0,80);
  save();renderCount();showResult(b);renderPanel();
}

function badgeHTML(b,large=false){
  const cls=b.rarity==='gold'?'badge gold':'badge';
  const inside=b.image? `<img src="${b.image}" alt="${b.member} ${b.expressionLabel}">` : `<span class="initial">${initials(b.member)}</span>`;
  return `<div class="${cls} ${large?'pop':''}">${inside}<span class="rarity">${b.rarity==='gold'?'GOLD':'NORMAL'}</span></div>`;
}

function showResult(b){
  const hit=b.memberId===state.oshi;
  $('#window').innerHTML=`<div class="result">${badgeHTML(b,true)}<h2>${b.member}</h2><p>${b.expressionLabel}${hit?' ・ 推しを自引き！':''}</p></div>`;
}

function renderCount(){ $('#countLabel').textContent=`${state.pulls} pulls`; }

function renderPanel(){
  const panel=$('#panel');
  if(tab==='history'){
    const rows=state.history.map(x=>{const b=badge(x.id);if(!b)return'';return `<div class="hist"><div class="mini">${initials(b.member)}</div><div><b>${b.member}</b><br><small>${b.expressionLabel} / ${b.rarity==='gold'?'GOLD':'NORMAL'}</small></div><time>${new Date(x.t).toLocaleDateString('ja-JP')}</time></div>`}).join('');
    panel.innerHTML=`<div class="summary"><div><span>開封履歴</span><br><b>${state.history.length}</b></div></div>${rows?`<div class="history">${rows}</div>`:'<div class="empty">まだガチャを回していません。</div>'}`;
    return;
  }
  const owned=BADGES.filter(b=>state.items[b.id]);
  const total=BADGES.length;
  const cards=BADGES.map(b=>{
    const q=state.items[b.id]||0;
    return q?`<button class="item ${b.rarity==='gold'?'gold':''}" data-id="${b.id}"><div class="thumb">${b.image?`<img src="${b.image}" alt="">`:initials(b.member)}</div><div class="name">${b.member}</div><div class="qty">${b.expressionLabel} ×${q}</div></button>`
      :`<div class="item"><div class="thumb">?</div><div class="name">？？？</div><div class="qty">未所持</div></div>`;
  }).join('');
  panel.innerHTML=`<div class="summary"><div><span>COLLECTION</span><br><b>${owned.length}<small> / ${total}</small></b></div><span>推し：${member(state.oshi)?.name||''}</span></div><div class="collection">${cards}</div>`;
  panel.querySelectorAll('[data-id]').forEach(el=>el.onclick=()=>openDetail(badge(el.dataset.id)));
}

function openDetail(b){
  const d=$('#detail'),q=state.items[b.id]||0;
  d.innerHTML=`<div style="display:grid;place-items:center">${badgeHTML(b)}</div><h2 style="text-align:center;margin:14px 0 4px">${b.member}</h2><p style="text-align:center;color:#7d7488;margin:0">${b.expressionLabel} ・ ${b.rarity==='gold'?'GOLD':'NORMAL'} ・ ×${q}</p><button class="detail-close">閉じる</button>`;
  d.querySelector('.detail-close').onclick=()=>d.close();d.showModal();
}

init();
})();