(function(){
  var PREFERRED_ORIGIN='https://allonuisibleexpress.fr';
  var PROJECT_PATH_PREFIX='/allo-nuisible-express';
  var LOCAL_SERVICE_PATTERN='(?:deratisation|rats|cafards|punaises-de-lit|souris|guepes|frelons|frelon-asiatique|depigeonnage|chenille-processionnaire|acariens|xylophages|mouches|fourmis)';
  var CITY_HERO_META={
    'antony':{'city':'Antony','landmark':'Hôtel de ville'},
    'arcueil':{'city':'Arcueil','landmark':'Panorama urbain'},
    'cachan':{'city':'Cachan','landmark':'Mairie'},
    'chatenay-malabry':{'city':'Châtenay-Malabry','landmark':'Centre-ville'},
    'chevilly-larue':{'city':'Chevilly-Larue','landmark':'Mairie'},
    'choisy-le-roi':{'city':'Choisy-le-Roi','landmark':'Centre-ville'},
    'clamart':{'city':'Clamart','landmark':'Mairie'},
    'fresnes':{'city':'Fresnes','landmark':'Panorama local'},
    'gentilly':{'city':'Gentilly','landmark':'Centre-ville'},
    'le-kremlin-bicetre':{'city':'Le Kremlin-Bicêtre','landmark':'Mairie'},
    'lhay-les-roses':{'city':'L\\'Haÿ-les-Roses','landmark':'Parc de la Roseraie'},
    'orly':{'city':'Orly','landmark':'Centre-ville'},
    'rungis':{'city':'Rungis','landmark':'Marché international'},
    'thiais':{'city':'Thiais','landmark':'Centre-ville'},
    'versailles':{'city':'Versailles','landmark':'Château de Versailles'},
    'villejuif':{'city':'Villejuif','landmark':'Centre-ville'},
    'vitry-sur-seine':{'city':'Vitry-sur-Seine','landmark':'Panorama urbain'}
  };

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

  function upsertMeta(name, content){
    var node=document.querySelector('meta[name="'+name+'"]');
    if(!node){
      node=document.createElement('meta');
      node.setAttribute('name', name);
      document.head.appendChild(node);
    }
    node.setAttribute('content', content);
  }

  function upsertCanonical(href){
    var node=document.querySelector('link[rel="canonical"]');
    if(!node){
      node=document.createElement('link');
      node.setAttribute('rel', 'canonical');
      document.head.appendChild(node);
    }
    node.setAttribute('href', href);
  }

  function hardenGithubMirror(){
    var host=(window.location.hostname||'').toLowerCase();
    if(host.indexOf('github.io')===-1){
      return;
    }
    upsertMeta('robots','noindex, nofollow');
    upsertMeta('googlebot','noindex, nofollow');
    upsertCanonical(canonicalUrl());
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

  function isSeoLocalPage(){
    var path=normalizedPathname().toLowerCase();
    return /\/(?:deratisation|rats|cafards|punaises-de-lit|souris|frelons|guepes)-[^/]+\/?$/.test(path);
  }

  function isLocalServicePage(){
    var path=normalizedPathname().toLowerCase();
    var re=new RegExp('/'+LOCAL_SERVICE_PATTERN+'-[^/]+(?:/|\\\\.html)?$');
    return re.test(path);
  }

  function detectLocalCitySlug(){
    var path=normalizedPathname().toLowerCase();
    var re=new RegExp('/'+LOCAL_SERVICE_PATTERN+'-([^/.]+)(?:/|\\\\.html)?$');
    var m=path.match(re);
    return m&&m[1] ? m[1] : '';
  }

  function detectLocalServiceSlug(){
    var path=normalizedPathname().toLowerCase();
    var re=new RegExp('/('+LOCAL_SERVICE_PATTERN+')-[^/.]+(?:/|\\.html)?$');
    var m=path.match(re);
    return m&&m[1] ? m[1] : '';
  }

  function humanizeCitySlug(slug){
    var meta=CITY_HERO_META[slug];
    if(meta&&meta.city){return meta.city;}
    return String(slug||'').split('-').map(function(part){
      return part ? (part.charAt(0).toUpperCase()+part.slice(1)) : '';
    }).join(' ');
  }

  function cityPreposition(city){
    var c=String(city||'');
    if(/^Le\s/i.test(c)){return 'au '+c.replace(/^Le\s/i,'');}
    if(/^Les\s/i.test(c)){return 'aux '+c.replace(/^Les\s/i,'');}
    return 'à '+c;
  }

  function contextArticle(context){
    var c=String(context||'').toLowerCase();
    if(c==='jardin' || c==='vide-sanitaire'){return 'un';}
    return 'une';
  }

  function ensureCityHeroStyles(){
    if(document.getElementById('city-hero-style')){return;}
    var style=document.createElement('style');
    style.id='city-hero-style';
    style.textContent='' +
      '.city-hero-ready{position:relative;overflow:hidden;isolation:isolate;background:none !important;background-image:none !important}' +
      '.city-hero-ready picture[data-city-hero]{position:absolute;inset:0;z-index:0;display:block}' +
      '.city-hero-ready picture[data-city-hero] img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.city-hero-ready .city-hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(12,12,12,.62),rgba(22,22,22,.52));z-index:1;pointer-events:none}' +
      '.city-hero-ready > :not(picture):not(.city-hero-overlay){position:relative;z-index:2}' +
      '.city-hero-credit{font-size:12px;line-height:1.4;color:#6a6a6a;margin:8px 0 0;text-align:right}' +
      '.city-hero-credit a{color:#7a5400;text-decoration:none}';
    document.head.appendChild(style);
  }

  function ensureCityHeroMedia(){
    if(!isLocalServicePage()){return;}
    var slug=detectLocalCitySlug();
    if(!slug){return;}
    var hero=document.querySelector('main .seo-hero, .hero-local-seo, .hero-local');
    var main=document.querySelector('main');
    if(!hero && main){
      var h1=document.querySelector('h1');
      var p=document.querySelector('meta[name=\"description\"]');
      hero=document.createElement('section');
      hero.className='hero-local city-hero-fallback';
      hero.innerHTML='<h1>'+(h1?h1.textContent.trim():'Intervention locale')+'</h1><p>'+(p?p.getAttribute('content'):'Intervention locale rapide')+'</p>';
      main.insertBefore(hero, main.firstChild);
    }
    if(!hero){return;}

    ensureCityHeroStyles();
    hero.classList.add('city-hero-ready');
    hero.style.background='none';
    hero.style.backgroundImage='none';
    hero.style.setProperty('--hero','none');

    var serviceSlug=detectLocalServiceSlug();
    var meta=CITY_HERO_META[slug]||{};
    var city=meta.city||humanizeCitySlug(slug);
    var landmark=meta.landmark||'Centre-ville';
    var cityPostalMap={
      'antony':'92160','arcueil':'94110','cachan':'94230','chatenay-malabry':'92290','chevilly-larue':'94550','choisy-le-roi':'94600',
      'clamart':'92140','fresnes':'94260','gentilly':'94250','le-kremlin-bicetre':'94270','lhay-les-roses':'94240','orly':'94310',
      'rungis':'94150','thiais':'94320','versailles':'78000','villejuif':'94800','vitry-sur-seine':'94400'
    };
    var serviceLabelMap={
      'deratisation':'rongeurs','rats':'rats','cafards':'cafards','punaises-de-lit':'punaises de lit','souris':'souris',
      'guepes':'guêpes','frelons':'frelons','frelon-asiatique':'frelon asiatique','depigeonnage':'pigeons',
      'chenille-processionnaire':'chenilles processionnaires','acariens':'acariens','xylophages':'xylophages','mouches':'mouches','fourmis':'fourmis'
    };
    var contextMap={
      'deratisation':'cave','rats':'cave','cafards':'cuisine','punaises-de-lit':'chambre','souris':'vide-sanitaire',
      'guepes':'toiture','frelons':'jardin','frelon-asiatique':'jardin','depigeonnage':'toiture',
      'chenille-processionnaire':'jardin','acariens':'chambre','xylophages':'charpente','mouches':'cuisine','fourmis':'terrasse'
    };
    var postal=cityPostalMap[slug]||'';
    var label=serviceLabelMap[serviceSlug]||'nuisibles';
    var context=contextMap[serviceSlug]||'zone traitée';
    var alt='Infestation de '+label+' dans '+contextArticle(context)+' '+context+' '+cityPreposition(city)+(postal?(' ('+postal+')'):'');
    var base='/assets/local-hero/'+(serviceSlug||'local')+'-'+slug+'-'+context;

    var picture=hero.querySelector('picture[data-city-hero]');
    if(!picture){
      picture=document.createElement('picture');
      picture.setAttribute('data-city-hero','');
      picture.innerHTML='' +
        '<source type=\"image/webp\" srcset=\"'+base+'.webp\">' +
        '<source type=\"image/jpeg\" srcset=\"'+base+'.jpg\">' +
        '<img src=\"'+base+'.jpg\" width=\"1600\" height=\"900\" alt=\"'+alt+'\" loading=\"eager\" fetchpriority=\"high\" decoding=\"async\">';
      hero.insertBefore(picture, hero.firstChild);
    }else{
      var img=picture.querySelector('img');
      if(img){
        img.setAttribute('src',base+'.jpg');
        img.setAttribute('alt',alt);
      }
      var webpSource=picture.querySelector('source[type=\"image/webp\"]');
      if(webpSource){webpSource.setAttribute('srcset',base+'.webp');}
      var jpgSource=picture.querySelector('source[type=\"image/jpeg\"]');
      if(jpgSource){jpgSource.setAttribute('srcset',base+'.jpg');}
    }
    var overlay=hero.querySelector('.city-hero-overlay');
    if(!overlay){
      overlay=document.createElement('span');
      overlay.className='city-hero-overlay';
      hero.insertBefore(overlay, picture.nextSibling);
    }

    var footer=document.querySelector('footer');
    if(footer && !footer.querySelector('[data-city-hero-credit]')){
      var credit=document.createElement('p');
      credit.className='city-hero-credit';
      credit.setAttribute('data-city-hero-credit','');
      credit.innerHTML='Crédit photo '+city+' : <a href=\"/assets/cities/credits.json\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons (licences ouvertes)</a>.';
      footer.appendChild(credit);
    }
  }

  function slugify(text){
    return String(text||'')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'')
      .replace(/-{2,}/g,'-');
  }

  function ensureSeoSummary(){
    if(!isSeoLocalPage()){return;}
    if(document.querySelector('[data-seo-summary]')){return;}

    var main=document.querySelector('main');
    if(!main){return;}
    var scope=main.querySelector('article')||main;
    var headings=[].slice.call(scope.querySelectorAll('h2')).filter(function(h){
      return h && h.textContent && h.textContent.trim() && !h.closest('[data-seo-summary]');
    });
    if(headings.length<3){return;}

    var maxItems=12;
    var used={};
    var items=headings.slice(0,maxItems).map(function(h,idx){
      if(!h.id){
        var base=slugify(h.textContent)||('section-'+(idx+1));
        var candidate=base;
        var step=2;
        while(document.getElementById(candidate) || used[candidate]){
          candidate=base+'-'+step;
          step+=1;
        }
        h.id=candidate;
        used[candidate]=true;
      }
      return '<li><a href="#'+h.id+'">'+h.textContent.trim()+'</a></li>';
    }).join('');

    var summary=document.createElement('section');
    summary.className='seo-summary-block';
    summary.setAttribute('data-seo-summary','');
    summary.innerHTML='' +
      '<div class="seo-summary-head">' +
      '<h2>Sommaire</h2>' +
      '<p>Accédez en un clic aux blocs clés de la prise en charge.</p>' +
      '</div>' +
      '<ol class="seo-summary-list">'+items+'</ol>';

    var hero=scope.querySelector('.hero-local-seo.seo-hero, .hero-local.seo-hero, .seo-hero');
    if(hero && hero.parentNode===scope){
      if(hero.nextSibling){
        scope.insertBefore(summary, hero.nextSibling);
      }else{
        scope.appendChild(summary);
      }
    }else{
      var firstChild=scope.firstElementChild;
      if(firstChild){
        scope.insertBefore(summary, firstChild);
      }else{
        scope.appendChild(summary);
      }
    }
  }

  function enhanceMiniLocalFaq(){
    if(!isSeoLocalPage()){return;}

    var sections=[].slice.call(document.querySelectorAll('main section')).filter(function(section){
      var h2=section.querySelector('h2');
      if(!h2){return false;}
      return /mini faq locale/i.test((h2.textContent||'').trim());
    });

    sections.forEach(function(section){
      if(section.dataset.miniFaqEnhanced==='1'){return;}
      var h2=section.querySelector('h2');
      if(!h2){return;}

      var title=(h2.textContent||'').trim();
      var city=title.replace(/mini faq locale\s*/i,'').trim();
      h2.textContent='Questions fréquentes'+(city?(' à '+city):'');
      var nodes=[].slice.call(section.children);
      var startIndex=nodes.indexOf(h2);
      if(startIndex===-1){return;}

      var faqNodes=nodes.slice(startIndex+1);
      var items=[];
      var i=0;
      while(i<faqNodes.length){
        var node=faqNodes[i];
        if(node.tagName==='H3'){
          var item={
            q:(node.textContent||'').trim(),
            answers:[]
          };
          i+=1;
          while(i<faqNodes.length && faqNodes[i].tagName!=='H3'){
            if(faqNodes[i].tagName==='P'){
              item.answers.push(faqNodes[i]);
            }
            i+=1;
          }
          if(item.q){items.push(item);}
          continue;
        }
        i+=1;
      }
      if(!items.length){return;}

      section.classList.add('mini-faq-local');
      section.dataset.miniFaqEnhanced='1';
      section.innerHTML='';

      var head=document.createElement('div');
      head.className='mini-faq-local-head';
      head.appendChild(h2);
      if(city){
        var chip=document.createElement('span');
        chip.className='mini-faq-local-chip';
        chip.textContent=city;
        head.appendChild(chip);
      }
      section.appendChild(head);

      var list=document.createElement('div');
      list.className='mini-faq-local-list';
      items.forEach(function(item,idx){
        var details=document.createElement('details');
        details.className='mini-faq-item';
        if(idx===0){details.open=true;}

        var summary=document.createElement('summary');
        summary.className='mini-faq-question';
        summary.innerHTML='' +
          '<span class="mini-faq-index">'+String(idx+1)+'</span>' +
          '<span class="mini-faq-label">'+item.q+'</span>' +
          '<span class="mini-faq-toggle">+</span>';
        details.appendChild(summary);

        var answer=document.createElement('div');
        answer.className='mini-faq-answer';
        if(item.answers.length){
          item.answers.forEach(function(p){answer.appendChild(p);});
        }else{
          var fallback=document.createElement('p');
          fallback.textContent='Réponse disponible lors du diagnostic local.';
          answer.appendChild(fallback);
        }
        details.appendChild(answer);
        list.appendChild(details);
      });
      section.appendChild(list);

      list.querySelectorAll('.mini-faq-item').forEach(function(item){
        item.addEventListener('toggle',function(){
          if(!item.open){return;}
          list.querySelectorAll('.mini-faq-item').forEach(function(other){
            if(other!==item){other.open=false;}
          });
        });
      });
    });
  }

  function detectLocalCityFromH1(){
    var h1=document.querySelector('h1');
    if(h1){
      var txt=(h1.textContent||'').trim();
      var m=txt.match(/(?:à|au)\s+(.+?)(?:\s*\(\d{5}\)|\s*:|$)/i);
      if(m&&m[1]){return m[1].trim();}
    }
    var path=(window.location.pathname||'').toLowerCase();
    var mm=path.match(/\/(?:deratisation|rats|cafards|punaises-de-lit|souris|frelons|guepes)-([^/]+)\/?$/);
    if(!mm||!mm[1]){return '';}
    var slug=mm[1];
    var map={
      'thiais':'Thiais',
      'rungis':'Rungis',
      'orly':'Orly',
      'choisy-le-roi':'Choisy-le-Roi',
      'chevilly-larue':'Chevilly-Larue',
      'villejuif':'Villejuif',
      'vitry-sur-seine':'Vitry-sur-Seine',
      'cachan':'Cachan',
      'fresnes':'Fresnes',
      'lhay-les-roses':"L'Haÿ-les-Roses",
      'le-kremlin-bicetre':'Le Kremlin-Bicêtre',
      'arcueil':'Arcueil',
      'gentilly':'Gentilly'
    };
    return map[slug]||slug.replace(/-/g,' ');
  }

  function localHeroImageByCity(city){
    var key=String(city||'').toLowerCase();
    var map={
      'thiais':'https://upload.wikimedia.org/wikipedia/commons/1/1c/Centre_Commercial_Belle_%C3%89pine_-_Thiais_%28FR94%29_-_2021-12-31_-_2.jpg',
      'rungis':'https://upload.wikimedia.org/wikipedia/commons/c/ca/Rungis_March%C3%A9_International.jpg',
      'orly':'https://upload.wikimedia.org/wikipedia/commons/4/4f/Orly_Airport_2021.jpg',
      'choisy-le-roi':'https://upload.wikimedia.org/wikipedia/commons/1/1f/Choisy-le-Roi_Hotel_de_Ville.jpg',
      'chevilly-larue':'https://upload.wikimedia.org/wikipedia/commons/0/09/Hotel_de_ville_Chevilly-Larue.jpg',
      'villejuif':'https://upload.wikimedia.org/wikipedia/commons/8/82/Mairie_Villejuif_9.jpg',
      'vitry-sur-seine':'https://upload.wikimedia.org/wikipedia/commons/e/e6/Mairie_de_Vitry-sur-Seine.jpg',
      'cachan':'https://upload.wikimedia.org/wikipedia/commons/1/14/France_Mairie_de_Cachan.1.JPG',
      'fresnes':'https://upload.wikimedia.org/wikipedia/commons/d/d3/H%C3%B4tel_ville_Fresnes_Val_Marne_7.jpg',
      "l'haÿ-les-roses":'https://upload.wikimedia.org/wikipedia/commons/b/be/H%C3%B4tel_Ville_-_L%27Ha%C3%BF-les-Roses_%28FR94%29_-_2022-05-20_-_1.jpg',
      'lhay-les-roses':'https://upload.wikimedia.org/wikipedia/commons/b/be/H%C3%B4tel_Ville_-_L%27Ha%C3%BF-les-Roses_%28FR94%29_-_2022-05-20_-_1.jpg',
      'arcueil':'https://upload.wikimedia.org/wikipedia/commons/4/4b/Arcueil_%2894%29_Rue_Emile-Raspail_406.jpg',
      'gentilly':'https://upload.wikimedia.org/wikipedia/commons/0/0b/Gentilly_%2894%29_Mairie_293.jpg',
      'le kremlin-bicêtre':'https://upload.wikimedia.org/wikipedia/commons/1/1b/Le_Kremlin-Bic%C3%AAtre_%2894%29_Rue_Rossel_314.jpg',
      'le kremlin-bicetre':'https://upload.wikimedia.org/wikipedia/commons/1/1b/Le_Kremlin-Bic%C3%AAtre_%2894%29_Rue_Rossel_314.jpg',
      'kremlin-bicêtre':'https://upload.wikimedia.org/wikipedia/commons/1/1b/Le_Kremlin-Bic%C3%AAtre_%2894%29_Rue_Rossel_314.jpg',
      'kremlin-bicetre':'https://upload.wikimedia.org/wikipedia/commons/1/1b/Le_Kremlin-Bic%C3%AAtre_%2894%29_Rue_Rossel_314.jpg'
    };
    return map[key]||'';
  }

  function ensureLocalHeroBackground(){
    if(!isSeoLocalPage()){return;}
    var hero=document.querySelector('.hero-local-seo.seo-hero, .hero-local.seo-hero, .seo-hero');
    if(!hero){return;}
    var city=detectLocalCityFromH1();
    var img=localHeroImageByCity(city);
    if(!img){return;}
    hero.style.setProperty('background','linear-gradient(135deg,rgba(12,12,12,.72),rgba(22,22,22,.62)),url(\"'+img.replace(/\"/g,'%22')+'\") center/cover no-repeat','important');
  }

  function ensureAnalyticsScript(){
    var head=document.head;
    if(!head){return;}
    if(head.querySelector('script[data-analytics="plausible"]')){return;}
    var s=document.createElement('script');
    s.defer=true;
    s.setAttribute('data-domain','allonuisibleexpress.fr');
    s.setAttribute('data-analytics','plausible');
    s.src='https://plausible.io/js/script.js';
    head.appendChild(s);
  }

  function polishLocalPageContent(){
    if(!isSeoLocalPage()){return;}
    document.body.classList.add('is-local-page');

    function cityWithPreposition(city){
      var c=String(city||'').trim();
      var low=c.toLowerCase();
      var special={
        'kremlin-bicêtre':'au Kremlin-Bicêtre',
        'kremlin-bicetre':'au Kremlin-Bicêtre',
        'le kremlin-bicêtre':'au Kremlin-Bicêtre',
        'le kremlin-bicetre':'au Kremlin-Bicêtre',
        "l'haÿ-les-roses":"à L'Haÿ-les-Roses",
        'lhay-les-roses':"à L'Haÿ-les-Roses"
      };
      if(special[low]){return special[low];}
      return 'à '+c;
    }

    var city=detectLocalCityFromH1();
    var hero=document.querySelector('.seo-hero');
    if(hero){
      var p=hero.querySelector('p');
      if(p && city){
        p.innerHTML='Allo Nuisible Express intervient <span class="seo-hero-highlight">sous une heure maximum</span> '+cityWithPreposition(city)+', selon le niveau d’urgence constaté sur place.';
      }
    }

    var main=document.querySelector('main');
    if(!main){return;}
    var sections=[].slice.call(main.querySelectorAll(':scope > section, article > section'));
    var visualStep=1;
    sections.forEach(function(section){
      var h2=section.querySelector('h2');
      var title=(h2&&h2.textContent ? h2.textContent.trim().toLowerCase() : '');
      section.classList.add('local-polish-block');
      if(h2){
        section.dataset.localStep=String(visualStep);
        h2.setAttribute('data-local-step',String(visualStep));
        visualStep+=1;
      }
      if(section.hasAttribute('data-ux-landing-local')){section.classList.add('local-polish-intro');}
      if(title.indexOf('informations immédiates')!==-1){section.classList.add('local-polish-keypoints');}
      if(title.indexOf('comment se déroule')!==-1){section.classList.add('local-polish-steps');}
      if(title.indexOf('combien de temps faut-il attendre')!==-1){
        section.classList.add('local-polish-timing');
        section.style.setProperty('background','#fff4d4','important');
        section.style.setProperty('border-color','#efcf87','important');
      }
      if(title.indexOf('intervention en cave')!==-1){section.classList.add('local-polish-cave');}
      if(title.indexOf('interventions et villes proches')!==-1){section.classList.add('local-polish-links');}
      if(title.indexOf('sommaire de la page')!==-1){section.classList.add('local-polish-summary');}
    });

    var textNodes=[].slice.call(main.querySelectorAll('p, li'));
    textNodes.forEach(function(node){
      var t=node.textContent||'';
      if(!t){return;}
      var n=t
        .replace(/urgence intervention/gi,'intervention urgente')
        .replace(/Ce positionnement de traitement nuisibles/gi,'Notre intervention locale')
        .replace(/Ce positionnement/gi,'Cette approche')
        .replace(/en fonction de votre secteur, du trafic et du niveau d’urgence constaté sur place\./gi, city ? ('à '+city+', selon le niveau d’urgence constaté sur place.') : 'selon le niveau d’urgence constaté sur place.');
      if(n!==t){node.textContent=n;}
    });
  }

  function shouldShowTimedCallPopup(){
    return isHomePage();
  }

  function processHTML(){
    return ''+
    '<div data-global-process>'+
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
    '</section>'+
    '</div>';
  }

  function footerHTML(){
    return ''+
    '<footer class="site-footer global-footer">'+
    '  <div class="site-footer-main">'+
    '    <section>'+ 
    '      <a class="footer-logo" href="index.html" aria-label="Retour à l\'accueil"><img src="logo.png" alt="Allo Nuisible Express"></a>'+ 
    '      <p class="footer-text">Allo Nuisible Express intervient rapidement en Île-de-France pour la dératisation, la désinsectisation, la désinfection et le dépigeonnage.</p>'+ 
    '      <div class="footer-socials" aria-label="Réseaux sociaux">'+ 
    '        <a class="footer-social-link" href="https://wa.me/33744296897" target="_blank" rel="noopener noreferrer">WhatsApp</a>'+ 
    '        <a class="footer-social-link" href="https://x.com/Allonuisexpress" target="_blank" rel="noopener noreferrer">X</a>'+ 
    '        <a class="footer-social-link" href="https://www.linkedin.com/in/moncef-bedira-6217a521b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer">LinkedIn</a>'+ 
    '        <a class="footer-social-link" href="https://www.youtube.com/@AlloNuisibleExpress" target="_blank" rel="noopener noreferrer">YouTube</a>'+ 
    '        <a class="footer-social-link" href="http://www.tiktok.com/@allonuisibleexpress_" target="_blank" rel="noopener noreferrer">TikTok</a>'+ 
    '        <a class="footer-social-link" href="https://www.pinterest.com/allonuisibleexpress/" target="_blank" rel="noopener noreferrer">Pinterest</a>'+ 
    '        <a class="footer-social-link" href="https://maps.app.goo.gl/EWnwrfLmvWMRjEds6" target="_blank" rel="noopener noreferrer">Google Maps</a>'+ 
    '      </div>'+ 
    '    </section>'+ 
    '    <section><h3>Informations utiles</h3><ul class="footer-list"><li><a href="contact.html">Contact</a></li><li><a href="mentions-legales.html">Mentions légales</a></li><li><a href="politique-confidentialite.html">Confidentialité</a></li><li><a href="cgv-cgu.html">CGV / CGU</a></li><li><a href="blog.html">Blog</a></li></ul></section>'+ 
    '    <section><h3>Nos services</h3><ul class="footer-services"><li><a href="deratisation.html">Dératisation</a></li><li><a href="punaises.html">Punaises de lit</a></li><li><a href="desinsectisation.html">Désinsectisation</a></li><li><a href="desinfection.html">Désinfection</a></li><li><a href="cafards.html">Cafards</a></li><li><a href="acariens.html">Acariens</a></li><li><a href="xylophage.html">Xylophages</a></li><li><a href="mouches.html">Mouches</a></li><li><a href="fourmis.html">Fourmis</a></li><li><a href="depigeonnage.html">Dépigeonnage</a></li><li><a href="frelons.html">Frelons / Guêpes</a></li><li><a href="diogene.html">Syndrome de Diogène</a></li></ul></section>'+ 
    '    <section class="footer-contact"><h3>Contactez-nous</h3><p>4 rue de la Couture du Moulin, 94320 Thiais</p><div class="footer-cta"><a class="footer-btn footer-btn-devis" href="devis.html">✉ Demande de devis</a><a class="footer-btn footer-btn-call" href="tel:0744296897">📞 07 44 29 68 97</a></div></section>'+ 
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
    var strips=[].slice.call(document.querySelectorAll('.home-urgent-strip'));
    var strip=strips.length?strips[0]:null;
    if(strips.length>1){
      strips.slice(1).forEach(function(node){ node.remove(); });
    }
    if(!strip){
      strip=document.createElement('a');
      strip.className='home-urgent-strip';
      strip.href='tel:0744296897';
    }
    strip.className='home-urgent-strip';
    strip.href='tel:0744296897';
    strip.setAttribute('aria-label','Urgence 24h/24 - Appeler le 07 44 29 68 97');
    strip.innerHTML='<span class="urgent-default">URGENCE 24H/24 · 7J/7</span><span class="urgent-hover">07 44 29 68 97</span>';
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
    // Keep one identical urgent strip position across all pages/layouts.
    var topPx=(window.innerWidth<=560?83:(window.innerWidth<=980?91:96));
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
    if(!window.__alloUrgentLoadBound){
      window.__alloUrgentLoadBound=true;
      window.addEventListener('load',function(){
        ensureHomeUrgencyStrip();
        window.setTimeout(ensureHomeUrgencyStrip,250);
        window.setTimeout(ensureHomeUrgencyStrip,800);
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
    '<details class="faq-item"><summary class="faq-question">En combien de temps pouvez-vous intervenir ? <span class="faq-icon">+</span></summary><div class="faq-answer">(FAQ) Nous intervenons en urgence 24h/24 et 7j/7, y compris la nuit, les week-ends et les jours fériés. Nous intervenons sous une heure maximum.</div></details>'+ 
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

  function rootPrefix(){
    var path=normalizedPathname();
    if(path==='/' || path==='/index.html'){return '';}
    var clean=path;
    if(clean.charAt(0)==='/'){clean=clean.slice(1);}
    if(clean.slice(-1)==='/'){clean=clean.slice(0,-1);}
    if(!clean){return '';}
    var depth=clean.split('/').filter(Boolean).length-1;
    if(path.slice(-1)==='/'){depth+=1;}
    if(depth<0){depth=0;}
    var prefix='';
    for(var i=0;i<depth;i++){prefix+='../';}
    return prefix;
  }

  function ensureValDeMarneEntry(){
    var footer=document.querySelector('footer.site-footer');
    if(!footer){return;}
    var existing=document.querySelector('.seo-local-entry');
    if(existing && existing.previousElementSibling===footer){return;}
    if(existing){existing.remove();}

    var prefix=rootPrefix();
    var wrap=document.createElement('div');
    wrap.className='seo-local-entry';
    wrap.innerHTML='<a class="seo-local-link" href="'+prefix+'val-de-marne.html">Val-de-Marne</a>';

    if(footer.nextSibling){
      footer.parentNode.insertBefore(wrap, footer.nextSibling);
    }else{
      footer.parentNode.appendChild(wrap);
    }
  }

  function ensureProcess(){
    if(isHomePage()){return;}
    if(document.querySelector('[data-global-process]')){return;}
    var holder=document.createElement('div');
    holder.innerHTML=processHTML();
    var footer=document.querySelector('footer.site-footer');
    if(footer){footer.parentNode.insertBefore(holder, footer);}else{document.body.appendChild(holder);} 
  }

  function ensureReviewsFaq(){
    if(isHomePage()){return;}
    var needReviews=!document.querySelector('[data-global-reviews]');
    var needFaq=!document.querySelector('[data-global-faq]');
    if(!needReviews && !needFaq){return;}
    var html='';
    if(needReviews){html += reviewsHTML();}
    if(needFaq){html += faqHTML();}
    insertBeforeFooter(html);
  }

  function ensureSticky(){
    [].slice.call(document.querySelectorAll('.global-bottom-black-fill')).forEach(function(node){
      node.remove();
    });

    [].slice.call(document.querySelectorAll('.site-sticky-cta')).forEach(function(node){
      node.remove();
    });
    var holder=document.createElement('div');
    holder.innerHTML=ctaHTML();
    document.body.appendChild(holder.firstElementChild);
  }

  function initStickyAutoSwitch(){
    var ctas=[].slice.call(document.querySelectorAll('.global-sticky-cta .sticky-call'));
    if(!ctas.length){return;}
    ctas.forEach(function(callBtn){
      var base=callBtn.querySelector('.sticky-default');
      if(!base){
        base=document.createElement('span');
        base.className='sticky-default';
        callBtn.appendChild(base);
      }
      base.textContent='APPELER MAINTENANT';

      if(callBtn.dataset.switchInit==='1'){return;}
      callBtn.dataset.switchInit='1';
      var showAlt=false;
      window.setInterval(function(){
        showAlt=!showAlt;
        base.textContent=showAlt ? 'DEVIS ET DÉPLACEMENT GRATUIT' : 'APPELER MAINTENANT';
        callBtn.classList.remove('cta-casino-flash');
        void callBtn.offsetWidth;
        callBtn.classList.add('cta-casino-flash');
      }, 3000);
    });
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
    var PLACE_QUERY='Allo Nuisible Express, 4 rue de la Couture du Moulin, 94320 Thiais';
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

    var keywords=head.querySelector('meta[name="keywords"]');
    if(!keywords){
      keywords=document.createElement('meta');
      keywords.name='keywords';
      var title=(document.title||'').replace(/\s+/g,' ').trim();
      var h1=(document.querySelector('h1')?document.querySelector('h1').textContent:'').replace(/\s+/g,' ').trim();
      var city=detectLocalCityFromH1();
      var parts=['dératisation','désinsectisation','nuisibles'];
      if(title){parts.push(title);}
      if(h1){parts.push(h1);}
      if(city){parts.push('intervention '+city);}
      keywords.content=parts.join(', ');
      head.appendChild(keywords);
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
        '@type':'PestControlService',
        name:'Allo Nuisible Express',
        url:canonicalUrl(),
        telephone:'+33744296897',
        email:'allonuisibleexpress@gmail.com',
        priceRange:'€€',
        areaServed:[detectCity()],
        address:{
          '@type':'PostalAddress',
          streetAddress:'4 rue de la Couture du Moulin',
          postalCode:'94320',
          addressLocality:'Thiais',
          addressRegion:'Île-de-France',
          addressCountry:'FR'
        },
        openingHours:'Mo-Su 00:00-23:59',
        sameAs:[
          'https://wa.me/33744296897',
          'https://x.com/Allonuisexpress',
          'https://www.linkedin.com/in/moncef-bedira-6217a521b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
          'https://www.youtube.com/@AlloNuisibleExpress',
          'http://www.tiktok.com/@allonuisibleexpress_',
          'https://www.pinterest.com/allonuisibleexpress/',
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

  function mobileMenuItems(prefix){
    return [
      {href:'index.html', label:'ACCUEIL'},
      {href:'punaises.html', label:'PUNAISE DE LIT'},
      {href:'cafards.html', label:'CAFARDS'},
      {href:'acariens.html', label:'ACARIENS'},
      {href:'xylophage.html', label:'XYLOPHAGE (INSECTES DU BOIS)'},
      {href:'mouches.html', label:'MOUCHES'},
      {href:'fourmis.html', label:'FOURMIS'},
      {href:'deratisation.html', label:'DÉRATISATION (RATS / SOURIS)'},
      {href:'depigeonnage.html', label:'DÉPIGEONNAGE'},
      {href:'frelons.html', label:'FRELON'},
      {href:'diogene.html', label:'SYNDROME DIOGÈNE'},
      {href:'chenilles.html', label:'CHENILLE PROCESSIONNAIRE'},
      {href:'guepes.html', label:'GUÊPE'},
      {href:'contact.html', label:'CONTACTEZ-NOUS'},
      {href:'tarifs.html', label:'TARIFS'},
      {href:'blog.html', label:'BLOG'}
    ].map(function(item){
      return '<li><a href="'+prefix+item.href+'">'+item.label+'</a></li>';
    }).join('');
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

    function setHeaderLogoHidden(hidden){
      var logoLink=header.querySelector('.logo-link');
      if(logoLink){
        logoLink.style.setProperty('display', hidden ? 'none' : '', 'important');
        logoLink.style.setProperty('visibility', hidden ? 'hidden' : '', 'important');
        logoLink.style.setProperty('opacity', hidden ? '0' : '', 'important');
      }
      var logoImg=header.querySelector('.logo');
      if(logoImg){
        logoImg.style.setProperty('display', hidden ? 'none' : '', 'important');
        logoImg.style.setProperty('visibility', hidden ? 'hidden' : '', 'important');
        logoImg.style.setProperty('opacity', hidden ? '0' : '', 'important');
      }
    }

    function closeMenu(){
      document.body.classList.remove('mobile-nav-open');
      btn.setAttribute('aria-expanded','false');
      setHeaderLogoHidden(false);
    }
    function openMenu(){
      document.body.classList.add('mobile-nav-open');
      btn.setAttribute('aria-expanded','true');
      setHeaderLogoHidden(true);
    }
    function toggleMenu(){
      if(document.body.classList.contains('mobile-nav-open')){closeMenu();}else{openMenu();}
    }

    var mobileList=nav.querySelector('.mobile-nav-list');
    if(!mobileList){
      mobileList=document.createElement('ul');
      mobileList.className='mobile-nav-list';
      mobileList.innerHTML=mobileMenuItems(rootPrefix());
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
    return mobileMenuItems(rootPrefix());
  }

  function ensureMobileMenuFallback(){
    var header=document.querySelector('header');
    var nav=document.querySelector('header .main-nav');
    if(!header||!nav){return;}

    function setHeaderLogoHidden(hidden){
      var logoLink=header.querySelector('.logo-link');
      if(logoLink){
        logoLink.style.setProperty('display', hidden ? 'none' : '', 'important');
        logoLink.style.setProperty('visibility', hidden ? 'hidden' : '', 'important');
        logoLink.style.setProperty('opacity', hidden ? '0' : '', 'important');
      }
      var logoImg=header.querySelector('.logo');
      if(logoImg){
        logoImg.style.setProperty('display', hidden ? 'none' : '', 'important');
        logoImg.style.setProperty('visibility', hidden ? 'hidden' : '', 'important');
        logoImg.style.setProperty('opacity', hidden ? '0' : '', 'important');
      }
    }

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
    }else{
      mobileList.innerHTML=mobileMenuListHTML();
    }
    var closeHome=nav.querySelector('.mobile-close-home');
    if(!closeHome){
      closeHome=document.createElement('a');
      closeHome.className='mobile-close-home';
      closeHome.href='index.html';
      closeHome.setAttribute('aria-label','Fermer et revenir à l’accueil');
      closeHome.textContent='×';
      nav.insertBefore(closeHome, nav.firstChild);
    }
    if(!closeHome.dataset.menuCloseBound){
      closeHome.dataset.menuCloseBound='1';
      closeHome.addEventListener('click',function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        document.body.classList.remove('mobile-nav-open');
        btn.setAttribute('aria-expanded','false');
        setHeaderLogoHidden(false);
        var path=(window.location.pathname||'').toLowerCase();
        var atHome=(path==='/' || path.endsWith('/index.html'));
        if(!atHome){
          window.location.href='index.html';
        }
      });
    }

    if(!btn.dataset.menuFallbackBound){
      btn.dataset.menuFallbackBound='1';
      btn.addEventListener('click',function(ev){
        if(window.innerWidth>980){return;}
        ev.preventDefault();
        var isOpen=document.body.classList.contains('mobile-nav-open');
        document.body.classList.toggle('mobile-nav-open',!isOpen);
        btn.setAttribute('aria-expanded', isOpen?'false':'true');
        setHeaderLogoHidden(!isOpen);
      });
    }

    if(!overlay.dataset.menuFallbackBound){
      overlay.dataset.menuFallbackBound='1';
      overlay.addEventListener('click',function(){
        document.body.classList.remove('mobile-nav-open');
        btn.setAttribute('aria-expanded','false');
        setHeaderLogoHidden(false);
      });
    }

    if(!document.body.dataset.mobileMenuDocBound){
      document.body.dataset.mobileMenuDocBound='1';
      document.addEventListener('click',function(ev){
        var target=ev.target;
        if(!target){return;}
        var trigger=target.closest ? target.closest('.mobile-menu-btn') : null;
        if(trigger){
          // Button has its own click handler; do not toggle here to prevent double action.
          return;
        }
        if(window.innerWidth<=980 && document.body.classList.contains('mobile-nav-open')){
          var inMenu=target.closest ? target.closest('header .main-nav') : null;
          var inOverlay=target.closest ? target.closest('.mobile-nav-overlay') : null;
          if(inOverlay || (!inMenu && !target.closest('.mobile-menu-btn'))){
            document.body.classList.remove('mobile-nav-open');
            var openBtn=document.querySelector('header .mobile-menu-btn');
            if(openBtn){openBtn.setAttribute('aria-expanded','false');}
            setHeaderLogoHidden(false);
          }
        }
      }, true);
    }
  }

  function timedCallModalHTML(){
    var prefix=rootPrefix();
    return ''+
    '<div class="timed-call-overlay" data-timed-call-overlay aria-hidden="true">'+
    '  <div class="timed-call-modal" role="dialog" aria-modal="true" aria-labelledby="timed-call-title">'+
    '    <button class="timed-call-close" type="button" aria-label="Fermer">×</button>'+
    '    <div class="timed-call-badge"><img class="timed-call-logo" src="'+prefix+'logo.png" alt="Allo Nuisible Express"></div>'+
    '    <h3 id="timed-call-title">Présence de nuisibles ? Allo Nuisible Express intervient sous une heure maximum dans toute l\'Île-de-France.</h3>'+
    '    <p>Devis et déplacement gratuit, disponible 24h/24 et 7j/7 (de nuit, les week-end et les jours fériés)</p>'+
    '    <a class="timed-call-action" href="tel:0744296897" aria-label="Appeler le 07 44 29 68 97">📞 07 44 29 68 97</a>'+
    '  </div>'+
    '</div>';
  }

  function initTimedCallModal(){
    if(!shouldShowTimedCallPopup()){return;}
    if(window.__alloPopupDismissed){return;}
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
    var openScheduled=false;
    var dismissedByUser=false;
    var hasOpened=false;

    function closeModal(){
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden','true');
      document.body.classList.remove('timed-call-open');
      overlay.style.removeProperty('opacity');
      overlay.style.removeProperty('visibility');
      overlay.style.removeProperty('pointer-events');
      overlay.style.removeProperty('display');
      overlay.style.removeProperty('z-index');
      if(timerId){window.clearTimeout(timerId);timerId=null;}
      dismissedByUser=true;
      window.__alloPopupDismissed=true;
    }

    function openModal(){
      if(dismissedByUser || window.__alloPopupDismissed){return;}
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
      openScheduled=false;
      hasOpened=true;
    }

    if(closeBtn && !closeBtn.dataset.modalBound){
      closeBtn.dataset.modalBound='1';
      closeBtn.addEventListener('click',function(ev){ if(ev){ev.preventDefault(); ev.stopPropagation();} closeModal(); });
      closeBtn.addEventListener('touchend',function(ev){ if(ev){ev.preventDefault(); ev.stopPropagation();} closeModal(); },{passive:false});
      closeBtn.addEventListener('pointerup',function(ev){ if(ev){ev.preventDefault(); ev.stopPropagation();} closeModal(); });
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

    function scheduleOpen(){
      if(dismissedByUser || window.__alloPopupDismissed){return;}
      if(openScheduled){return;}
      openScheduled=true;
      if(timerId){window.clearTimeout(timerId);}
      timerId=window.setTimeout(function(){
        openModal();
      },20000);
    }

    scheduleOpen();

    // No forced reopen after close: popup must stay closed until next page refresh.
  }

  function forceTimedPopupEmergency(){
    if(!shouldShowTimedCallPopup()){return;}
    if(window.__alloPopupDismissed){return;}
    if(window.__alloEmergencyPopupBound){return;}
    window.__alloEmergencyPopupBound=true;
    window.setTimeout(function(){
      if(!shouldShowTimedCallPopup() || window.__alloPopupDismissed){return;}
      var overlay=document.querySelector('[data-timed-call-overlay]');
      if(!overlay){
        var host=document.createElement('div');
        host.innerHTML=timedCallModalHTML();
        overlay=host.firstElementChild;
        if(overlay){document.body.appendChild(overlay);}
      }
      if(!overlay){return;}
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden','false');
      overlay.style.setProperty('opacity','1','important');
      overlay.style.setProperty('visibility','visible','important');
      overlay.style.setProperty('pointer-events','auto','important');
      overlay.style.setProperty('display','flex','important');
      overlay.style.setProperty('z-index','20000','important');
      document.body.classList.add('timed-call-open');
      var closeBtn=overlay.querySelector('.timed-call-close');
      if(closeBtn && !closeBtn.dataset.emergencyBound){
        closeBtn.dataset.emergencyBound='1';
        closeBtn.addEventListener('click',function(){
          overlay.classList.remove('is-open');
          overlay.setAttribute('aria-hidden','true');
          document.body.classList.remove('timed-call-open');
          overlay.style.removeProperty('opacity');
          overlay.style.removeProperty('visibility');
          overlay.style.removeProperty('pointer-events');
          overlay.style.removeProperty('display');
          overlay.style.removeProperty('z-index');
          window.__alloPopupDismissed=true;
        });
      }
    },20000);
  }

  function forceMobileMenuEmergency(){
    var header=document.querySelector('header');
    if(!header){return;}
    var btn=header.querySelector('.mobile-menu-btn');
    if(!btn){return;}
    if(btn.dataset.emergencyMenuBound==='1'){return;}
    btn.dataset.emergencyMenuBound='1';
    // Emergency mode now only hardens tap visibility/styling.
    // Toggle listeners are managed by ensureMobileMenuFallback to avoid double-toggle on iOS.
    btn.style.pointerEvents='auto';
    btn.style.cursor='pointer';
    btn.style.touchAction='manipulation';
    btn.style.webkitTapHighlightColor='transparent';
  }

  function cleanupTimedModalNonHome(){
    if(shouldShowTimedCallPopup()){return;}
    document.querySelectorAll('[data-timed-call-overlay]').forEach(function(node){ node.remove(); });
    document.body.classList.remove('timed-call-open');
  }

  function ensureCoreSections(){
    if(isHomePage()){
      return;
    }
    ensureFooter();
    ensureProcess();
    ensureReviewsFaq();
    setYear();
    ensureValDeMarneEntry();
    if(window.__alloScrollRevealRefresh){window.__alloScrollRevealRefresh(document);}
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
    safeRun(ensureValDeMarneEntry,'ensureValDeMarneEntry');
    safeRun(ensureProcess,'ensureProcess');
    safeRun(ensureReviewsFaq,'ensureReviewsFaq');
    safeRun(ensureCoreSections,'ensureCoreSections');
    safeRun(ensureSeoSummary,'ensureSeoSummary');
    safeRun(ensureCityHeroMedia,'ensureCityHeroMedia');
    safeRun(enhanceMiniLocalFaq,'enhanceMiniLocalFaq');
    safeRun(polishLocalPageContent,'polishLocalPageContent');
    safeRun(ensureLocalHeroBackground,'ensureLocalHeroBackground');
    safeRun(ensureLocalSeoSections,'ensureLocalSeoSections');
    safeRun(ensureSticky,'ensureSticky');
    safeRun(initStickyAutoSwitch,'initStickyAutoSwitch');
    safeRun(optimizeForCalls,'optimizeForCalls');
    safeRun(initFaq,'initFaq');
    // Keep a single mobile menu system (fallback) to avoid double-toggle conflicts.
    safeRun(ensureMobileMenuFallback,'ensureMobileMenuFallback');
    safeRun(forceMobileMenuEmergency,'forceMobileMenuEmergency');
    // Dynamic Google Places calls can trigger third-party console errors on some crawlers.
    // Keep reviews section static to avoid JS error flags in SEO audits.
    // safeRun(initReviews,'initReviews');
    safeRun(cleanupTimedModalNonHome,'cleanupTimedModalNonHome');
    safeRun(initTimedCallModal,'initTimedCallModal');
    safeRun(forceTimedPopupEmergency,'forceTimedPopupEmergency');
    safeRun(optimizeMedia,'optimizeMedia');
    safeRun(ensureStructuredData,'ensureStructuredData');
    safeRun(ensureAnalyticsScript,'ensureAnalyticsScript');
    safeRun(setYear,'setYear');
    if(window.__alloScrollRevealRefresh){safeRun(function(){window.__alloScrollRevealRefresh(document);},'scrollRevealRefresh');}

    // Hard retry to recover from page-specific scripts/styles that run after boot.
    if(!window.__alloCoreRetryBound){
      window.__alloCoreRetryBound=true;
      window.setTimeout(function(){safeRun(ensureCoreSections,'ensureCoreSections@250');},250);
      window.setTimeout(function(){safeRun(ensureCoreSections,'ensureCoreSections@1000');},1000);
      window.setTimeout(function(){safeRun(ensureCoreSections,'ensureCoreSections@2200');},2200);
      window.setTimeout(function(){safeRun(forceMobileMenuEmergency,'forceMobileMenuEmergency@1200');},1200);
    }
  }

  hardenGithubMirror();
  enforcePrimaryDomain();

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();
