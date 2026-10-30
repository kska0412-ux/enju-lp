const CONSULTATION_URL = "";
const dialog = document.querySelector('#info-dialog');
const content = {
booking:{category:'45分 / Zoom / 無料',title:'無料個別相談',body:'<p>リンパの知識やお客様への説明、これからの学び方についてお話しする45分です。</p><div class="dialog-info"><p class="booking-status">お申し込みの受付は準備中です。</p><p>受付開始まで、講座内容をご覧になってお待ちください。</p></div>'},
operator:{category:'運営者情報',title:'enju by Gracias',body:'<p>沖縄市でリンパマッサージを中心としたサロンを運営しています。</p><p>スクールの運営に関する詳細情報は、受付開始時にご案内します。</p>'},
privacy:{category:'個人情報のお取り扱い',title:'プライバシーポリシー',body:'<p>正式なプライバシーポリシーは、受付開始に向けて準備しています。</p><p>現在、このページではお名前や連絡先などの個人情報を受け付けていません。</p>'},
contact:{category:'お問い合わせ',title:'お問い合わせ窓口',body:'<p>お問い合わせ窓口は、現在準備中です。</p><p>受付開始時に、このページでご案内します。</p>'}
};
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{
if(button.dataset.dialog==='booking'&&CONSULTATION_URL){window.location.assign(CONSULTATION_URL);return;}
const item=content[button.dataset.dialog];if(!item)return;
document.querySelector('#dialog-category').textContent=item.category;
document.querySelector('#dialog-title').textContent=item.title;
document.querySelector('#dialog-body').innerHTML=item.body;
window.enjuFormatPhrases?.(dialog);
dialog.showModal();
}));
document.querySelectorAll('.dialog-close,.dialog-dismiss').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});

