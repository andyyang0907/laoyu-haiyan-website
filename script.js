(() => {
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('progressBar');
  const backTop = document.getElementById('backTop');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const updateScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 40);
    backTop?.classList.toggle('show', y > 600);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? y / max * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateScroll, {passive:true});
  updateScroll();

  navToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  backTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  document.querySelectorAll('.journey-node').forEach(el => {
    const io = new IntersectionObserver(([e]) => { if(e.isIntersecting) e.target.classList.add('active'); }, {threshold:.5});
    io.observe(el);
  });

  const sections = ['wetland','village','change','reflection'];
  const chapters = document.querySelectorAll('.hero-chapter li');
  const setChapter = () => {
    let active = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if(el && el.getBoundingClientRect().top <= innerHeight * .35) active = id;
    });
    chapters.forEach(li => li.classList.toggle('active', li.dataset.chapter === active));
  };
  window.addEventListener('scroll', setChapter, {passive:true});
  setChapter();
  document.querySelectorAll('.hero-chapter li').forEach(li => li.addEventListener('click', () => document.getElementById(li.dataset.chapter)?.scrollIntoView({behavior:'smooth'})));

  document.querySelectorAll('.card[data-bg]').forEach(card => card.style.setProperty('--bg', `url('${card.dataset.bg}')`));

  const counters = document.querySelectorAll('.data-num[data-count]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.count,10), suffix = el.dataset.suffix || '';
    const run = () => {
      const start = performance.now(), dur = 1400;
      const tick = now => {
        const t = Math.min(1,(now-start)/dur), eased = 1-Math.pow(1-t,3);
        el.textContent = Math.round(target*eased)+suffix;
        if(t<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    new IntersectionObserver(([e], obs) => { if(e.isIntersecting){run(); obs.unobserve(el);} }, {threshold:.3}).observe(el);
  });

  const track = document.querySelector('.tl-track'), wrap = document.querySelector('.timeline-horizontal');
  const timeline = () => {
    if(!track || !wrap) return;
    const r = wrap.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight*.6-r.top)/(r.height+200)));
    track.style.width = p*75+'%';
  };
  window.addEventListener('scroll', timeline, {passive:true}); timeline();

  const lightbox = document.getElementById('lightbox'), lbImg = document.getElementById('lightboxImg'), lbCap = document.getElementById('lightboxCaption');
  const close = () => { lightbox?.classList.remove('open'); document.body.style.overflow=''; };
  document.getElementById('lightboxClose')?.addEventListener('click',close);
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  document.querySelectorAll('.pj-cell img,.photo-center img,.col-photo img').forEach(img => img.addEventListener('click',()=>{
    if(!lightbox) return;
    lbImg.src=img.src; lbImg.alt=img.alt; lbCap.textContent=img.alt;
    lightbox.classList.add('open'); document.body.style.overflow='hidden';
  }));
})();
