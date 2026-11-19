/* DAFOR · muestra los proyectos de proyectos-data.js en proyectos.html */
(function () {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;
    var data = window.DAFOR_PROYECTOS || [];
    var empty = document.getElementById('projects-empty');
    var filters = document.getElementById('project-filters');
    var WA = '593999496255';

    var ESTADOS = {
        planos: 'En planos',
        construccion: 'En construcción',
        inmediata: 'Entrega inmediata',
        vendido: 'Vendido'
    };

    function esc(t) {
        return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function feature(icon, label, value) {
        return value ? '<li><i class="fas ' + icon + '"></i><span><small>' + label + '</small>' + esc(value) + '</span></li>' : '';
    }

    function card(p) {
        var wa = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola, me interesa el proyecto ' + p.nombre + ' de DAFOR. ¿Me pueden dar más información?');
        var info = 'contacto.html?interes=comprar&proyecto=' + encodeURIComponent(p.nombre);
        var vendido = p.estado === 'vendido';
        return '' +
            '<article class="project-card' + (vendido ? ' sold' : '') + '" data-estado="' + esc(p.estado) + '">' +
                '<div class="project-media">' +
                    '<img src="' + esc(p.imagen) + '" alt="' + esc(p.nombre) + '" loading="lazy">' +
                    '<span class="project-badge badge-' + esc(p.estado) + '">' + esc(ESTADOS[p.estado] || p.estado) + '</span>' +
                '</div>' +
                '<div class="project-body">' +
                    '<span class="project-type">' + esc(p.tipo) + '</span>' +
                    '<h3>' + esc(p.nombre) + '</h3>' +
                    '<p class="project-location"><i class="fas fa-location-dot"></i> ' + esc(p.sector) + '</p>' +
                    (p.descripcion ? '<p class="project-desc">' + esc(p.descripcion) + '</p>' : '') +
                    '<ul class="project-features">' +
                        feature('fa-ruler-combined', 'Área', p.area) +
                        feature('fa-bed', 'Dormitorios', p.dormitorios) +
                        feature('fa-car', 'Parqueaderos', p.parqueaderos) +
                    '</ul>' +
                    (p.entrega ? '<p class="project-delivery"><i class="far fa-calendar"></i> Entrega: ' + esc(p.entrega) + '</p>' : '') +
                    (p.precioDesde ? '<p class="project-price"><small>Desde</small>' + esc(p.precioDesde) + '</p>' : '') +
                    (vendido ? '' :
                    '<div class="project-actions">' +
                        '<a href="' + wa + '" target="_blank" rel="noopener" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i> Me interesa</a>' +
                        '<a href="' + info + '" class="btn btn-outline">Más información</a>' +
                    '</div>') +
                '</div>' +
            '</article>';
    }

    if (!data.length) {
        empty.hidden = false;
        filters.hidden = true;
        return;
    }

    grid.innerHTML = data.map(card).join('');

    // Ocultar filtros de estados sin proyectos
    filters.querySelectorAll('[data-filter]').forEach(function (b) {
        var f = b.getAttribute('data-filter');
        if (f !== 'todos' && !data.some(function (p) { return p.estado === f; })) b.hidden = true;
    });
    if (filters.querySelectorAll('[data-filter]:not([hidden])').length <= 2) filters.hidden = true;

    filters.addEventListener('click', function (e) {
        var b = e.target.closest('[data-filter]');
        if (!b) return;
        filters.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('active', c === b); });
        var f = b.getAttribute('data-filter');
        grid.querySelectorAll('.project-card').forEach(function (c) {
            c.hidden = f !== 'todos' && c.getAttribute('data-estado') !== f;
        });
    });
})();
