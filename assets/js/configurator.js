// ===== CONFIGURATOR LOGIC =====
const PLATFORMS = { tiktok:{price:3500,name:'TikTok',icon:'🎵'}, instagram:{price:3000,name:'Instagram',icon:'📸'}, facebook:{price:2500,name:'Facebook',icon:'👥'}, youtube:{price:5000,name:'YouTube',icon:'▶️'} };
const CONTENT_TYPES = { video:{mult:1.0,name:'Vidéo / Reels'}, photo:{mult:0.6,name:'Photo / Carrousel'}, story:{mult:0.5,name:'Stories'}, live:{mult:1.4,name:'Live / Podcast'} };
const NICHES = { mode:'Mode & Lifestyle',food:'Food & Restauration',beaute:'Beauté & Bien-être',business:'Business & Finance',sport:'Sport & Fitness',tech:'Tech & Innovation',education:'Éducation & Formation',immobilier:'Immobilier',voyage:'Voyage & Tourisme',musique:'Musique & Entertainment',autre:'Autre / Général' };

let selectedNetworks = new Set();
let selectedType = null;
let duration = 30;
let quantity = 4;

function getDurationMult(sec) {
  if(sec<=30) return {m:1.0,label:'Court format',cat:'≤30s'};
  if(sec<=60) return {m:1.3,label:'Format court',cat:'31–60s'};
  if(sec<=180) return {m:1.7,label:'Format moyen',cat:'1–3min'};
  if(sec<=360) return {m:2.2,label:'Long format',cat:'3–6min'};
  return {m:3.0,label:'Très long format',cat:'6–10min'};
}

function formatDur(sec){
  if(sec<60) return sec+'s';
  const m=Math.floor(sec/60),s=sec%60;
  return s ? m+'min'+s+'s' : m+' min';
}

function formatPrice(n){ return n.toLocaleString('fr-FR') + ' FCFA'; }

function calcPrice(){
  if(selectedNetworks.size===0||!selectedType) return null;
  const typeMult = CONTENT_TYPES[selectedType].mult;
  const {m: durM} = getDurationMult(duration);
  let total = 0;
  selectedNetworks.forEach(net => { total += PLATFORMS[net].price * typeMult * durM * quantity; });
  return Math.round(total);
}

