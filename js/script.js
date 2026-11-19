/* DAFOR · interacciones del sitio */
document.documentElement.classList.remove('no-js');

(function () {
    var header = document.getElementById('site-header');
    var nav = document.getElementById('main-nav');
    var overlay = document.getElementById('nav-overlay');
    var toggle = document.getElementById('menu-toggle');
    var closeBtn = document.getElementById('menu-close');

    /* Header al hacer scroll */
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Menú móvil */
    function setMenu(open) {
        nav.classList.toggle('open', open);
        overlay.classList.toggle('show', open);
        toggle.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) closeBtn.focus();
    }
    toggle.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    overlay.addEventListener('click', function () { setMenu(false); });
    nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });

    /* Resaltar la sección activa del menú (página de inicio) */
    var sections = document.querySelectorAll('main section[id]');
    if (sections.length && 'IntersectionObserver' in window) {
        var links = nav.querySelectorAll('a[href^="#"], a[href^="index.html#"]');
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (l) {
                    l.classList.toggle('active', l.getAttribute('href').split('#')[1] === entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { spy.observe(s); });
    }

    /* Animaciones de entrada */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
            });
        }, { threshold: 0.15 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* Contadores animados */
    var counters = document.querySelectorAll('[data-count]');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function runCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var prefix = el.getAttribute('data-prefix') || '';
        if (reduce) { el.textContent = prefix + target; return; }
        var start = null, dur = 1600;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            el.textContent = prefix + Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
        var co = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { co.observe(c); });
    }

    /* Año automático en el pie de página */
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    /* Enlaces a Proyectos: van al formulario mientras no haya proyectos cargados */
    if ((window.DAFOR_PROYECTOS || []).length) {
        document.querySelectorAll('[data-proyectos-link]').forEach(function (a) { a.setAttribute('href', 'proyectos.html'); });
    }

    /* Preseleccionar el interés desde los botones de servicios (?interes=comprar|construir) */
    var sel = document.getElementById('interes');
    var q = new URLSearchParams(location.search).get('interes');
    if (sel && q) {
        var map = { comprar: 'Comprar en un proyecto DAFOR', construir: 'Construir en mi terreno', invertir: 'Invertir en un proyecto' };
        if (map[q]) sel.value = map[q];
    }
    var proyecto = new URLSearchParams(location.search).get('proyecto');
    var msg = document.getElementById('mensaje');
    if (proyecto && msg && !msg.value) msg.value = 'Hola, me interesa el proyecto ' + proyecto + '. ¿Me pueden enviar más información?';

    /* Formulario de contacto (Formspree, sin salir de la página) */
    var form = document.getElementById('contact-form');
    if (form) {
        var status = document.getElementById('form-status');
        var btn = form.querySelector('button[type="submit"]');
        var btnHtml = btn.innerHTML;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            status.className = 'form-status';
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            }).then(function (res) {
                if (!res.ok) throw new Error();
                form.reset();
                status.textContent = '¡Gracias! Hemos recibido tu mensaje y te contactaremos muy pronto.';
                status.className = 'form-status ok';
            }).catch(function () {
                status.innerHTML = 'No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por <a href="https://wa.me/593999496255" target="_blank" rel="noopener"><u>WhatsApp</u></a>.';
                status.className = 'form-status err';
            }).finally(function () {
                btn.disabled = false;
                btn.innerHTML = btnHtml;
            });
        });
    }
})();
