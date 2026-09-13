/* =============================================================================
   LOADER — único <script> que cada página precisa incluir.
   -----------------------------------------------------------------------------
   Carrega dados e componentes na ordem correta (async=false preserva a ordem
   mesmo com os scripts inseridos por JavaScript).
   Para acrescentar um componente novo, basta incluir o arquivo nesta lista.
   ========================================================================== */

(function () {
  var base = document.documentElement.dataset.base || '';

  /* Versão dos arquivos. Entra como ?v= no fim de cada URL para o navegador
     buscar a versão nova em vez de reaproveitar a antiga do cache.
     Depois de alterar CSS ou JS, rode:  python ferramentas/bump-versao.py     */
  var VERSAO = '21';

  var arquivos = [
    /* dados — é aqui que o conteúdo do site é editado */
    'data/business.js',
    'data/services.js',
    'data/brands.js',
    'data/gallery.js',
    'data/home.js',
    'data/partners.js',
    /* componentes */
    'components/icons.js',
    'components/media.js',
    'components/header.js',
    'components/footer.js',
    'components/brands-marquee.js',
    'components/services.js',
    'components/sections.js',
    'components/lightbox.js',
    'components/gallery.js',
    'components/contact.js',
    'components/hours-map.js',
    'components/partners.js',
    /* inicialização */
    'app.js'
  ];

  arquivos.forEach(function (f) {
    var s = document.createElement('script');
    s.src = base + 'assets/js/' + f + '?v=' + VERSAO;
    s.async = false;                 // mantém a ordem de execução
    document.head.appendChild(s);
  });
})();
