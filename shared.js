var TOOLS=[
  {name:"QR Generator",       file:"index.html",                     icon:"bi-qr-code",              cat:"QR Tools",   root:true},
  {name:"QR Scanner",         file:"tools/qr-scanner.html",          icon:"bi-qr-code-scan",         cat:"QR Tools"},
  {name:"Bulk QR",            file:"tools/bulk-qr.html",             icon:"bi-grid-3x3",             cat:"QR Tools"},
  {name:"Barcode Generator",  file:"tools/barcode.html",             icon:"bi-upc-scan",             cat:"QR Tools"},
  {name:"vCard QR",           file:"tools/vcard-qr.html",            icon:"bi-person-vcard",         cat:"QR Tools"},
  {name:"Image to QR",        file:"tools/image-to-qr.html",         icon:"bi-image",                cat:"QR Tools"},
  // // {name:"Business Card+QR",   file:"tools/business-card-qr.html",    icon:"bi-credit-card-2-front",  cat:"QR Tools"},
  // // {name:"Shop Hours QR",      file:"tools/shop-hours-qr.html",       icon:"bi-clock",                cat:"QR Tools"},
  // {name:"Image Compressor",   file:"tools/image-compressor.html",    icon:"bi-file-earmark-zip",     cat:"Image Tools"},
  {name:"Image Resizer",      file:"tools/image-resizer.html",       icon:"bi-aspect-ratio",         cat:"Image Tools"},
  // {name:"Image to PDF",       file:"tools/image-to-pdf.html",        icon:"bi-file-pdf",             cat:"Image Tools"},
  {name:"JPG to PNG",         file:"tools/jpg-to-png.html",          icon:"bi-arrow-left-right",     cat:"Image Tools"},
  {name:"Color Picker",       file:"tools/color-picker.html",        icon:"bi-palette",              cat:"Image Tools"},
  // {name:"Color Palette",      file:"tools/color-palette.html",       icon:"bi-palette2",             cat:"Image Tools"},
  {name:"CSS Gradient",       file:"tools/css-gradient.html",        icon:"bi-brush",                cat:"Image Tools"},
  {name:"Signature Maker",    file:"tools/signature-maker.html",     icon:"bi-pen",                  cat:"Image Tools"},
  {name:"Word Counter",       file:"tools/word-counter.html",        icon:"bi-fonts",                cat:"Text Tools"},
  {name:"Case Converter",     file:"tools/case-converter.html",      icon:"bi-type",                 cat:"Text Tools"},
  {name:"Lorem Ipsum",        file:"tools/lorem-ipsum.html",         icon:"bi-paragraph",            cat:"Text Tools"},
  {name:"Password Generator", file:"tools/password-generator.html",  icon:"bi-shield-lock",          cat:"Text Tools"},
  {name:"URL Encoder",        file:"tools/url-encoder.html",         icon:"bi-link-45deg",           cat:"Text Tools"},
  {name:"JSON Formatter",     file:"tools/json-formatter.html",      icon:"bi-braces",               cat:"Text Tools"},
  // {name:"Meta Tag Generator", file:"tools/meta-tag-generator.html",  icon:"bi-code-slash",           cat:"Text Tools"},
  // {name:"Robots.txt Maker",   file:"tools/robots-txt.html",          icon:"bi-robot",                cat:"Text Tools"},
  // {name:"RegEx Tester",       file:"tools/regex-tester.html",        icon:"bi-search",               cat:"Text Tools"},
  // {name:"Cron Generator",     file:"tools/cron-generator.html",      icon:"bi-clock-history",        cat:"Text Tools"},
  // {name:".htaccess Maker",    file:"tools/htaccess-generator.html",  icon:"bi-file-code",            cat:"Text Tools"},
  {name:"GST Calculator",     file:"tools/gst-calculator.html",      icon:"bi-percent",              cat:"Finance"},
  {name:"EMI Calculator",     file:"tools/emi-calculator.html",      icon:"bi-cash-stack",           cat:"Finance"},
  {name:"TDS Calculator",     file:"tools/tds-calculator.html",      icon:"bi-calculator",           cat:"Finance"},
  {name:"PPF Calculator",     file:"tools/ppf-calculator.html",      icon:"bi-piggy-bank",           cat:"Finance"},
  {name:"FD Calculator",      file:"tools/fd-calculator.html",       icon:"bi-bank",                 cat:"Finance"},
  {name:"Gratuity Calculator",file:"tools/gratuity-calculator.html", icon:"bi-award",                cat:"Finance"},
  {name:"NPS Calculator",     file:"tools/nps-calculator.html",      icon:"bi-graph-up",             cat:"Finance"},
  {name:"Form 16 Estimator",  file:"tools/form16-estimator.html",    icon:"bi-file-earmark-text",    cat:"Finance"},
  {name:"Invoice Generator",  file:"tools/invoice-generator.html",   icon:"bi-receipt",              cat:"Documents"},
  {name:"GST Invoice",        file:"tools/gst-invoice.html",         icon:"bi-receipt-cutoff",       cat:"Documents"},
  // {name:"Rent Receipt",       file:"tools/rent-receipt.html",        icon:"bi-house-door",           cat:"Documents"},
  {name:"Salary Slip",        file:"tools/salary-slip.html",         icon:"bi-file-person",          cat:"Documents"},
  {name:"Aadhaar Masking",    file:"tools/aadhaar-masking.html",     icon:"bi-shield-check",         cat:"Documents"},
  // {name:"NOC Generator",      file:"tools/noc-generator.html",       icon:"bi-file-earmark-check",   cat:"Documents"},
  // {name:"Experience Letter",  file:"tools/experience-letter.html",   icon:"bi-briefcase",            cat:"Documents"},
  // {name:"Quotation Maker",    file:"tools/quotation-maker.html",     icon:"bi-file-earmark-ruled",   cat:"Documents"},
  // {name:"Cheque Writer",      file:"tools/cheque-writer.html",       icon:"bi-check-square",         cat:"Documents"},
  {name:"Stamp Paper",        file:"tools/stamp-paper.html",         icon:"bi-file-earmark-stamp",   cat:"Documents"},
  {name:"UPI Deep Link",      file:"tools/upi-deeplink.html",        icon:"bi-phone",                cat:"Business"},
  {name:"IFSC Finder",        file:"tools/ifsc-finder.html",         icon:"bi-bank2",                cat:"Business"},
  {name:"Pincode Lookup",     file:"tools/pincode-lookup.html",      icon:"bi-geo-alt",              cat:"Business"},
  {name:"Age Calculator",     file:"tools/age-calculator.html",      icon:"bi-calendar-date",        cat:"Business"},
  {name:"Certificate Maker",  file:"tools/certificate-maker.html",   icon:"bi-patch-check",          cat:"Student"},
  {name:"Cover Page Maker",   file:"tools/cover-page-maker.html",    icon:"bi-journal-richtext",     cat:"Student"},
  {name:"Timetable Maker",    file:"tools/timetable-maker.html",     icon:"bi-table",                cat:"Student"},
  {name:"Pomodoro Timer",     file:"tools/pomodoro-timer.html",      icon:"bi-stopwatch",            cat:"Student"},
  {name:"Marksheet Generator",file:"tools/marksheet-generator.html", icon:"bi-bar-chart-line",       cat:"Student"},
];

