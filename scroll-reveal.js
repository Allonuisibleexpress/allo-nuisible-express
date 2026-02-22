(function(){
  var GROUPS=[
    {selector:'.hero .hero-wrap, .hero > h1, .hero > p, .hero > div', step:0},
    {selector:'.services-head', step:0},
    {selector:'.cards .card', step:80},
    {selector:'.process-top .process-mini', step:90},
    {selector:'.process-section .process-head', step:0},
    {selector:'.process-section .step-card', step:90},
    {selector:'.tarifs .tarif-box', step:0},
    {selector:'.reviews h2, .reviews-intro, .reviews-top, .reviews-slider', step:70},
    {selector:'.reviews .review-card', step:90},
    {selector:'.faq h2, .faq-intro, .faq .faq-item', step:70},
    {selector:'main > section, main > article, main > aside', step:80},
    {selector:'main .card, main .post, main .content, main .grid', step:70},
    {selector:'.site-footer-main > section', step:90},
    {selector:'.site-footer-bottom', step:0}
  ];

  var observer=null;

  function isEligible(el){
    if(!el || el.classList.contains('js-reveal-ignore')){return false;}
    if(el.closest('header') || el.closest('.site-sticky-cta')){return false;}
    return true;
  }

  function collectTargets(root){
    var seen=new Set();
    GROUPS.forEach(function(group){
      var nodes=[].slice.call((root || document).querySelectorAll(group.selector));
      var order=0;
      nodes.forEach(function(node){
        if(!isEligible(node)){return;}
        if(!node.classList.contains('js-reveal')){
          node.classList.add('js-reveal');
          node.style.setProperty('--reveal-delay',(order * group.step) + 'ms');
        }
        order += 1;
        seen.add(node);
      });
    });
    return Array.from(seen);
  }

  function ensureObserver(){
    if(observer || !('IntersectionObserver' in window)){return;}
    observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{rootMargin:'0px 0px -10% 0px',threshold:0.14});
  }

  function reveal(nodes){
    if(!nodes.length){return;}
    if(!('IntersectionObserver' in window)){
      nodes.forEach(function(node){node.classList.add('is-visible');});
      return;
    }
    ensureObserver();
    nodes.forEach(function(node){
      if(!node.classList.contains('is-visible')){observer.observe(node);} 
    });
  }

  function refresh(root){
    reveal(collectTargets(root || document));
  }

  window.__alloScrollRevealRefresh=refresh;

  function watchDynamicReviews(){
    var track=document.querySelector('[data-reviews-track]');
    if(!track || !('MutationObserver' in window)){return;}
    var mo=new MutationObserver(function(){ refresh(track); });
    mo.observe(track,{childList:true,subtree:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){
      refresh(document);
      watchDynamicReviews();
    });
  }else{
    refresh(document);
    watchDynamicReviews();
  }
})();
