(function(){
  function currentPage(){
    var p=(window.location.pathname||'').split('/').pop();
    return p||'index.html';
  }

  function isHomePage(){
    return currentPage()==='index.html';
  }

  function noExtraBlocksHere(){
    var blocked={
      'blog.html':true,
      'tarifs.html':true,
      'devis.html':true,
      'contact.html':true
    };
    return !!blocked[currentPage()];
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

  function ensureFooter(){
    var existing=document.querySelector('footer.site-footer');
    if(isHomePage()){
      return;
    }
    var holder=document.createElement('div');
    holder.innerHTML=footerHTML();
    var fresh=holder.firstElementChild;
    if(!existing){
      document.body.appendChild(fresh);
      return;
    }
    if(existing.classList.contains('global-footer')){
      return;
    }
    existing.parentNode.replaceChild(fresh, existing);
  }

  function ensureProcess(){
    if(noExtraBlocksHere()){return;}
    if(document.querySelector('.process-section')){return;}
    var holder=document.createElement('div');
    holder.innerHTML=processHTML();
    var footer=document.querySelector('footer.site-footer');
    if(footer){
      footer.parentNode.insertBefore(holder, footer);
    }else{
      document.body.appendChild(holder);
    }
  }

  function ensureSticky(){
    if(document.querySelector('.site-sticky-cta')){return;}
    var holder=document.createElement('div');
    holder.innerHTML=ctaHTML();
    document.body.appendChild(holder.firstElementChild);
  }

  function setYear(){
    var y=String(new Date().getFullYear());
    document.querySelectorAll('.js-year').forEach(function(el){el.textContent=y;});
  }

  function boot(){
    ensureFooter();
    ensureProcess();
    ensureSticky();
    setYear();
    if(window.__alloScrollRevealRefresh){window.__alloScrollRevealRefresh(document);} 
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();