function _base(){return window.location.pathname.includes('/tools/')? '../':'./'}

function _buildNav(){
  var b=_base(),cats=[],seen={};
  TOOLS.forEach(function(t){if(!seen[t.cat]){seen[t.cat]=1;cats.push(t.cat);}});
  var dds=cats.map(function(cat){
    var items=TOOLS.filter(function(t){return t.cat===cat;});
    var lis=items.map(function(t){
      return '<li><a class="dropdown-item" href="'+b+t.file+'"><i class="bi '+t.icon+' me-2"></i>'+t.name+'</a></li>';
    }).join('');
    return '<li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">'+cat+'</a><ul class="dropdown-menu cartoon-dropdown">'+lis+'</ul></li>';
  }).join('');
  return '<nav class="navbar navbar-expand-lg navbar-cartoon fixed-top"><div class="container-fluid px-3">'
    +'<a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="'+b+'index.html"><i class="bi bi-qr-code-scan" style="color:var(--primary);font-size:1.4rem;"></i><span style="color:var(--primary);font-size:1.15rem;">Online<strong>Qrs</strong></span></a>'
    +'<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain"><span class="navbar-toggler-icon"></span></button>'
    +'<div class="collapse navbar-collapse" id="navMain"><ul class="navbar-nav me-auto align-items-lg-center">'+dds+'</ul>'
    +'<ul class="navbar-nav align-items-lg-center ms-2">'
    +'<li class="nav-item"><a class="nav-link" href="'+b+'index.html#faq">FAQ</a></li>'
    +'<li class="nav-item"><a class="nav-link" href="'+b+'index.html#contact">Contact</a></li>'
    +'<li class="nav-item ms-1"><button id="themeToggle" class="btn btn-sm btn-theme"><i class="bi bi-moon"></i></button></li>'
    +'</ul></div></div></nav>';
}

