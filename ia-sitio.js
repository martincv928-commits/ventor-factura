// Asistente virtual del sitio web (IA). Uso: <script src="ia-sitio.js"></script> (usa window.__E o ?e=)
(function(){
  var API="https://rhdsbymoxllfegderalu.supabase.co/functions/v1/ventor-chat",KEY="sb_publishable_p0-ZWH8XPPyC_KSTOzG9vw_OENVq8o-";
  var Q=new URLSearchParams(location.search),E=String(window.__E||Q.get("e")||"").toLowerCase();
  if(!E||Q.get("mesa")||window.self!==window.top||document.getElementById("vib"))return;
  var hist=[],busy=false,nombre="";
  var st=document.createElement("style");
  st.textContent="#vib{position:fixed;right:14px;bottom:84px;z-index:50;background:#111;color:#fff;border:0;border-radius:26px;padding:12px 16px;font:600 14px system-ui;box-shadow:0 4px 14px rgba(0,0,0,.3);cursor:pointer}#vip{position:fixed;right:10px;left:10px;bottom:10px;max-width:420px;margin-left:auto;height:70vh;max-height:560px;z-index:60;background:#fff;color:#111;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;font:14px system-ui}#vip header{background:#111;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:600}#vim{flex:1;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px;background:#f4f4f5}.viy,.vib2{max-width:85%;padding:8px 11px;border-radius:12px;line-height:1.35;white-space:pre-wrap;word-wrap:break-word}.viy{align-self:flex-end;background:#111;color:#fff}.vib2{align-self:flex-start;background:#fff;border:1px solid #e4e4e7}.vic{align-self:flex-start;background:#fff;border:1px solid #e4e4e7;border-radius:10px;padding:6px 8px;font-size:13px}#vif{display:flex;gap:6px;padding:8px;border-top:1px solid #e4e4e7;background:#fff}#vif input{flex:1;border:1px solid #d4d4d8;border-radius:10px;padding:9px;font-size:15px}#vif button{background:#111;color:#fff;border:0;border-radius:10px;padding:0 14px;font-weight:600}";
  document.head.appendChild(st);
  var btn=document.createElement("button");btn.id="vib";btn.textContent="💬 Pregúntanos";btn.style.display="none";
  var pan=document.createElement("div");pan.id="vip";
  pan.innerHTML='<header><span id="vit">Asistente</span><span id="vix" style="cursor:pointer;font-size:20px">✕</span></header><div id="vim"></div><form id="vif"><input id="vii" maxlength="300" placeholder="Escribe tu pregunta..." autocomplete="off"><button>Enviar</button></form>';
  document.body.appendChild(btn);document.body.appendChild(pan);
  function M(){return document.getElementById("vim")}
  function add(c,t){var d=document.createElement("div");d.className=c;d.textContent=t;M().appendChild(d);M().scrollTop=M().scrollHeight;return d}
  function call(b){return fetch(API,{method:"POST",headers:{"Content-Type":"application/json",apikey:KEY},body:JSON.stringify(Object.assign({e:E,canal:"sitio"},b))}).then(function(r){return r.json()}).catch(function(){return{error:"Sin respuesta"}})}
  function abrir(v){pan.style.display=v?"flex":"none";btn.style.display=v?"none":"block";if(v)document.getElementById("vii").focus()}
  btn.onclick=function(){abrir(true)};document.getElementById("vix").onclick=function(){abrir(false)};
  document.getElementById("vif").onsubmit=function(ev){ev.preventDefault();if(busy)return;var inp=document.getElementById("vii"),t=inp.value.trim().slice(0,300);if(!t)return;
    inp.value="";add("viy",t);hist.push({r:"yo",t:t});hist=hist.slice(-8);busy=true;var w=add("vib2","...");
    call({mensajes:hist}).then(function(j){
      if(j.error){w.textContent=j.limite?"Has llegado al límite de mensajes por ahora. Intenta más tarde o escríbenos por WhatsApp.":"No pude responder ahora. Intenta de nuevo en un momento.";hist.pop()}
      else{w.textContent=j.respuesta||"...";hist.push({r:"bot",t:j.respuesta||""});hist=hist.slice(-8);(j.productos||[]).slice(0,4).forEach(function(p){add("vic",p.nombre+" · $"+Number(p.precio).toFixed(2))})}
      busy=false})};
  call({accion:"estado"}).then(function(j){if(j&&j.habilitado){nombre=j.nombre||"";document.getElementById("vit").textContent="Asistente de "+(nombre||"nuestro sitio");btn.style.display="block";add("vib2","¡Hola! Soy el asistente virtual"+(nombre?" de "+nombre:"")+". Pregúntame lo que necesites sobre nuestros servicios, horarios o productos.")}});
})();
