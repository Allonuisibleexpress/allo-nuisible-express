/* Host-side SEO helper. Kept intentionally minimal to avoid 404 in production. */
(function(){
  try{
    var m=document.querySelector('meta[name="robots"]');
    if(!m){
      m=document.createElement('meta');
      m.setAttribute('name','robots');
      m.setAttribute('content','index, follow');
      document.head.appendChild(m);
    }
  }catch(e){
    /* no-op */
  }
})();