function _buildFooter(){
  var b=_base();
  var quick=["QR Generator|index.html","Rent Receipt|tools/rent-receipt.html","Salary Slip|tools/salary-slip.html","GST Invoice|tools/gst-invoice.html","Aadhaar Masking|tools/aadhaar-masking.html","TDS Calculator|tools/tds-calculator.html","Signature Maker|tools/signature-maker.html","PPF Calculator|tools/ppf-calculator.html"];
  var links=quick.map(function(s){var p=s.split('|');return '<a href="'+b+p[1]+'" class="btn btn-link">'+p[0]+'</a>';}).join('');
  return '<footer class="site-footer py-4 mt-5"><div class="container">'
    +'<div class="row"><div class="col-md-4 mb-3 mb-md-0">'
    +'<div class="d-flex align-items-center gap-2 mb-2"><i class="bi bi-qr-code-scan" style="color:var(--primary);font-size:1.4rem;"></i><span style="color:var(--primary);font-weight:800;font-size:1.1rem;">OnlineQrs</span></div>'
    +'<p class="text-muted small mb-1">Privacy-first. No signup. 100% Free.</p>'
    +'<p class="text-muted small mb-0">53+ Free Tools — India ka #1 Free Toolkit</p></div>'
    +'<div class="col-md-8"><p class="fw-bold small mb-2" style="color:var(--primary);">Popular Tools</p><div class="d-flex flex-wrap">'+links+'</div></div></div>'
    +'<hr class="my-3"><div class="text-center"><p class="mb-0 small">&copy; 2026 OnlineQrs. All rights reserved.</p></div>'
    +'</div></footer>';
}

function _buildOtherTools(){
  var b=_base(),curr=window.location.pathname.split('/').pop();
  var filtered=TOOLS.filter(function(t){return t.file.split('/').pop()!==curr&&!t.root;});
  var tiles=filtered.sort(function(){return Math.random()-.5;}).slice(0,16).map(function(t){
    return '<a class="tool-tile" href="'+b+t.file+'"><i class="bi '+t.icon+'"></i><span>'+t.name+'</span></a>';
  }).join('');
  return '<section class="container py-4"><h5 class="mb-3" style="color:var(--primary);">Other Free Tools (53+)</h5><div class="tools-grid">'+tiles+'</div></section>';
}

function _initTheme(){
  try{if(localStorage.getItem('theme')==='dark')document.body.classList.add('dark');}catch(e){}
  document.addEventListener('click',function(e){
    var btn=e.target.closest('#themeToggle');if(!btn)return;
    var d=!document.body.classList.contains('dark');
    document.body.classList.toggle('dark',d);
    var ic=btn.querySelector('i');if(ic)ic.className=d?'bi bi-sun':'bi bi-moon';
    try{localStorage.setItem('theme',d?'dark':'light');}catch(e){}
  });
}

function _initBackToTop(){
  window.addEventListener('scroll',function(){var b=document.getElementById('backToTop');if(b)b.style.display=window.scrollY>400?'block':'none';},{passive:true});
  var b=document.getElementById('backToTop');
  if(b)b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
}

document.addEventListener('DOMContentLoaded',function(){
  document.body.insertAdjacentHTML('afterbegin','<div class="whatsapp-float"><a href="https://wa.me/918221077926" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i></a></div><button id="backToTop" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>');
  document.body.insertAdjacentHTML('afterbegin',_buildNav());
  var ph=document.getElementById('other-tools-placeholder');
  if(ph)ph.outerHTML=_buildOtherTools();
  document.body.insertAdjacentHTML('beforeend',_buildFooter());
  _initTheme();
  _initBackToTop();
});
