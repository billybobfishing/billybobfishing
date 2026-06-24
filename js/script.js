/* ============================================================
   Billy Bob Fishing Co. — site behavior (vanilla, no framework)
   Re-implements what the prototype runtime used to do:
   spec-sheet tabs, Buy Now modal, footer year, image fallback.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Vessel data (ported verbatim from the prototype) ---------- */
  var VESSELS = [
    {
      code: 'RB-120', short: 'Razorback Series', role: 'Heavy Sealift Platform',
      loa: '120.0 m',
      blurb: 'Bow-ramp logistics workhorse. Beaches like a flat-bottom johnboat, hauls like a freight train — and reverses off the sand under her own power.',
      specs: [
        { k: 'Length OA', v: '120.0 m' }, { k: 'Beam', v: '23.0 m' },
        { k: 'Payload', v: '1,200 t' }, { k: 'Bow Ramp', v: '8.5 m' },
        { k: 'Max Speed', v: '16 kn' }, { k: 'Range', v: '4,000 nm' },
        { k: 'Crew', v: '26' }, { k: 'Hull', v: 'Marine-grade Al' }
      ]
    },
    {
      code: 'SH-78', short: 'Shoat Series', role: 'Medium Sealift Platform',
      loa: '78.0 m',
      blurb: 'Shallow-draft logistics hauler. Half the displacement, twice the nimbleness — slips supplies up a creek a heavy hull would never fit, then backs off the mud on her own.',
      specs: [
        { k: 'Length OA', v: '78.0 m' }, { k: 'Beam', v: '15.4 m' },
        { k: 'Payload', v: '500 t' }, { k: 'Bow Ramp', v: '6.0 m' },
        { k: 'Max Speed', v: '20 kn' }, { k: 'Range', v: '3,200 nm' },
        { k: 'Crew', v: '18' }, { k: 'Hull', v: 'Marine-grade Al' }
      ]
    },
    {
      code: 'CT-440', short: 'Catahoula Series', role: 'Blue-Water Combatant',
      loa: '144.0 m',
      blurb: 'Multi-mission blue-water combatant. Air defense, anti-surface and anti-submarine — loyal and relentless as the Louisiana hound she\'s named for.',
      specs: [
        { k: 'Length OA', v: '144.0 m' }, { k: 'Beam', v: '18.0 m' },
        { k: 'Displacement', v: '4,200 t' }, { k: 'Max Speed', v: '28 kn' },
        { k: 'Range', v: '6,000 nm' }, { k: 'Crew', v: '120' },
        { k: 'Helo Deck', v: '1 × MH-60' }, { k: 'VLS Cells', v: '32' }
      ]
    },
    {
      code: 'MD-58', short: 'Mudbug Series', role: 'Littoral Sentinel',
      loa: '58.0 m',
      blurb: 'Small, ornery and everywhere at once — exactly like the crawfish she\'s named for. Twenty-eight days on station without a resupply.',
      specs: [
        { k: 'Length OA', v: '58.0 m' }, { k: 'Beam', v: '10.6 m' },
        { k: 'Displacement', v: '400 t' }, { k: 'Max Speed', v: '26 kn' },
        { k: 'Patrol Endurance', v: '28 days' }, { k: 'Range', v: '4,000 nm' },
        { k: 'Crew', v: '22' }, { k: 'Tenders', v: '2 × RHIB' }
      ]
    }
  ];
  var DEFAULT_VESSEL = 2; // CT-440 (flagship)

  /* ---------- Spec sheet ---------- */
  function initSpecSheet() {
    var tabsEl = document.getElementById('spec-tabs');
    var nameEl = document.getElementById('spec-name');
    var metaEl = document.getElementById('spec-meta');
    var blurbEl = document.getElementById('spec-blurb');
    var tableEl = document.getElementById('spec-table');
    var codeEl = document.getElementById('spec-blueprint-code');
    var loaEl = document.getElementById('spec-loa');
    if (!tabsEl || !tableEl) return;

    var activeIdx = DEFAULT_VESSEL;
    var tabButtons = [];

    function renderActive() {
      var v = VESSELS[activeIdx];
      nameEl.textContent = v.short;
      metaEl.textContent = v.code + ' · ' + v.role;
      blurbEl.textContent = v.blurb;
      codeEl.textContent = v.code;
      loaEl.textContent = v.loa;

      tableEl.textContent = '';
      v.specs.forEach(function (row) {
        var line = document.createElement('div');
        line.className = 'spec-row';
        var key = document.createElement('span');
        key.className = 'spec-row-key';
        key.textContent = row.k;
        var val = document.createElement('span');
        val.className = 'spec-row-val';
        val.textContent = row.v;
        line.appendChild(key);
        line.appendChild(val);
        tableEl.appendChild(line);
      });

      tabButtons.forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === activeIdx);
      });
    }

    VESSELS.forEach(function (v, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab';
      btn.textContent = v.code;
      btn.addEventListener('click', function () {
        activeIdx = i;
        renderActive();
      });
      tabsEl.appendChild(btn);
      tabButtons.push(btn);
    });

    renderActive();
  }

  /* ---------- Buy Now modal ---------- */
  function initModal() {
    var modal = document.getElementById('quote-modal');
    var formView = document.getElementById('quote-form');
    var successView = document.getElementById('quote-success');
    if (!modal) return;

    function open() {
      formView.hidden = false;
      successView.hidden = true;
      modal.hidden = false;
    }
    function close() {
      modal.hidden = true;
    }
    function showSuccess() {
      formView.hidden = true;
      successView.hidden = false;
    }

    document.querySelectorAll('.js-open-quote').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
    });

    // Backdrop + × close. Panel clicks are not in .js-close-quote, so they
    // don't bubble a close (the overlay is a separate element behind the panel).
    document.querySelectorAll('.js-close-quote').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        close();
      });
    });

    var submitForm = modal.querySelector('.js-quote-submit');
    if (submitForm) {
      submitForm.addEventListener('submit', function (e) {
        e.preventDefault(); // fictional form — nothing is sent
        showSuccess();
      });
    }

    // Escape closes the modal.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Image fallback ---------- */
  // Until real files exist in assets/images/, hide the broken <img> so the
  // diagonal-stripe placeholder behind it shows cleanly (no broken-image icon).
  function initImageFallback() {
    document.querySelectorAll('.slot-img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.display = 'none';
      });
      // Catch images that already failed before this handler attached.
      if (img.complete && img.naturalWidth === 0) {
        img.style.display = 'none';
      }
    });
  }

  initSpecSheet();
  initModal();
  initYear();
  initImageFallback();
})();
