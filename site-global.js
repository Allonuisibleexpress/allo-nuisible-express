(function(){
  var PREFERRED_ORIGIN='https://allonuisibleexpress.fr';
  var PROJECT_PATH_PREFIX='/allo-nuisible-express';

  function normalizedPathname(){
    var path=window.location.pathname||'/';
    if(path.indexOf(PROJECT_PATH_PREFIX+'/')===0){
      path=path.slice(PROJECT_PATH_PREFIX.length);
    }else if(path===PROJECT_PATH_PREFIX){
      path='/';
    }
    return path||'/';
  }

  function canonicalUrl(){
    return PREFERRED_ORIGIN+normalizedPathname();
  }

  function enforcePrimaryDomain(){
    var host=(window.location.hostname||'').toLowerCase();
    if(host==='localhost' || host==='127.0.0.1' || host==='' || window.location.protocol==='file:'){
      return;
    }
    if(host.indexOf('github.io')!==-1){
      var target=canonicalUrl()+window.location.search+window.location.hash;
      if(window.location.href!==target){
        window.location.replace(target);
      }
    }
  }

  function currentPage(){
    var p=normalizedPathname().split('/').pop();
    return p||'index.html';
  }

  function isHomePage(){
    return currentPage()==='index.html';
  }

  function processHTML(){
    return ''+
    '<section class="process-top global-process">'+
    '  <div class="process-top-grid">'+
    '    <article class="process-mini">'+
    '      <svg class="process-mini-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 7h13v10H3zM16 9h3l2 2v4h-5zM7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4m11 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/></svg>'+ 
    '      <h3>Disponibilité 24h/24</h3><p>Disponibilité 24h/24 et 7j/7.</p>'+ 
    '    </article>'+ 
    '    <article class="process-mini">'+ 
    '      <svg class="process-mini-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 2h2v5h-2zM4.93 4.93l1.41-1.41 3.54 3.54-1.41 1.41zM2 11h5v2H2zm15 0h5v2h-5zM6.34 20.48l-1.41-1.41 3.54-3.54 1.41 1.41zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10"/></svg>'+ 
    '      <h3>Diagnostic gratuit</h3><p>Déplacement et pré-diagnostic offerts.</p>'+ 
    '    </article>'+ 
    '    <article class="process-mini">'+ 
    '      <svg class="process-mini-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l8 4v6c0 5.25-3.4 9.74-8 11-4.6-1.26-8-5.75-8-11V6z"/></svg>'+ 
    '      <h3>Garantie</h3><p>Nos protocoles incluent un suivi garanti.</p>'+ 
    '    </article>'+ 
    '    <article class="process-mini">'+ 
    '      <svg class="process-mini-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c3.3 0 6 2.7 6 6 0 4.4-6 12-6 12S6 12.4 6 8c0-3.3 2.7-6 6-6m0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6"/></svg>'+ 
    '      <h3>Certification État</h3><p>Techniciens qualifiés selon les normes en vigueur.</p>'+ 
    '    </article>'+ 
    '  </div>'+ 
    '</section>'+ 
    '<section class="process-section global-process">'+ 
    '  <div class="process-wrap">'+ 
    '    <div class="process-head">'+ 
    '      <h2>Découvrez notre méthode d’intervention</h2>'+ 
    '      <p>Allo Nuisible Express met en place un parcours clair, rapide et rigoureux pour traiter durablement rats, souris, cafards, punaises et autres nuisibles.</p>'+ 
    '    </div>'+ 
    '    <div class="process-steps">'+ 
    '      <article class="step-card"><span class="step-badge">1</span><h3>Contact</h3><p>Dès votre demande, nous réalisons une première évaluation de la situation.</p><ul class="step-list"><li>Disponibilité 24h/24 et 7j/7</li><li>Prise de rendez-vous rapide</li><li>Tarification transparente</li></ul></article>'+ 
    '      <article class="step-card"><span class="step-badge">2</span><h3>Inspection</h3><p>Un technicien effectue un état des lieux complet pour définir la meilleure stratégie.</p><ul class="step-list"><li>Déplacement et diagnostic gratuits</li><li>Remise d’un devis clair</li><li>Plan d’action personnalisé</li></ul></article>'+ 
    '      <article class="step-card"><span class="step-badge">3</span><h3>Traitement</h3><p>Nous appliquons le protocole adapté selon le nuisible et la configuration du site.</p><ul class="step-list"><li>Intervention rapide 7j/7</li><li>Techniciens qualifiés et agréés</li><li>Méthode précise et sécurisée</li></ul></article>'+ 
    '      <article class="step-card"><span class="step-badge">4</span><h3>Suivi</h3><p>Nous restons disponibles après passage pour consolider le résultat dans la durée.</p><ul class="step-list"><li>Recommandations de prévention</li><li>Suivi téléphonique</li><li>Traitements garantis</li></ul></article>'+ 
    '    </div>'+ 
    '  </div>'+ 
    '</section>';
  }

  function footerHTML(){
    return ''+
    '<footer class="site-footer global-footer">'+
    '  <div class="site-footer-main">'+
    '    <section>'+ 
    '      <a class="footer-logo" href="index.html" aria-label="Retour à l\'accueil"><img src="logo.png" alt="Allo Nuisible Express"></a>'+ 
    '      <p class="footer-text">Allo Nuisible Express intervient rapidement en Île-de-France pour la dératisation, la désinsectisation, la désinfection et le dépigeonnage.</p>'+ 
    '      <div class="footer-socials" aria-label="Réseaux sociaux">'+ 
    '        <a class="footer-social-link" href="https://x.com/FranceNuisible" target="_blank" rel="noopener noreferrer">X</a>'+ 
    '        <a class="footer-social-link" href="https://www.youtube.com/@AlloNuisibleExpress" target="_blank" rel="noopener noreferrer">YouTube</a>'+ 
    '        <a class="footer-social-link" href="https://maps.app.goo.gl/EWnwrfLmvWMRjEds6" target="_blank" rel="noopener noreferrer">Google Maps</a>'+ 
    '      </div>'+ 
    '    </section>'+ 
    '    <section><h3>Informations utiles</h3><ul class="footer-list"><li><a href="contact.html">Contact</a></li><li><a href="mentions-legales.html">Mentions légales</a></li><li><a href="politique-confidentialite.html">Confidentialité</a></li><li><a href="cgv-cgu.html">CGV / CGU</a></li><li><a href="blog.html">Blog</a></li></ul></section>'+ 
    '    <section><h3>Nos services</h3><ul class="footer-services"><li><a href="deratisation.html">Dératisation</a></li><li><a href="punaises.html">Punaises de lit</a></li><li><a href="desinsectisation.html">Désinsectisation</a></li><li><a href="desinfection.html">Désinfection</a></li><li><a href="cafards.html">Cafards</a></li><li><a href="acariens.html">Acariens</a></li><li><a href="xylophage.html">Xylophages</a></li><li><a href="mouches.html">Mouches</a></li><li><a href="fourmis.html">Fourmis</a></li><li><a href="depigeonnage.html">Dépigeonnage</a></li><li><a href="frelons.html">Frelons / Guêpes</a></li><li><a href="diogene.html">Syndrome de Diogène</a></li></ul></section>'+ 
    '    <section class="footer-contact"><h3>Contactez-nous</h3><p>4 Rue de la Couture du Moulin, 94320 Thiais</p><div class="footer-cta"><a class="footer-btn footer-btn-devis" href="devis.html">✉ Demande de devis</a><a class="footer-btn footer-btn-call" href="tel:0744296897">📞 07 44 29 68 97</a></div></section>'+ 
    '  </div>'+ 
    '  <div class="site-footer-bottom">Tous droits réservés <b>ALLO NUISIBLE EXPRESS</b> — <span class="js-year"></span></div>'+ 
    '</footer>';
  }

  function ctaHTML(){
    return ''+
    '<div class="site-sticky-cta global-sticky-cta" role="complementary" aria-label="Appel rapide">'+
    '  <a class="sticky-link sticky-call" href="tel:0744296897" aria-label="Appeler le 07 44 29 68 97">'+
    '    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.3 11.3 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.7a1 1 0 0 1 1 1 11.3 11.3 0 0 0 .57 3.56 1 1 0 0 1-.24 1l-2.4 2.24Z"/></svg>'+ 
    '    <span class="sticky-default">URGENCE · APPELER MAINTENANT</span><span class="sticky-hover-number">07 44 29 68 97</span>'+ 
    '  </a>'+ 
    '</div>';
  }

  function detectCity(){
    var path=(window.location.pathname||'').toLowerCase();
    var h1=document.querySelector('h1');
    var text=((h1?h1.textContent:'')+' '+path).toLowerCase();
    if(text.indexOf('thiais')!==-1){return 'Thiais';}
    if(text.indexOf('rungis')!==-1){return 'Rungis';}
    if(text.indexOf('paris')!==-1){return 'Paris';}
    return 'Île-de-France';
  }

  function ensureHomeUrgencyStrip(){
    var header=document.querySelector('header');
    var strip=document.querySelector('.home-urgent-strip');
    if(!strip){
      strip=document.createElement('a');
      strip.className='home-urgent-strip';
      strip.href='tel:0744296897';
      strip.setAttribute('aria-label','Urgence 24h/24 - Appeler le 07 44 29 68 97');
      strip.innerHTML='<span class="urgent-default">URGENCE 24H/24 · 7J/7</span><span class="urgent-hover">07 44 29 68 97</span>';
    }
    if(header && header.parentNode){
      if(strip.parentNode!==header.parentNode || strip.previousElementSibling!==header){
        if(header.nextSibling){
          header.parentNode.insertBefore(strip, header.nextSibling);
        }else{
          header.parentNode.appendChild(strip);
        }
      }
      document.body.classList.add('has-home-urgent-strip');
    }else{
      if(strip.parentNode!==document.body){
        document.body.insertBefore(strip, document.body.firstChild);
      }
      document.body.classList.add('has-home-urgent-strip');
    }
    // Position strip right under header on every page/layout.
    var headerHeight=96;
    if(header && header.offsetHeight){headerHeight=header.offsetHeight;}
    var topPx=Math.max(72,headerHeight);
    var stripMinHeight=(window.innerWidth<=560?48:(window.innerWidth<=980?50:52));
    document.documentElement.style.setProperty('--allo-urgent-top',topPx+'px');
    document.documentElement.style.setProperty('--allo-urgent-height',stripMinHeight+'px');
    strip.style.position='fixed';
    strip.style.left='0';
    strip.style.right='0';
    strip.style.top=topPx+'px';
    strip.style.display='flex';
    strip.style.alignItems='center';
    strip.style.justifyContent='center';
    strip.style.minHeight=stripMinHeight+'px';
    strip.style.zIndex='10040';
    strip.style.background='#b11414';
    strip.style.color='#fff';
    strip.style.textDecoration='none';
    strip.style.visibility='visible';
    strip.style.opacity='1';
    strip.style.pointerEvents='auto';

    if(!window.__alloUrgentResizeBound){
      window.__alloUrgentResizeBound=true;
      window.addEventListener('resize',function(){
        ensureHomeUrgencyStrip();
      });
    }
  }

  function reviewsHTML(){
    return ''+
    '<section class="reviews global-reviews" id="avis-google" data-global-reviews>'+ 
    '<h2>Ils nous font confiance</h2>'+ 
    '<p class="reviews-intro">Retrouvez des retours clients publiés sur Google. Affichage filtré sur des avis 5 étoiles.</p>'+ 
    '<div class="reviews-top">'+ 
    '  <span>Note Google : <strong data-google-note>...</strong> <span data-google-stars>★★★★★</span></span>'+ 
    '  <a href="https://maps.app.goo.gl/EWnwrfLmvWMRjEds6" target="_blank" rel="noopener noreferrer">Voir tous les avis Google</a>'+ 
    '</div>'+ 
    '<div class="reviews-slider" data-reviews-slider>'+ 
    '  <button class="reviews-nav prev" type="button" aria-label="Avis précédents" data-reviews-prev>‹</button>'+ 
    '  <div class="reviews-viewport"><div class="reviews-track" data-reviews-track><div class="review-empty">Chargement des avis Google…</div></div></div>'+ 
    '  <button class="reviews-nav next" type="button" aria-label="Avis suivants" data-reviews-next>›</button>'+ 
    '  <div class="reviews-dots" data-reviews-dots></div>'+ 
    '</div>'+ 
    '</section>';
  }

  function faqHTML(){
    return ''+
    '<section class="faq global-faq" id="contact" data-global-faq>'+ 
    '<h2>Questions Fréquentes</h2>'+ 
    '<p class="faq-intro">Questions fréquemment posées sur les nuisibles à Paris et en banlieue parisienne, avec des réponses claires pour vous aider à agir rapidement.</p>'+ 
    '<details class="faq-item"><summary class="faq-question">Quels services proposez-vous exactement ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) Nous proposons une prise en charge complète de la lutte anti-nuisibles pour les particuliers comme pour les professionnels : dératisation, désinsectisation, désinfection, dépigeonnage, traitement des punaises, cafards, frelons, guêpes, chenilles processionnaires, acariens, xylophages, mouches, fourmis et interventions Diogène.</div></details>'+ 
    '<details class="faq-item"><summary class="faq-question">Quels sont vos prix de départ ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) Nos tarifs sont les suivants : guêpes/frelons à partir de 120 EUR, syndrome de Diogène à partir de 400 EUR, et tous les autres nuisibles sur devis. Vous bénéficiez d\'une garantie de 1 mois avec suivi.</div></details>'+ 
    '<details class="faq-item"><summary class="faq-question">Dans quelles zones intervenez-vous ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) Nous intervenons dans toute l\'Île-de-France : 75, 77, 78, 91, 92, 93, 94 et 95, avec des créneaux rapides pour les particuliers et professionnels.</div></details>'+ 
    '<details class="faq-item"><summary class="faq-question">En combien de temps pouvez-vous intervenir ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) Nous intervenons en urgence 24h/24 et 7j/7, y compris la nuit, les week-ends et les jours fériés.</div></details>'+ 
    '<details class="faq-item"><summary class="faq-question">Quels nuisibles traitez-vous ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) Nous traitons rats, souris, cafards, punaises de lit, guêpes, frelons, pigeons, chenilles processionnaires, acariens, xylophages, mouches, fourmis et autres nuisibles selon la situation terrain.</div></details>'+ 
    '<details class="faq-item"><summary class="faq-question">Comment se déroule une intervention ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) L\'intervention suit un parcours clair : diagnostic, inspection, traitement ciblé, puis suivi avec recommandations de prévention.</div></details>'+ 
    '<details class="faq-item"><summary class="faq-question">Y a-t-il une garantie après traitement ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) Oui, vous bénéficiez d\'une garantie de 1 mois avec suivi sur nos protocoles d\'intervention.</div></details>'+ 
    '<details class="faq-item"><summary class="faq-question">Comment vous contacter pour un devis ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) Par formulaire en ligne, téléphone au 07 44 29 68 97, WhatsApp, e-mail et réseaux sociaux.</div></details>'+ 
    '</section>';
  }

  function insertBeforeFooter(html){
    var holder=document.createElement('div');
    holder.innerHTML=html;
    var footer=document.querySelector('footer.site-footer');
    if(footer){
      while(holder.firstElementChild){
        footer.parentNode.insertBefore(holder.firstElementChild, footer);
      }
    }else{
      while(holder.firstElementChild){
        document.body.appendChild(holder.firstElementChild);
      }
    }
  }

  function ensureFooter(){
    var existing=document.querySelector('footer.site-footer');
    if(isHomePage()){return;}
    var holder=document.createElement('div');
    holder.innerHTML=footerHTML();
    var fresh=holder.firstElementChild;
    if(!existing){document.body.appendChild(fresh);return;}
    if(existing.classList.contains('global-footer')){return;}
    existing.parentNode.replaceChild(fresh, existing);
  }

  function ensureProcess(){
    if(document.querySelector('.process-section')){return;}
    var holder=document.createElement('div');
    holder.innerHTML=processHTML();
    var footer=document.querySelector('footer.site-footer');
    if(footer){footer.parentNode.insertBefore(holder, footer);}else{document.body.appendChild(holder);} 
  }

  function ensureReviewsFaq(){
    var needReviews=!document.querySelector('.reviews');
    var needFaq=!document.querySelector('.faq');
    if(!needReviews && !needFaq){return;}
    var html='';
    if(needReviews){html += reviewsHTML();}
    if(needFaq){html += faqHTML();}
    insertBeforeFooter(html);
  }

  function ensureSticky(){
    if(document.querySelector('.site-sticky-cta')){return;}
    var holder=document.createElement('div');
    holder.innerHTML=ctaHTML();
    document.body.appendChild(holder.firstElementChild);
  }

  function initFaq(){
    var faqs=[].slice.call(document.querySelectorAll('.global-faq[data-global-faq]'));
    faqs.forEach(function(faq){
      faq.querySelectorAll('details.faq-item').forEach(function(item){
        item.addEventListener('toggle',function(){
          if(!item.open){return;}
          faq.querySelectorAll('details.faq-item').forEach(function(other){
            if(other!==item){other.open=false;}
          });
        });
      });
      faq.querySelectorAll('.faq-question').forEach(function(q){
        if(q.tagName==='SUMMARY'){return;}
        q.addEventListener('click',function(){
          var item=q.parentElement;
          var isActive=item.classList.contains('active');
          faq.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('active');});
          if(!isActive){item.classList.add('active');}
        });
      });
    });
  }

  var mapsPromise=null;
  function loadMapsApi(apiKey){
    if(window.google&&window.google.maps&&window.google.maps.places){return Promise.resolve();}
    if(mapsPromise){return mapsPromise;}
    mapsPromise=new Promise(function(resolve,reject){
      var s=document.createElement('script');
      s.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(apiKey)+'&libraries=places&v=weekly';
      s.async=true;
      s.defer=true;
      s.onload=function(){resolve();};
      s.onerror=function(){reject(new Error('maps-js-load-failed'));};
      document.head.appendChild(s);
    });
    return mapsPromise;
  }

  function initReviews(){
    var sections=[].slice.call(document.querySelectorAll('.global-reviews[data-global-reviews]'));
    if(!sections.length){return;}
    var API_KEY='AIzaSyAclF0AYVUmXZ2qmcj-MsZ4S9OwQU1_60A';
    var PLACE_QUERY='Allo Nuisible Express, 3 Rue de la Résistance, 94320 Thiais';
    var PLACE_ID='ChIJ3XNhAtsa0ikRZy7dsWlpaow';
    var MAX_REVIEWS=6;
    var cityWords=['paris','thiais','creteil','vitry','choisy','ivry','villejuif','ile-de-france','idf','94','75','92','93','91','77','78','95'];
    var pestWords=['rat','souris','cafard','blatte','punaise','frelon','guepe','guêpe','pigeon','chenille','nuisible','deratisation','dératisation','desinsectisation','désinsectisation','depigeonnage','dépigeonnage'];

    function esc(str){
      return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');
    }
    function hasWord(text, words){return words.some(function(w){return text.indexOf(w)!==-1;});}
    function pickReviews(reviews){
      var five=reviews.filter(function(r){return Number(r.rating)===5;});
      var strong=five.filter(function(r){
        var t=String(r.text||'').toLowerCase();
        return hasWord(t,cityWords)&&hasWord(t,pestWords);
      });
      var rest=five.filter(function(r){return strong.indexOf(r)===-1;});
      return strong.concat(rest).slice(0,MAX_REVIEWS);
    }

    function initSection(section, place){
      var slider=section.querySelector('[data-reviews-slider]');
      var track=section.querySelector('[data-reviews-track]');
      var prev=section.querySelector('[data-reviews-prev]');
      var next=section.querySelector('[data-reviews-next]');
      var dotsWrap=section.querySelector('[data-reviews-dots]');
      var noteNode=section.querySelector('[data-google-note]');
      var starsNode=section.querySelector('[data-google-stars]');
      var cards=[];
      var page=0;
      var pages=1;
      var perView=3;
      function perViewNow(){if(window.innerWidth<=760){return 1;}if(window.innerWidth<=1180){return 2;}return 3;}
      function renderDots(){
        dotsWrap.innerHTML='';
        for(var i=0;i<pages;i++){
          var b=document.createElement('button');
          b.type='button';
          b.className='reviews-dot'+(i===page?' active':'');
          b.setAttribute('aria-label','Aller à la page '+(i+1));
          (function(index){b.addEventListener('click',function(){page=index;update();});})(i);
          dotsWrap.appendChild(b);
        }
      }
      function update(){
        cards=[].slice.call(track.querySelectorAll('.review-card'));
        if(!cards.length){prev.disabled=true;next.disabled=true;dotsWrap.innerHTML='';return;}
        perView=perViewNow();
        slider.style.setProperty('--per-view',String(perView));
        pages=Math.max(1,Math.ceil(cards.length/perView));
        if(page>pages-1){page=pages-1;}
        var viewport=slider.clientWidth-88;
        if(window.innerWidth<=760){viewport=slider.clientWidth-64;}
        if(viewport<0){viewport=slider.clientWidth;}
        track.style.transform='translateX(-'+(page*viewport)+'px)';
        prev.disabled=page===0;
        next.disabled=page===pages-1;
        renderDots();
      }
      function bindReadMore(){
        cards.forEach(function(card){
          var text=card.querySelector('.review-text');
          var btn=card.querySelector('.review-toggle');
          if(!text||!btn){return;}
          if(text.textContent.trim().length<120){btn.style.display='none';return;}
          btn.addEventListener('click',function(){
            card.classList.toggle('expanded');
            btn.textContent=card.classList.contains('expanded')?'Réduire':'Lire la suite';
          });
        });
      }

      prev.addEventListener('click',function(){if(page>0){page--;update();}});
      next.addEventListener('click',function(){if(page<pages-1){page++;update();}});
      window.addEventListener('resize',update);
      if(noteNode&&typeof place.rating==='number'){noteNode.textContent=place.rating.toFixed(1);} 
      if(starsNode&&typeof place.rating==='number'){starsNode.textContent=place.rating>=4.8?'★★★★★':'★★★★☆';}

      var reviews=pickReviews(place.reviews||[]);
      if(!reviews.length){
        track.innerHTML='<div class="review-empty">Aucun avis 5 étoiles trouvé pour le moment.</div>';
        update();
        return;
      }
      track.innerHTML=reviews.map(function(r){
        var avatar=r.profile_photo_url
          ? '<span class="review-avatar"><img src="'+esc(r.profile_photo_url)+'" alt="'+esc(r.author_name)+'"></span>'
          : '<span class="review-avatar">'+esc((r.author_name||'A').charAt(0).toUpperCase())+'</span>';
        return ''+
        '<article class="review-card">'+
          '<div class="review-head"><div class="review-person">'+avatar+'<div><div class="review-name">'+esc(r.author_name||'Client Google')+'</div><div class="review-date">'+esc(r.relative_time_description||'')+'</div></div></div><span class="google-mark" aria-hidden="true">G</span></div>'+
          '<div class="review-stars" aria-label="'+(r.rating||5)+' étoiles">★★★★★</div>'+
          '<p class="review-text">'+esc(r.text||'')+'</p>'+
          '<button class="review-toggle" type="button">Lire la suite</button>'+
        '</article>';
      }).join('');
      page=0;
      update();
      bindReadMore();
    }

    loadMapsApi(API_KEY).then(function(){
      var service=new google.maps.places.PlacesService(document.createElement('div'));
      service.findPlaceFromQuery({query:PLACE_QUERY,fields:['place_id']},function(results,status){
        var placeId=(status===google.maps.places.PlacesServiceStatus.OK&&results&&results[0]&&results[0].place_id)?results[0].place_id:PLACE_ID;
        service.getDetails({placeId:placeId,fields:['name','rating','user_ratings_total','reviews']},function(place,status2){
          if(status2!==google.maps.places.PlacesServiceStatus.OK||!place){
            sections.forEach(function(section){
              var track=section.querySelector('[data-reviews-track]');
              if(track){track.innerHTML='<div class="review-empty">Impossible de charger automatiquement les avis Google pour le moment.</div>';} 
            });
            return;
          }
          sections.forEach(function(section){initSection(section,place);});
          if(window.__alloScrollRevealRefresh){window.__alloScrollRevealRefresh(document);} 
        });
      });
    }).catch(function(){
      sections.forEach(function(section){
        var track=section.querySelector('[data-reviews-track]');
        if(track){track.innerHTML='<div class="review-empty">Impossible de charger automatiquement les avis Google pour le moment.</div>';} 
      });
    });
  }

  function setYear(){
    var y=String(new Date().getFullYear());
    document.querySelectorAll('.js-year').forEach(function(el){el.textContent=y;});
  }

  function optimizeMedia(){
    var allImages=[].slice.call(document.querySelectorAll('img'));
    allImages.forEach(function(img,index){
      if(!img.getAttribute('decoding')){img.setAttribute('decoding','async');}
      if(!img.hasAttribute('loading')&&index>1){img.setAttribute('loading','lazy');}
      if(!img.getAttribute('referrerpolicy')){img.setAttribute('referrerpolicy','no-referrer-when-downgrade');}
      if(!img.getAttribute('width') && img.naturalWidth){img.setAttribute('width',String(img.naturalWidth));}
      if(!img.getAttribute('height') && img.naturalHeight){img.setAttribute('height',String(img.naturalHeight));}
      if((!img.getAttribute('width') || !img.getAttribute('height')) && !img.__alloSized){
        img.__alloSized=true;
        img.addEventListener('load',function(){
          if(!img.getAttribute('width') && img.naturalWidth){img.setAttribute('width',String(img.naturalWidth));}
          if(!img.getAttribute('height') && img.naturalHeight){img.setAttribute('height',String(img.naturalHeight));}
        },{once:true});
      }
    });
    var heroImage=document.querySelector('.hero img, .hero-local img');
    if(heroImage){
      heroImage.setAttribute('loading','eager');
      heroImage.setAttribute('fetchpriority','high');
      heroImage.setAttribute('decoding','sync');
    }
  }

  function optimizeForCalls(){
    var top=document.querySelector('.global-top-call');
    if(top){top.remove();}
    document.body.classList.remove('has-top-call');

    document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
      if(!a.getAttribute('aria-label')){
        a.setAttribute('aria-label','Appeler Allo Nuisible Express');
      }
      a.setAttribute('rel','nofollow');
    });
  }

  function localSeoHTML(city){
    return ''+
    '<section class="local-seo-block" data-local-seo>'+
    '<article>'+
    '<h2>Intervention urgente à '+city+'</h2>'+
    '<p>En cas d’infestation de rats ou de cafards, notre équipe assure une intervention rapide à '+city+' pour sécuriser domicile et locaux professionnels.</p>'+
    '<h2>Entreprise de dératisation à '+city+'</h2>'+
    '<p>Allo Nuisible Express réalise un traitement anti nuisibles avec extermination professionnelle, diagnostic précis et plan d’action durable.</p>'+
    '<h2>Exterminateur nuisibles Val-de-Marne</h2>'+
    '<p>Nous intervenons aussi autour de '+city+' : Orly, Choisy-le-Roi, Vitry-sur-Seine, Rungis et Chevilly-Larue, avec prise en charge urgence nuisibles domicile.</p>'+
    '<p class="nearby">Quartiers et secteurs couverts selon la demande locale, habitat collectif, pavillons, commerces et bureaux.</p>'+
    '</article>'+
    '</section>'+
    '<section class="local-seo-links" data-local-seo-links>'+
    '<h3>Voir aussi :</h3>'+
    '<ul>'+
    '<li><a href="punaises-lit-'+city.toLowerCase()+'.html">Punaises de lit à '+city+'</a></li>'+
    '<li><a href="cafards-'+city.toLowerCase()+'.html">Cafards à '+city+'</a></li>'+
    '<li><a href="deratisation-thiais.html">Dératisation à Thiais</a></li>'+
    '</ul>'+
    '</section>';
  }

  function ensureLocalSeoSections(){
    var page=currentPage();
    var isLocalPage=/-thiais\.html$/.test(page)||/-rungis\.html$/.test(page)||page==='nuisibles-rungis.html';
    if(!isLocalPage){return;}
    if(document.querySelector('[data-local-seo]')){return;}
    var city=detectCity();
    insertBeforeFooter(localSeoHTML(city));
  }

  function ensureSeoTags(){
    var head=document.head;
    if(!head){return;}

    if(!head.querySelector('meta[name="robots"]')){
      var robots=document.createElement('meta');
      robots.name='robots';
      robots.content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
      head.appendChild(robots);
    }

    if(!head.querySelector('meta[name="theme-color"]')){
      var theme=document.createElement('meta');
      theme.name='theme-color';
      theme.content='#ffae00';
      head.appendChild(theme);
    }

    var canonical=head.querySelector('link[rel="canonical"]');
    if(!canonical){
      canonical=document.createElement('link');
      canonical.rel='canonical';
      head.appendChild(canonical);
    }
    canonical.href=canonicalUrl();

    var ogUrl=head.querySelector('meta[property="og:url"]');
    if(!ogUrl){
      ogUrl=document.createElement('meta');
      ogUrl.setAttribute('property','og:url');
      head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl());
  }

  function ensureStructuredData(){
    var head=document.head;
    if(!head){return;}

    if(!head.querySelector('script[data-global-schema="local-business"]')){
      var h1Node=document.querySelector('h1');
      var serviceTitle=h1Node?h1Node.textContent.trim():'Dératisation et désinsectisation';
      var localBusiness={
        '@context':'https://schema.org',
        '@type':'PestControlService',
        name:'Allo Nuisible Express',
        url:canonicalUrl(),
        telephone:'+33744296897',
        email:'allonuisibleexpress@gmail.com',
        priceRange:'€€',
        areaServed:[detectCity()],
        address:{
          '@type':'PostalAddress',
          streetAddress:'4 Rue de la Couture du Moulin',
          postalCode:'94320',
          addressLocality:'Thiais',
          addressRegion:'Île-de-France',
          addressCountry:'FR'
        },
        openingHours:'Mo-Su 00:00-23:59',
        sameAs:[
          'https://x.com/FranceNuisible',
          'https://www.youtube.com/@AlloNuisibleExpress',
          'https://maps.app.goo.gl/EWnwrfLmvWMRjEds6'
        ],
        slogan:'Intervention anti-nuisibles rapide 24h/24 et 7j/7',
        makesOffer:{
          '@type':'Offer',
          availability:'https://schema.org/InStock',
          areaServed:'Île-de-France',
          itemOffered:{
            '@type':'Service',
            name:serviceTitle
          }
        }
      };

      var localScript=document.createElement('script');
      localScript.type='application/ld+json';
      localScript.dataset.globalSchema='local-business';
      localScript.text=JSON.stringify(localBusiness);
      head.appendChild(localScript);
    }

    var faq=document.querySelector('.faq, .global-faq');
    if(faq && !head.querySelector('script[data-global-schema="faq"]')){
      var entities=[];
      faq.querySelectorAll('.faq-item').forEach(function(item){
        var q=item.querySelector('.faq-question');
        var a=item.querySelector('.faq-answer');
        if(!q||!a){return;}
        var question=(q.textContent||'').replace(/\+/g,'').trim();
        var answer=(a.textContent||'').trim();
        if(!question||!answer){return;}
        entities.push({
          '@type':'Question',
          name:question,
          acceptedAnswer:{'@type':'Answer',text:answer}
        });
      });
      if(entities.length){
        var faqScript=document.createElement('script');
        faqScript.type='application/ld+json';
        faqScript.dataset.globalSchema='faq';
        faqScript.text=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','mainEntity':entities});
        head.appendChild(faqScript);
      }
    }
  }

  function initMobileMenu(){
    var header=document.querySelector('header');
    var nav=document.querySelector('header .main-nav');
    if(!header||!nav){return;}
    if(nav.dataset.mobileInit==='1'){return;}
    nav.dataset.mobileInit='1';

    var btn=header.querySelector('.mobile-menu-btn');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='mobile-menu-btn';
      btn.setAttribute('aria-label','Ouvrir le menu');
      btn.setAttribute('aria-expanded','false');
      btn.innerHTML='<span></span><span></span><span></span>';
      header.appendChild(btn);
    }
    if(!btn.querySelector('span')){
      btn.innerHTML='<span></span><span></span><span></span>';
    }
    if(window.innerWidth<=980){
      btn.style.display='inline-flex';
      btn.style.opacity='1';
      btn.style.visibility='visible';
      btn.style.pointerEvents='auto';
    }

    var overlay=header.querySelector('.mobile-nav-overlay');
    if(!overlay){
      overlay=document.createElement('div');
      overlay.className='mobile-nav-overlay';
      header.appendChild(overlay);
    }

    function closeMenu(){
      document.body.classList.remove('mobile-nav-open');
      btn.setAttribute('aria-expanded','false');
    }
    function openMenu(){
      document.body.classList.add('mobile-nav-open');
      btn.setAttribute('aria-expanded','true');
    }
    function toggleMenu(){
      if(document.body.classList.contains('mobile-nav-open')){closeMenu();}else{openMenu();}
    }

    var mobileList=nav.querySelector('.mobile-nav-list');
    if(!mobileList){
      mobileList=document.createElement('ul');
      mobileList.className='mobile-nav-list';
      mobileList.innerHTML=[
        '<li><a href=\"index.html\">ACCUEIL</a></li>',
        '<li><a href=\"punaises.html\">PUNAISE DE LIT</a></li>',
        '<li><a href=\"cafards.html\">CAFARDS</a></li>',
        '<li><a href=\"acariens.html\">ACARIENS</a></li>',
        '<li><a href=\"xylophage.html\">XYLOPHAGE (INSECTES DU BOIS)</a></li>',
        '<li><a href=\"mouches.html\">MOUCHES</a></li>',
        '<li><a href=\"fourmis.html\">FOURMIS</a></li>',
        '<li><a href=\"deratisation.html\">DÉRATISATION (RATS / SOURIS)</a></li>',
        '<li><a href=\"depigeonnage.html\">DÉPIGEONNAGE</a></li>',
        '<li><a href=\"frelons.html\">FRELON</a></li>',
        '<li><a href=\"diogene.html\">SYNDROME DIOGÈNE</a></li>',
        '<li><a href=\"chenilles.html\">CHENILLE PROCESSIONNAIRE</a></li>',
        '<li><a href=\"guepes.html\">GUÊPE</a></li>',
        '<li><a href=\"contact.html\">CONTACTEZ-NOUS</a></li>',
        '<li><a href=\"tarifs.html\">TARIFS</a></li>',
        '<li><a href=\"blog.html\">BLOG</a></li>'
      ].join('');
      nav.appendChild(mobileList);
    }

    function onBtnClick(ev){
      if(window.innerWidth>980){return;}
      ev.preventDefault();
      toggleMenu();
    }
    if(!btn.dataset.menuBound){
      btn.dataset.menuBound='1';
      btn.addEventListener('click',onBtnClick);
    }

    overlay.addEventListener('click',closeMenu);

    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        if(window.innerWidth>980){return;}
        if(link.classList.contains('dropdown-toggle')){return;}
        closeMenu();
      });
    });

    document.addEventListener('keydown',function(ev){
      if(ev.key==='Escape'){closeMenu();}
    });

    window.addEventListener('resize',function(){
      if(window.innerWidth>980){
        closeMenu();
      }
    });
  }

  function mobileMenuListHTML(){
    return [
      '<li><a href="index.html">ACCUEIL</a></li>',
      '<li><a href="punaises.html">PUNAISE DE LIT</a></li>',
      '<li><a href="cafards.html">CAFARDS</a></li>',
      '<li><a href="acariens.html">ACARIENS</a></li>',
      '<li><a href="xylophage.html">XYLOPHAGE (INSECTES DU BOIS)</a></li>',
      '<li><a href="mouches.html">MOUCHES</a></li>',
      '<li><a href="fourmis.html">FOURMIS</a></li>',
      '<li><a href="deratisation.html">DÉRATISATION (RATS / SOURIS)</a></li>',
      '<li><a href="depigeonnage.html">DÉPIGEONNAGE</a></li>',
      '<li><a href="frelons.html">FRELON</a></li>',
      '<li><a href="diogene.html">SYNDROME DIOGÈNE</a></li>',
      '<li><a href="chenilles.html">CHENILLE PROCESSIONNAIRE</a></li>',
      '<li><a href="guepes.html">GUÊPE</a></li>',
      '<li><a href="contact.html">CONTACTEZ-NOUS</a></li>',
      '<li><a href="tarifs.html">TARIFS</a></li>',
      '<li><a href="blog.html">BLOG</a></li>'
    ].join('');
  }

  function ensureMobileMenuFallback(){
    var header=document.querySelector('header');
    var nav=document.querySelector('header .main-nav');
    if(!header||!nav){return;}

    var btn=header.querySelector('.mobile-menu-btn');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='mobile-menu-btn';
      btn.setAttribute('aria-label','Ouvrir le menu');
      btn.setAttribute('aria-expanded','false');
      btn.innerHTML='<span></span><span></span><span></span>';
      header.appendChild(btn);
    }

    var overlay=header.querySelector('.mobile-nav-overlay');
    if(!overlay){
      overlay=document.createElement('div');
      overlay.className='mobile-nav-overlay';
      overlay.setAttribute('aria-hidden','true');
      header.appendChild(overlay);
    }

    if(window.innerWidth<=980){
      btn.style.display='inline-flex';
      btn.style.position='absolute';
      btn.style.right='8px';
      btn.style.top='50%';
      btn.style.transform='translateY(-50%)';
      btn.style.zIndex='10060';
      btn.style.pointerEvents='auto';
      btn.style.visibility='visible';
      btn.style.opacity='1';
      btn.style.background='transparent';
      btn.style.border='0';
      btn.style.width='54px';
      btn.style.height='54px';
      btn.style.alignItems='center';
      btn.style.justifyContent='center';
      btn.style.flexDirection='column';
      btn.style.color='#d58f00';
      if(!btn.querySelector('span')){btn.innerHTML='<span></span><span></span><span></span>';}
      [].slice.call(btn.querySelectorAll('span')).forEach(function(s){
        s.style.display='block';
        s.style.width='26px';
        s.style.height='3px';
        s.style.margin='3px 0';
        s.style.background='currentColor';
        s.style.borderRadius='10px';
      });
    }

    var mobileList=nav.querySelector('.mobile-nav-list');
    if(!mobileList){
      mobileList=document.createElement('ul');
      mobileList.className='mobile-nav-list';
      mobileList.innerHTML=mobileMenuListHTML();
      nav.appendChild(mobileList);
    }

    if(!btn.dataset.menuFallbackBound){
      btn.dataset.menuFallbackBound='1';
      btn.addEventListener('click',function(ev){
        if(window.innerWidth>980){return;}
        ev.preventDefault();
        var isOpen=document.body.classList.contains('mobile-nav-open');
        document.body.classList.toggle('mobile-nav-open',!isOpen);
        btn.setAttribute('aria-expanded', isOpen?'false':'true');
      });
    }

    if(!overlay.dataset.menuFallbackBound){
      overlay.dataset.menuFallbackBound='1';
      overlay.addEventListener('click',function(){
        document.body.classList.remove('mobile-nav-open');
        btn.setAttribute('aria-expanded','false');
      });
    }

    if(!document.body.dataset.mobileMenuDocBound){
      document.body.dataset.mobileMenuDocBound='1';
      document.addEventListener('click',function(ev){
        var target=ev.target;
        if(!target){return;}
        var trigger=target.closest ? target.closest('.mobile-menu-btn') : null;
        if(trigger){
          if(window.innerWidth>980){return;}
          ev.preventDefault();
          var open=document.body.classList.contains('mobile-nav-open');
          document.body.classList.toggle('mobile-nav-open', !open);
          trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
          return;
        }
        if(window.innerWidth<=980 && document.body.classList.contains('mobile-nav-open')){
          var inMenu=target.closest ? target.closest('header .main-nav') : null;
          var inOverlay=target.closest ? target.closest('.mobile-nav-overlay') : null;
          if(inOverlay || (!inMenu && !target.closest('.mobile-menu-btn'))){
            document.body.classList.remove('mobile-nav-open');
            var openBtn=document.querySelector('header .mobile-menu-btn');
            if(openBtn){openBtn.setAttribute('aria-expanded','false');}
          }
        }
      }, true);
    }
  }

  function timedCallModalHTML(){
    return ''+
    '<div class="timed-call-overlay" data-timed-call-overlay aria-hidden="true">'+
    '  <div class="timed-call-modal" role="dialog" aria-modal="true" aria-labelledby="timed-call-title">'+
    '    <button class="timed-call-close" type="button" aria-label="Fermer">×</button>'+
    '    <div class="timed-call-badge"><img class="timed-call-logo" src="logo.png" alt="Allo Nuisible Express"></div>'+
    '    <h3 id="timed-call-title">Présence de nuisibles ? Appelez avant que la situation s\\'aggrave.</h3>'+
    '    <p>Résultats rapides et traitement sécurisé pour vous et votre entourage, partout en Île-de-France. Devis gratuit 24h/24 et 7j/7.</p>'+
    '    <a class="timed-call-action" href="tel:0744296897" aria-label="Appeler le 07 44 29 68 97">📞 07 44 29 68 97</a>'+
    '  </div>'+
    '</div>';
  }

  function initTimedCallModal(){
    if(!isHomePage()){return;}
    var overlay=document.querySelector('[data-timed-call-overlay]');
    if(!overlay){
      var host=document.createElement('div');
      host.innerHTML=timedCallModalHTML();
      overlay=host.firstElementChild;
      if(!overlay){return;}
      document.body.appendChild(overlay);
    }

    var modal=overlay.querySelector('.timed-call-modal');
    var closeBtn=overlay.querySelector('.timed-call-close');
    var phoneBtn=overlay.querySelector('.timed-call-action');
    var timerId=null;

    function closeModal(){
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden','true');
      document.body.classList.remove('timed-call-open');
      if(timerId){window.clearTimeout(timerId);timerId=null;}
    }

    function openModal(){
      if(document.body.classList.contains('mobile-nav-open')){
        document.body.classList.remove('mobile-nav-open');
        var mobileBtn=document.querySelector('header .mobile-menu-btn');
        if(mobileBtn){mobileBtn.setAttribute('aria-expanded','false');}
      }
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden','false');
      document.body.classList.add('timed-call-open');
      // Hard force in case stale CSS from browser cache.
      overlay.style.setProperty('opacity','1','important');
      overlay.style.setProperty('visibility','visible','important');
      overlay.style.setProperty('pointer-events','auto','important');
      overlay.style.setProperty('display','flex','important');
      overlay.style.setProperty('z-index','20000','important');
    }

    if(closeBtn && !closeBtn.dataset.modalBound){
      closeBtn.dataset.modalBound='1';
      closeBtn.addEventListener('click',closeModal);
    }
    if(!overlay.dataset.modalBackdropBound){
      overlay.dataset.modalBackdropBound='1';
      overlay.addEventListener('click',function(ev){
        if(ev.target===overlay){closeModal();}
      });
    }
    if(!document.body.dataset.modalEscBound){
      document.body.dataset.modalEscBound='1';
      document.addEventListener('keydown',function(ev){
        if(ev.key==='Escape' && overlay.classList.contains('is-open')){closeModal();}
      });
    }
    if(phoneBtn && !phoneBtn.dataset.modalBound){
      phoneBtn.dataset.modalBound='1';
      phoneBtn.addEventListener('click',function(){ closeModal(); });
    }

    timerId=window.setTimeout(openModal,10000);

    // Retry open if still not visible due race conditions/cached CSS.
    window.setTimeout(function(){
      if(!overlay.classList.contains('is-open') || overlay.getAttribute('aria-hidden')!=='false'){
        openModal();
      }
    },12000);
    window.setTimeout(function(){
      if(!overlay.classList.contains('is-open') || overlay.getAttribute('aria-hidden')!=='false'){
        openModal();
      }
    },18000);

    if(!window.__alloModalPageshowBound){
      window.__alloModalPageshowBound=true;
      window.addEventListener('pageshow',function(){
        if(!isHomePage()){return;}
        window.setTimeout(function(){
          if(!overlay.classList.contains('is-open')){openModal();}
        },10000);
      });
    }
  }

  function safeRun(fn,label){
    try{
      fn();
    }catch(err){
      console.warn((label||'module')+' failed:', err);
    }
  }

  function boot(){
    safeRun(ensureSeoTags,'ensureSeoTags');
    safeRun(ensureHomeUrgencyStrip,'ensureHomeUrgencyStrip');
    safeRun(ensureFooter,'ensureFooter');
    safeRun(ensureProcess,'ensureProcess');
    safeRun(ensureReviewsFaq,'ensureReviewsFaq');
    safeRun(ensureLocalSeoSections,'ensureLocalSeoSections');
    safeRun(ensureSticky,'ensureSticky');
    safeRun(optimizeForCalls,'optimizeForCalls');
    safeRun(initFaq,'initFaq');
    safeRun(initMobileMenu,'initMobileMenu');
    safeRun(ensureMobileMenuFallback,'ensureMobileMenuFallback');
    safeRun(initReviews,'initReviews');
    safeRun(initTimedCallModal,'initTimedCallModal');
    safeRun(optimizeMedia,'optimizeMedia');
    safeRun(ensureStructuredData,'ensureStructuredData');
    safeRun(setYear,'setYear');
    if(window.__alloScrollRevealRefresh){safeRun(function(){window.__alloScrollRevealRefresh(document);},'scrollRevealRefresh');}
  }

  enforcePrimaryDomain();

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();
