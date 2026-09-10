/* =============================================================================
   MEDIA — monta <picture> com WebP e fallback JPG
   -----------------------------------------------------------------------------
   As fotos originais têm 1440px e o site normalmente as exibe bem menores.
   As versões WebP em assets/img/gallery/w720/ (e w1440/ para as fotos grandes)
   são geradas por  python ferramentas/gerar-webp.py  e pesam cerca de 1/4 do
   JPG. O JPG continua como fallback e é o arquivo aberto no lightbox.

   Uso:
     GHR.pic({ src:'ghr-209.jpg', alt:'…', sizes:'(max-width:820px) 50vw, 25vw' })
     GHR.pic({ src:'ghr-143.jpg', alt:'…', grande:true, eager:true })
     GHR.pic({ src:'ghr-186.jpg', alt:'…', pos:'50% 45%' })   enquadramento

   `pos` vira object-position: as fotos são quadradas ou 4:5 e os containers
   têm proporções diferentes, então às vezes o corte padrão (centro) tira a
   parte que interessa. Use só quando o centro não funcionar.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.pic = function (o) {
  const b = GHR.base + 'assets/img/gallery/';
  const webp = o.src.replace(/\.jpg$/i, '.webp');

  const fontes = [`${b}w720/${webp} 720w`];
  if (o.grande) fontes.push(`${b}w1440/${webp} 1440w`);

  const sizes = o.sizes ? ` sizes="${o.sizes}"` : '';
  const cls   = o.cls ? ` class="${o.cls}"` : '';
  const pos   = o.pos ? ` style="object-position:${o.pos}"` : '';
  const carga = o.eager
    ? ' fetchpriority="high" decoding="async"'
    : ' loading="lazy" decoding="async"';

  return `<picture>
      <source type="image/webp" srcset="${fontes.join(', ')}"${sizes}>
      <img src="${b}${o.src}" alt="${o.alt || ''}"${cls}${pos}${carga}
           width="${o.w || 1440}" height="${o.h || 1440}">
    </picture>`;
};