/* Keep Japanese words and their particles together without locking a paragraph. */
(() => {
  const protectedWords = ['リンパセラピスト','リンパマッサージ','ヘッドマッサージ','小顔筋膜リリース','オンラインスクール','カウンセリング','プライバシーポリシー','無料個別相談','個別相談','セルフケア','サロンワーク','基礎知識','信頼関係','受講期間','受講料','リピート率','セラピスト','お客様','お悩み','未経験','身につける','身につけ','自分のペース','伝え方','学び方','つなげる','つなげて','つながる','つながらず','わかりやすく','わかりやすい','分かりやすく','分かりやすい','お申し込み','お支払い','ご紹介','ご案内','150,000円','150,000','45分','3ヶ月','3年以上','2号店','学び直したい','受け付けています','通い続けて','取り入れて','お聞かせください','開業・独立','サロン運営','関係づくり','いただいた声'].sort((a,b)=>b.length-a.length);
  const keywordPattern = new RegExp('('+protectedWords.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','gu');
  const protectedSet = new Set(protectedWords);
  const bound = new Set(['を','は','が','に','へ','で','と','の','も','や','から','まで','より','だけ','ほど','など','こそ','さえ','しか','でも','には','では','とは','にも','のは','のが','のを','として','について','にとって','ため','ために','です','ます','まし','ませ','ん','だ','でし','でした','ません','あり','ある','いる','い','られ','れる','れ','せ','さ','た','て','し','なり','なる','でき','できる','いただき','いただく','いただけ','いただける','たい','なく','ない','なかっ','よい','そう']);
  const closing = /^[、。，．！？!?：:；;）)］\]｝}」』】〉》…・]+$/u;
  const opening = /^[（(［\[｛{「『【〈《]+$/u;
  const wordBlocks = /[一-龯々〆]+[ぁ-ゖゝゞー]*|[ァ-ヶー・]+[ぁ-ゖゝゞ]*|[ぁ-ゖゝゞー]+|[A-Za-z][A-Za-z0-9_-]*|[0-9][0-9,.]*(?:ヶ月|か月|分|円|年|号店|%)?|\s+|./gu;
  function phrases(text) {
    const tokens = text.split(keywordPattern).filter(Boolean).flatMap(part=>protectedSet.has(part)?[part]:(part.match(wordBlocks)||[part]));
    const result=[]; let prefix='';
    for(const token of tokens){
      if(/^\s+$/u.test(token)){result.push(token);continue;}
      if(opening.test(token)||['お','ご','未','無','不','再'].includes(token)){prefix+=token;continue;}
      if(!prefix&&(bound.has(token)||closing.test(token)||/^[ぁ-ゖゝゞー]+$/u.test(token))&&result.length){
        const last=result.at(-1);const whitespace=/^\s+$/u.test(last);
        const prior=whitespace?result.at(-2):last;
        if(prior&&(bound.has(token)||closing.test(token)||!/[、。！？!?]$/u.test(prior))){
          if(whitespace)result.pop();result[result.length-1]+=(whitespace?last:'')+token;continue;
        }
      }
      result.push(prefix+token);prefix='';
    }
    if(prefix) result.push(prefix);
    return result;
  }
  const seen = new WeakSet();
  function wrapWords(roots){for(const root of roots){
    if(root.closest('.tuition-value,.cta-button,.cta-call,.quote-mark,.footer-brand')) continue;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); const nodes=[];
    while(walker.nextNode()){
      const node=walker.currentNode;
      if(seen.has(node)||!node.textContent.trim()||node.parentElement.closest('.jp-phrase,.tuition-value,.cta-button,.cta-call,.quote-mark,.faq-list summary>span:not(.faq-question),.consultation-flow li>span')) continue;
      seen.add(node);nodes.push(node);
    }
    for(const node of nodes){
      const fragment=document.createDocumentFragment();
      for(const phrase of phrases(node.textContent)){
        if(/^\s+$/u.test(phrase)){fragment.append(document.createTextNode(phrase));continue;}
        const span=document.createElement('span');span.className='jp-phrase';span.textContent=phrase;fragment.append(span);
      }
      node.replaceWith(fragment);
    }
  }}
  wrapWords(document.querySelectorAll('main section:not(#home) :is(p,h2,h3,h4,li,dt,dd,cite,summary,figcaption),footer p'));
  window.enjuFormatPhrases=scope=>wrapWords(scope.querySelectorAll('p,h2'));

  /* Each chapter has its own entrance; content stays available without JS. */
  const targets=[];const registered=new Set();
  function add(selector,type,stagger=0){document.querySelectorAll(selector).forEach((el,index)=>{
    if(registered.has(el))return;registered.add(el);el.dataset.motion=type;
    el.style.setProperty('--entry-delay',Math.min(index*stagger,330)+'ms');targets.push(el);
  });}
  add('#home .mbd-copy','hero-copy');add('#home .mbd-photo','hero-photo');add('#home .mbd-benefits>div','hero-tag',65);
  add('#worries .question-banner','soft-zoom');add('#worries .problem-list>li','slide-left',50);add('#worries .problem-message','rise');
  add('#future .section-photo','picture-rise');add('#future .goal-compare>div:first-child','slide-left');add('#future .goal-compare>div:last-child','slide-right');add('#future .subheading','focus');
  add('#learning .barrier-group>div','rise',60);add('#learning .reason','card-rise');add('#learning .reason-image','curtain');add('#learning .curriculum-grid>article','tile',60);
  add('#teacher .salon-photo','focus');add('#teacher .profile-facts>div','fact',80);add('#teacher .teacher-letter','letter');
  add('#voice .section-photo','soft-zoom');add('#voice .voice-box','quote');
  add('#tuition .tuition-panel','panel');add('#tuition .tuition-fact','number',90);
  add('#benefits .section-photo','round-reveal');add('#benefits .check-list>li','slide-right',50);add('#benefits .faq-list>details','rise',55);
  add('#consultation .section-photo','conversation');add('#consultation .consultation-table','table');add('#consultation .consultation-flow li','flow-step',110);add('#consultation .final-cta','closing');
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches||!('IntersectionObserver' in window)) return;
  let observer;
  const revealAll=()=>{observer?.disconnect();targets.forEach(el=>el.classList.remove('motion-armed'));};
  try{
    observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(!entry.isIntersecting)return;
        const el=entry.target;el.classList.add('is-revealed');observer.unobserve(el);
        const finish=event=>{if(event.target!==el)return;el.classList.remove('motion-armed');el.classList.add('motion-complete');el.removeEventListener('animationend',finish);};
        el.addEventListener('animationend',finish);
      });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    targets.forEach(el=>{el.classList.add('motion-armed');observer.observe(el);});
    window.addEventListener('pagehide',revealAll,{once:true});
    preference.addEventListener('change',event=>{if(event.matches)revealAll();});
  }catch{revealAll();}
})();
