(function () {
  const instances = new WeakMap();

  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initReveal(root) {
    const revs = root.querySelectorAll('.rv:not(.in)');
    if (!revs.length) return;
    if (!('IntersectionObserver' in window) || prefersReduced()) {
      revs.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    revs.forEach((el) => io.observe(el));
    return io;
  }

  function initScenes() {
    const stage = document.getElementById('pl-scenes');
    if (!stage) return;
    const scenes = Array.from(stage.querySelectorAll('.scene'));
    const zones = Array.from(document.querySelectorAll('[data-scene]'));
    let current = 0;
    function setScene(n) {
      if (n === current) return;
      current = n;
      scenes.forEach((s, i) => s.classList.toggle('on', i + 1 === n));
      stage.setAttribute('data-d', String(n));
    }
    function pickScene() {
      const focus = window.scrollY + window.innerHeight * 0.5;
      let n = 1;
      zones.forEach((z) => {
        let top = 0;
        let el = z;
        while (el) {
          top += el.offsetTop;
          el = el.offsetParent;
        }
        if (top <= focus) n = parseInt(z.getAttribute('data-scene'), 10) || n;
      });
      setScene(n);
    }
    return { pickScene, stage };
  }

  function initHeader(root) {
    const hdr = root.querySelector('[data-pl-header]') || document.getElementById('pl-hdr');
    const burger = root.querySelector('[data-pl-burger]');
    const drawer = root.querySelector('[data-pl-drawer]');
    if (burger && drawer) {
      burger.addEventListener('click', () => {
        const open = drawer.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        drawer.setAttribute('aria-hidden', String(!open));
      });
      drawer.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          drawer.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }
    return { hdr };
  }

  function initHero(root) {
    const stage = root.querySelector('[data-pl-hstage]');
    if (!stage) return null;
    const slides = Array.from(stage.querySelectorAll('.hslide'));
    const dots = Array.from(root.querySelectorAll('[data-pl-hdots] button'));
    if (!slides.length) return null;
    let index = 0;
    let timer = null;
    const reduce = prefersReduced();

    function go(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('on', i === index));
      dots.forEach((d, i) => {
        d.classList.toggle('on', i === index);
        d.setAttribute('aria-selected', String(i === index));
      });
    }
    function play() {
      if (!timer && !reduce) timer = setInterval(() => go(index + 1), 3800);
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stop();
        go(i);
        play();
      });
    });
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', play);

    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? play() : stop()));
        },
        { threshold: 0.2 }
      );
      io.observe(stage);
    } else {
      play();
    }

    return { stop, io };
  }

  function initParallax(hdr, prod) {
    const reduce = prefersReduced();
    let raf = null;
    let mx = 0;
    let my = 0;
    const scenes = initScenes();

    function frame() {
      raf = null;
      const y = window.scrollY || window.pageYOffset;
      if (hdr) hdr.classList.toggle('up', y > 90);
      if (!reduce) {
        const layers = document.querySelectorAll('#pl-water .wl');
        layers.forEach((wl, i) => {
          const d = [0.05, 0.09, 0.03, 0.02][i] || 0.05;
          wl.style.setProperty('--px', (mx * d * 130).toFixed(1) + 'px');
          wl.style.setProperty('--py', (-y * d + my * d * 90).toFixed(1) + 'px');
        });
        if (prod) {
          const f = Math.min(y / 700, 1);
          prod.style.transform =
            'translate3d(' +
            (mx * -16).toFixed(2) +
            'px,' +
            (-f * 54 + my * -10).toFixed(2) +
            'px,0) scale(' +
            (1 - f * 0.06).toFixed(3) +
            ')';
          prod.style.opacity = (1 - f * 0.55).toFixed(3);
        }
      }
      if (scenes) scenes.pickScene();
      const railLinks = Array.from(document.querySelectorAll('.rail a'));
      if (railLinks.length) {
        const mid = y + window.innerHeight * 0.42;
        let idx = 0;
        railLinks.forEach((a, i) => {
          const t = document.querySelector(a.getAttribute('href'));
          if (t) {
            let top = 0;
            let el = t;
            while (el) {
              top += el.offsetTop;
              el = el.offsetParent;
            }
            if (top <= mid) idx = i;
          }
        });
        railLinks.forEach((a, i) => a.classList.toggle('on', i === idx));
      }
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    if (!reduce && window.matchMedia('(min-width: 1024px)').matches) {
      window.addEventListener(
        'mousemove',
        (e) => {
          mx = (e.clientX / window.innerWidth - 0.5) * 2;
          my = (e.clientY / window.innerHeight - 0.5) * 2;
          onScroll();
        },
        { passive: true }
      );
    }

    if (!reduce && prod && prod.animate) {
      prod.animate(
        [
          { filter: 'drop-shadow(0 34px 54px rgba(2,20,19,.6))' },
          { filter: 'drop-shadow(0 42px 68px rgba(2,20,19,.68))' },
          { filter: 'drop-shadow(0 34px 54px rgba(2,20,19,.6))' },
        ],
        { duration: 7000, iterations: Infinity, easing: 'ease-in-out' }
      );
    }

    frame();
    return { onScroll };
  }

  async function addToCart(variantId, button) {
    if (!variantId || !window.routes) return;
    const original = button ? button.textContent : '';
    if (button) {
      button.disabled = true;
      button.textContent = 'Adding…';
    }
    try {
      const res = await fetch(window.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] }),
      });
      if (!res.ok) throw new Error('add failed');
      const cart = await fetch(window.routes.cart_url + '.js').then((r) => r.json());
      document.querySelectorAll('[data-pl-cart-count]').forEach((el) => {
        el.textContent = String(cart.item_count || 0);
      });
      if (typeof publish === 'function') {
        publish('cart-update', { source: 'purelane', cartData: cart });
      }
      if (button) button.textContent = 'Added';
    } catch (err) {
      if (button) button.textContent = 'Try again';
    } finally {
      if (button) {
        setTimeout(() => {
          button.disabled = false;
          button.textContent = original;
        }, 1400);
      }
    }
  }

  function initRotator(root) {
    const rot = root.querySelector('[data-pl-rot]');
    if (!rot || rot.dataset.plBound) return null;
    rot.dataset.plBound = '1';
    const rimgs = Array.from(rot.querySelectorAll('.frame .pimg'));
    const rdots = Array.from(rot.querySelectorAll('.dots i'));
    const rcapB = rot.querySelector('.cap b');
    const rcapS = rot.querySelector('.cap span');
    if (!rimgs.length) return null;
    let ri = Math.max(0, rimgs.findIndex((el) => el.classList.contains('on')));
    let rtimer = null;
    function rstep() {
      rimgs[ri].classList.remove('on');
      if (rdots[ri]) rdots[ri].classList.remove('on');
      ri = (ri + 1) % rimgs.length;
      rimgs[ri].classList.add('on');
      if (rdots[ri]) rdots[ri].classList.add('on');
      if (rcapB) rcapB.innerHTML = rimgs[ri].getAttribute('data-name') || '';
      if (rcapS) rcapS.textContent = rimgs[ri].getAttribute('data-note') || '';
    }
    if (prefersReduced()) return { stop() {} };
    const rio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !rtimer) rtimer = setInterval(rstep, 2900);
          else if (!e.isIntersecting && rtimer) {
            clearInterval(rtimer);
            rtimer = null;
          }
        });
      },
      { threshold: 0.25 }
    );
    rio.observe(rot);
    return {
      stop() {
        if (rtimer) clearInterval(rtimer);
        rio.disconnect();
      },
      io: rio,
    };
  }

  function initAtc(root) {
    root.querySelectorAll('[data-pl-atc]').forEach((btn) => {
      if (btn.dataset.plBound) return;
      btn.dataset.plBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.disabled) return;
        addToCart(btn.getAttribute('data-variant-id'), btn);
      });
    });
  }

  function boot(root) {
    const scope = root || document;
    initReveal(scope);
    const hero = initHero(scope);
    const headerBits = initHeader(scope);
    initAtc(scope);
    const rotator = initRotator(scope);
    if (hero) instances.set(scope, hero);
    else if (rotator) instances.set(scope, rotator);
    return { headerBits };
  }

  let pageBooted = false;
  function bootPage() {
    if (pageBooted) return;
    pageBooted = true;
    const { headerBits } = boot(document);
    const prod = document.querySelector('[data-pl-hero-prod]');
    initParallax(headerBits && headerBits.hdr, prod);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPage);
  } else {
    bootPage();
  }

  document.addEventListener('shopify:section:load', (event) => {
    boot(event.target);
  });

  document.addEventListener('shopify:section:unload', (event) => {
    const inst = instances.get(event.target);
    if (inst && inst.stop) inst.stop();
    if (inst && inst.io) inst.io.disconnect();
  });
})();
