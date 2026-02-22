(function(){
  function currentPage(){
    var p=(window.location.pathname||'').split('/').pop();
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
    '    <section><h3>Nos services</h3><ul class="footer-services"><li><a href="deratisation.html">Dératisation</a></li><li><a href="punaises.html">Punaises de lit</a></li><li><a href="desinsectisation.html">Désinsectisation</a></li><li><a href="desinfection.html">Désinfection</a></li><li><a href="cafards.html">Cafards</a></li><li><a href="depigeonnage.html">Dépigeonnage</a></li><li><a href="frelons.html">Frelons / Guêpes</a></li><li><a href="diogene.html">Syndrome de Diogène</a></li></ul></section>'+ 
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
    '    <span class="sticky-default">APPELER MAINTENANT</span><span class="sticky-hover-number">07 44 29 68 97</span>'+ 
    '  </a>'+ 
    '</div>';
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
    '<p class="faq-intro">Retrouvez ici les réponses aux questions les plus posées sur nos prestations. Cliquez sur une question pour afficher le détail.</p>'+ 
    '<div class="faq-item"><div class="faq-question">Quels services proposez-vous exactement ? <span class="faq-icon">+</span></div><div class="faq-answer">(FAQ) Nous proposons une prise en charge complète de la lutte anti-nuisibles pour les particuliers comme pour les professionnels : dératisation, désinsectisation, désinfection, dépigeonnage, traitement des punaises, cafards, frelons, guêpes, chenilles processionnaires et interventions Diogène.</div></div>'+ 
    '<div class="faq-item"><div class="faq-question">Quels sont vos prix de départ ? <span class="faq-icon">+</span></div><div class="faq-answer">(FAQ) Nos prix de départ sont les suivants : guêpes/frelons 120 EUR, dératisation 200 EUR, dépigeonnage 150 EUR, punaises de lit 200 EUR, cafards 200 EUR, chenilles 120 EUR, syndrome de Diogène 500 EUR. Vous bénéficiez d\'une garantie de 1 mois avec suivi.</div></div>'+ 
    '<div class="faq-item"><div class="faq-question">Dans quelles zones intervenez-vous ? <span class="faq-icon">+</span></div><div class="faq-answer">(FAQ) Nous intervenons dans toute l\'Île-de-France : 75, 77, 78, 91, 92, 93, 94 et 95, avec des créneaux rapides pour les particuliers et professionnels.</div></div>'+ 
    '<div class="faq-item"><div class="faq-question">En combien de temps pouvez-vous intervenir ? <span class="faq-icon">+</span></div><div class="faq-answer">(FAQ) Nous intervenons en urgence 24h/24 et 7j/7, y compris la nuit, les week-ends et les jours fériés.</div></div>'+ 
    '<div class="faq-item"><div class="faq-question">Quels nuisibles traitez-vous ? <span class="faq-icon">+</span></div><div class="faq-answer">(FAQ) Nous traitons rats, souris, cafards, punaises de lit, guêpes, frelons, pigeons, chenilles processionnaires et autres nuisibles selon la situation terrain.</div></div>'+ 
    '<div class="faq-item"><div class="faq-question">Comment se déroule une intervention ? <span class="faq-icon">+</span></div><div class="faq-answer">(FAQ) L\'intervention suit un parcours clair : diagnostic, inspection, traitement ciblé, puis suivi avec recommandations de prévention.</div></div>'+ 
    '<div class="faq-item"><div class="faq-question">Y a-t-il une garantie après traitement ? <span class="faq-icon">+</span></div><div class="faq-answer">(FAQ) Oui, vous bénéficiez d\'une garantie de 1 mois avec suivi sur nos protocoles d\'intervention.</div></div>'+ 
    '<div class="faq-item"><div class="faq-question">Comment vous contacter pour un devis ? <span class="faq-icon">+</span></div><div class="faq-answer">(FAQ) Par formulaire en ligne, téléphone au 07 44 29 68 97, WhatsApp, e-mail et réseaux sociaux.</div></div>'+ 
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
      faq.querySelectorAll('.faq-question').forEach(function(q){
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
    });
    var heroImage=document.querySelector('.hero img, .hero-local img');
    if(heroImage){
      heroImage.setAttribute('loading','eager');
      heroImage.setAttribute('fetchpriority','high');
      heroImage.setAttribute('decoding','sync');
    }
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

    if(!head.querySelector('link[rel="canonical"]')){
      var canonical=document.createElement('link');
      canonical.rel='canonical';
      var origin=window.location.origin||'https://allonuisibleexpress.github.io';
      canonical.href=origin+window.location.pathname;
      head.appendChild(canonical);
    }
  }

  function ensureStructuredData(){
    var head=document.head;
    if(!head){return;}

    if(!head.querySelector('script[data-global-schema="local-business"]')){
      var h1Node=document.querySelector('h1');
      var serviceTitle=h1Node?h1Node.textContent.trim():'Dératisation et désinsectisation';
      var localBusiness={
        '@context':'https://schema.org',
        '@type':['LocalBusiness','ProfessionalService'],
        name:'Allo Nuisible Express',
        url:(window.location.origin||'https://allonuisibleexpress.github.io')+window.location.pathname,
        telephone:'+33744296897',
        email:'allonuisibleexpress@gmail.com',
        areaServed:[
          'Val-de-Marne',
          'Thiais',
          'Rungis',
          'Île-de-France',
          'Paris'
        ],
        address:{
          '@type':'PostalAddress',
          streetAddress:'4 Rue de la Couture du Moulin',
          postalCode:'94320',
          addressLocality:'Thiais',
          addressCountry:'FR'
        },
        openingHoursSpecification:[{
          '@type':'OpeningHoursSpecification',
          dayOfWeek:[
            'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
          ],
          opens:'00:00',
          closes:'23:59'
        }],
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
    var dropdown=document.querySelector('header .main-nav .dropdown');
    var toggle=dropdown?dropdown.querySelector('.dropdown-toggle'):null;
    if(!dropdown||!toggle){return;}

    toggle.addEventListener('click',function(ev){
      if(window.innerWidth>980){return;}
      ev.preventDefault();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click',function(ev){
      if(window.innerWidth>980){return;}
      if(!dropdown.contains(ev.target)){dropdown.classList.remove('open');}
    });

    window.addEventListener('resize',function(){
      if(window.innerWidth>980){dropdown.classList.remove('open');}
    });
  }

  function boot(){
    ensureSeoTags();
    ensureFooter();
    ensureProcess();
    ensureReviewsFaq();
    ensureSticky();
    initFaq();
    initReviews();
    initMobileMenu();
    optimizeMedia();
    ensureStructuredData();
    setYear();
    if(window.__alloScrollRevealRefresh){window.__alloScrollRevealRefresh(document);} 
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();
