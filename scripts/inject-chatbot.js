const fs = require("fs");
const path = require("path");

function widget({ title, greeting }) {
  return `
<style>
  .cw-widget{position:fixed;bottom:26px;right:26px;z-index:9998;display:flex;flex-direction:column;align-items:flex-end;gap:16px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
  .cw-bubble{width:58px;height:58px;border-radius:18px;border:none;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(124,58,237,0.4);transition:transform 250ms ease;font-size:26px;}
  .cw-bubble:hover{transform:scale(1.08);}
  .cw-panel{display:none;flex-direction:column;width:360px;max-width:calc(100vw - 48px);height:480px;max-height:70vh;background:#14141c;border:1px solid rgba(255,255,255,0.14);border-radius:24px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.5);color:#f4f4f6;}
  .cw-panel.open{display:flex;}
  .cw-header{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);}
  .cw-header-info{display:flex;align-items:center;gap:12px;}
  .cw-avatar{width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#7c3aed,#06b6d4);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;flex-shrink:0;}
  .cw-title{font-weight:700;font-size:13.5px;}
  .cw-status{font-size:11.5px;color:rgba(244,244,246,0.6);display:flex;align-items:center;gap:6px;margin-top:2px;}
  .cw-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;}
  .cw-close{background:none;border:none;color:rgba(244,244,246,0.6);cursor:pointer;padding:4px;font-size:16px;line-height:1;}
  .cw-close:hover{color:#f4f4f6;}
  .cw-messages{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;}
  .cw-msg{max-width:85%;padding:11px 14px;border-radius:14px;font-size:13.5px;line-height:1.5;white-space:pre-wrap;}
  .cw-msg.bot{background:rgba(255,255,255,0.05);color:#f4f4f6;align-self:flex-start;border-bottom-left-radius:4px;}
  .cw-msg.user{background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}
  .cw-msg.typing{display:flex;gap:4px;align-items:center;padding:13px 16px;}
  .cw-msg.typing span{width:6px;height:6px;border-radius:50%;background:rgba(244,244,246,0.6);animation:cwTyping 1.2s infinite ease-in-out;}
  .cw-msg.typing span:nth-child(2){animation-delay:0.15s;}
  .cw-msg.typing span:nth-child(3){animation-delay:0.3s;}
  @keyframes cwTyping{0%,60%,100%{opacity:0.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-3px);}}
  .cw-input-row{display:flex;gap:8px;padding:14px;border-top:1px solid rgba(255,255,255,0.08);}
  .cw-input-row input{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.14);border-radius:12px;padding:11px 14px;color:#f4f4f6;font-family:inherit;font-size:13.5px;outline:none;transition:border-color 250ms ease;}
  .cw-input-row input:focus{border-color:#7c3aed;}
  .cw-send{width:40px;height:40px;border-radius:12px;border:none;cursor:pointer;flex-shrink:0;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;display:flex;align-items:center;justify-content:center;transition:transform 200ms ease;font-size:16px;}
  .cw-send:hover{transform:scale(1.06);}
  .cw-send:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
  .cw-footnote{font-size:10.5px;color:rgba(244,244,246,0.45);text-align:center;padding:0 14px 14px;}
  @media (max-width:480px){.cw-widget{bottom:16px;right:16px;}.cw-panel{width:calc(100vw - 32px);}}
</style>
<div class="cw-widget" data-chat-widget="1">
  <div class="cw-panel" id="cwPanel">
    <div class="cw-header">
      <div class="cw-header-info">
        <div class="cw-avatar">🤖</div>
        <div>
          <div class="cw-title">${title}</div>
          <div class="cw-status"><span class="cw-dot"></span>En ligne</div>
        </div>
      </div>
      <button type="button" class="cw-close" id="cwClose" aria-label="Fermer le chat">✕</button>
    </div>
    <div class="cw-messages" id="cwMessages"></div>
    <div class="cw-input-row">
      <input type="text" id="cwInput" placeholder="Posez votre question…" autocomplete="off" aria-label="Votre message">
      <button type="button" class="cw-send" id="cwSend" aria-label="Envoyer">↑</button>
    </div>
    <div class="cw-footnote">Réponses automatiques — pour une commande, utilisez les formulaires du site.</div>
  </div>
  <button type="button" class="cw-bubble" id="cwBubble" aria-label="Ouvrir l'assistant">💬</button>
</div>
<script>
(function(){
  var bubble = document.getElementById('cwBubble');
  var panel = document.getElementById('cwPanel');
  var closeBtn = document.getElementById('cwClose');
  var messages = document.getElementById('cwMessages');
  var input = document.getElementById('cwInput');
  var sendBtn = document.getElementById('cwSend');
  var history = [];
  var opened = false;

  function addMessage(role, text){
    var div = document.createElement('div');
    div.className = 'cw-msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function showTyping(){
    var div = document.createElement('div');
    div.className = 'cw-msg bot typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  bubble.addEventListener('click', function(){
    panel.classList.add('open');
    if(!opened){
      opened = true;
      addMessage('bot', ${JSON.stringify(greeting)});
    }
    input.focus();
  });

  closeBtn.addEventListener('click', function(){
    panel.classList.remove('open');
  });

  function sendMessage(){
    var text = input.value.trim();
    if(!text) return;
    input.value = '';
    sendBtn.disabled = true;
    addMessage('user', text);
    history.push({role:'user', content:text});
    var typingEl = showTyping();
    fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({messages:history})
    }).then(function(res){
      if(!res.ok) throw new Error('API error');
      return res.json();
    }).then(function(data){
      var block = (data.content || []).find(function(c){ return c.type === 'text'; });
      var reply = block ? block.text : "Désolé, je n'ai pas pu formuler de réponse.";
      typingEl.remove();
      addMessage('bot', reply);
      history.push({role:'assistant', content:reply});
    }).catch(function(){
      typingEl.remove();
      addMessage('bot', "Je ne suis pas joignable pour le moment. Écrivez-nous directement à contact@bdfproduction.fr.");
    }).finally(function(){
      sendBtn.disabled = false;
    });
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){ e.preventDefault(); sendMessage(); }
  });
})();
</script>
`;
}

const root = path.join(__dirname, "..");
const dir = path.join(root, "public/bdf-production");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));

const fragment = widget({
  title: "Assistant BDF Production",
  greeting:
    "Bonjour ! Je suis l'assistant de BDF Production. Une question sur la location de matériel, les prestations photo/vidéo, nos flyers ou nos parfums ?",
});

for (const f of files) {
  const filePath = path.join(dir, f);
  let html = fs.readFileSync(filePath, "utf8");
  if (html.includes("data-chat-widget")) continue;
  html = html.replace(/<\/body>/, `${fragment}\n</body>`);
  fs.writeFileSync(filePath, html, "utf8");
  console.log("Chatbot injected into", f);
}