function updateSummary(){
  // Networks
  const netEl = document.getElementById('summaryNetworks');
  if (!netEl) return;
  if(selectedNetworks.size===0){ netEl.innerHTML='<span style="font-size:.78rem;color:var(--grey);font-style:italic;">Aucune sélectionnée</span>'; }
  else { netEl.innerHTML='<div class="platform-pills">' + [...selectedNetworks].map(n=>`<span class="platform-pill">${PLATFORMS[n].icon} ${PLATFORMS[n].name}</span>`).join('') + '</div>'; }

  // Type
  document.getElementById('summaryType').textContent = selectedType ? CONTENT_TYPES[selectedType].name : '—';
  // Niche
  const nicheSelect = document.getElementById('nicheSelect');
  const nv = nicheSelect ? nicheSelect.value : "";
  document.getElementById('summaryNiche').textContent = nv ? NICHES[nv]||'—' : '—';
  // Duration
  document.getElementById('summaryDur').textContent = formatDur(duration);
  // Qty
  document.getElementById('summaryQty').textContent = quantity + ' posts / mois';

  // Mults
  const {m:dm,label:dlabel} = getDurationMult(duration);
  const tm = selectedType ? CONTENT_TYPES[selectedType].mult : 1.0;
  document.getElementById('durMult').textContent = '×' + dm.toFixed(1) + ' (' + dlabel + ')';
  document.getElementById('typeMult').textContent = '×' + tm.toFixed(1);

  // Price
  const price = calcPrice();
  const priceEl = document.getElementById('totalPrice');
  const breakEl = document.getElementById('priceBreak');
  const orderBtn = document.getElementById('orderBtn');
  if(price !== null){
    priceEl.innerHTML = '<strong>' + formatPrice(price) + '</strong>';
    const perPost = Math.round(price/quantity);
    breakEl.textContent = `${formatPrice(perPost)} / post × ${quantity} posts × ${selectedNetworks.size} plateforme(s)`;
    if (orderBtn) orderBtn.disabled = false;
  } else {
    priceEl.innerHTML = '<span class="price-currency">—</span>';
    breakEl.textContent = 'Sélectionnez au moins un réseau et un type de contenu';
    if (orderBtn) orderBtn.disabled = true;
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Network chips
    document.querySelectorAll('.chip').forEach(chip=>{
      chip.addEventListener('click',()=>{
        const net = chip.dataset.network;
        if(selectedNetworks.has(net)){selectedNetworks.delete(net);chip.classList.remove('selected');}
        else{selectedNetworks.add(net);chip.classList.add('selected');}
        updateSummary();
      });
    });

    // Content types
    document.querySelectorAll('.content-type-card').forEach(card=>{
      card.addEventListener('click',()=>{
        document.querySelectorAll('.content-type-card').forEach(c=>c.classList.remove('selected'));
        card.classList.add('selected');
        selectedType = card.dataset.type;
        updateSummary();
      });
    });

    // Niche
    const nicheSelect = document.getElementById('nicheSelect');
    if (nicheSelect) nicheSelect.addEventListener('change', updateSummary);

    // Duration slider
    const slider = document.getElementById('durationSlider');
    if (slider) {
        slider.addEventListener('input',()=>{
          duration = parseInt(slider.value);
          document.getElementById('durVal').textContent = duration < 60 ? duration : formatDur(duration);
          const unit = duration < 60 ? 'secondes' : '';
          const unitEl = document.querySelector('.duration-unit');
          if (unitEl) unitEl.textContent = unit;
          const durCatEl = document.getElementById('durCategory');
          if (durCatEl) durCatEl.textContent = getDurationMult(duration).label;
          const pct = ((duration-15)/(600-15)*100).toFixed(1) + '%';
          slider.style.setProperty('--pct', pct);
          updateSummary();
        });
        slider.style.setProperty('--pct','2.5%');
    }

    // Qty
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyVal = document.getElementById('qtyVal');
    if (qtyMinus) {
        qtyMinus.addEventListener('click',()=>{ if(quantity>1){quantity--; qtyVal.textContent=quantity;updateSummary();} });
    }
    if (qtyPlus) {
        qtyPlus.addEventListener('click',()=>{ if(quantity<30){quantity++; qtyVal.textContent=quantity;updateSummary();} });
    }

    // ORDER
    const orderBtn = document.getElementById('orderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click',()=>{
          const price = calcPrice();
          if(!price) return;
          const nets = [...selectedNetworks].map(n=>PLATFORMS[n].name).join(', ');
          const type = CONTENT_TYPES[selectedType].name;
          const nv = document.getElementById('nicheSelect').value;
          const niche = NICHES[nv] || 'Non précisé';
          document.getElementById('modalDetail').innerHTML = `
            <strong>Plateformes :</strong> ${nets}<br>
            <strong>Type de contenu :</strong> ${type}<br>
            <strong>Niche :</strong> ${niche}<br>
            <strong>Durée :</strong> ${formatDur(duration)}<br>
            <strong>Fréquence :</strong> ${quantity} posts / mois<br>
            <strong>Prix estimé :</strong> ${formatPrice(price)}
          `;
          document.getElementById('modalOverlay').classList.add('open');
        });
    }
    const modalClose = document.getElementById('modalClose');
    if (modalClose) modalClose.addEventListener('click',()=>document.getElementById('modalOverlay').classList.remove('open'));
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.addEventListener('click',e=>{ if(e.target===e.currentTarget) e.currentTarget.classList.remove('open'); });
});
