// Chat en vivo con una persona (Impulsor Ventor). Uso: <script src="vivo.js"></script> (usa window.__E o ?e=)
(function(){
  var API="https://rhdsbymoxllfegderalu.supabase.co/functions/v1/ventor-contacto",KEY="sb_publishable_p0-ZWH8XPPyC_KSTOzG9vw_OENVq8o-";
  var Q=new URLSearchParams(location.search),E=String(window.__E||Q.get("e")||"").toLowerCase();
  if(!E||Q.get("mesa"))return;
  if(window.self!==window.top||document.getElementById("vvb"))return;
  var LS="vt_vivo_"+E,cod="",n=0,abierto=false,timer=null,busy=false;
  try{cod=localStorage.getItem(LS)||""}catch(e){}
  function api(a,d){return fetch(API,{method:"POST",headers:{"Content-Type":"application/json",apikey:KEY},body:JSON.stringify(Object.assign({accion:a,e:E},d))}).then(function(r){return r.json().then(function(j){if(!r.ok){var e=new Error(j.error||"Error");e.cerrado=j.cerrado;throw e}return j})})}
  var st=document.createElement("style");st.textContent="#vvb{position:fixed;left:14px;bottom:84px;z-index:50;background:#16a34a;color:#fff;border:0;border-radius:26px;padding:12px 16px;font:600 14px system-ui;box-shadow:0 4px 14px rgba(0,0,0,.3);cursor:pointer}#vvp{position:fixed;left:10px;right:10px;bottom:10px;max-width:420px;height:72vh;max-height:560px;z-index:61;background:#fff;color:#111;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;font:14px system-ui}#vvp header{background:#16a34a;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;font-weight:600}#vvm{flex:1;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px;background:#f4f4f5}.vvy,.vva{max-width:85%;padding:8px 11px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word}.vvy{align-self:flex-end;background:#16a34a;color:#fff}.vva{align-self:flex-start;background:#fff;border:1px solid #e4e4e7}.vvs{align-self:center;font-size:12px;color:#777;text-align:center}#vvf{display:flex;gap:6px;padding:8px;border-top:1px solid #e4e4e7;background:#fff}#vvf input{flex:1;border:1px solid #d4d4d8;border-radius:10px;padding:9px;font-size:15px}#vvf button{background:#16a34a;color:#fff;border:0;border-radius:10px;padding:0 14px;font-weight:600}#vvi{padding:10px;background:#fff;display:flex;flex-direction:column;gap:6px}#vvi input{border:1px solid #d4d4d8;border-radius:10px;padding:9px;font-size:15px}";
  document.head.appendChild(st);
  var b=document.createElement("button");b.id="vvb";b.textContent="🧑 Chat en vivo";
  var p=document.createElement("div");p.id="vvp";p.innerHTML='<header><span>Chat con una persona</span><span id="vvx" style="cursor:pointer;font-size:20px">✕</span></header><div id="vvm"></div><form id="vvf"><input id="vvt" maxlength="500" placeholder="Escribe tu mensaje..." autocomplete="off"><button>Enviar</button></form>';
  document.body.appendChild(b);document.body.appendChild(p);
  function M(){return document.getElementById("vvm")}
  function add(c,t){var d=document.createElement("div");d.className=c;d.textContent=t;M().appendChild(d);M().scrollTop=M().scrollHeight}
  function intro(){M().innerHTML="";add("vvs","Escríbenos y una persona te responde por aquí. Si no estamos conectados, te contestamos en cuanto podamos (esta ventana se actualiza sola).")}
  function poll(){if(!cod||!abierto)return;api("chat_leer",{c:cod,desde:n}).then(function(j){(j.mensajes||[]).forEach(function(m){if(m.de==="a")add("vva",m.t);else if(!M().querySelector('[data-n="'+(n)+'"]')){}});n=j.total;if(j.estado==="cerrado"){add("vvs","La conversación fue cerrada. Gracias por escribirnos.");try{localStorage.removeItem(LS)}catch(e){}cod="";clearInterval(timer)}}).catch(function(){})}
  function cargarTodo(){api("chat_leer",{c:cod,desde:0}).then(function(j){M().innerHTML="";(j.mensajes||[]).forEach(function(m){add(m.de==="a"?"vva":"vvy",m.t)});n=j.total;if(j.estado==="cerrado"){try{localStorage.removeItem(LS)}catch(e){}cod="";intro()}}).catch(function(){cod="";try{localStorage.removeItem(LS)}catch(e){}intro()})}
  function abrir(v){abierto=v;p.style.display=v?"flex":"none";b.style.display=v?"none":"block";clearInterval(timer);if(v){if(cod)cargarTodo();else intro();timer=setInterval(poll,3000);document.getElementById("vvt").focus()}}
  b.onclick=function(){abrir(true)};document.getElementById("vvx").onclick=function(){abrir(false)};
  document.getElementById("vvf").onsubmit=function(ev){ev.preventDefault();if(busy)return;var inp=document.getElementById("vvt"),t=inp.value.trim();if(!t)return;
    if(!cod&&!window.__vvNom){var nm=prompt("¿Cómo te llamas? (para que te atiendan por tu nombre)");window.__vvNom=nm||"Visitante"}
    busy=true;inp.value="";add("vvy",t);
    var q=cod?api("chat_enviar",{c:cod,texto:t}).then(function(j){n=Math.max(n,0)}):api("chat_iniciar",{nombre:window.__vvNom,texto:t,origen:location.pathname.replace(/^.*\//,"")}).then(function(j){cod=j.codigo;try{localStorage.setItem(LS,cod)}catch(e){}});
    q.then(function(){busy=false;api("chat_leer",{c:cod,desde:0}).then(function(j){n=j.total})}).catch(function(e){busy=false;add("vvs","No se pudo enviar: "+e.message);if(e.cerrado){cod="";try{localStorage.removeItem(LS)}catch(x){}}})};
})();
