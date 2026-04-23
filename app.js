// ============================================================
// Troque pela URL do seu backend no Render após o deploy
// ============================================================
const API_BASE = 'https://farmacia-backend-4rfz.onrender.com';
const CLIENTES_URL = `${API_BASE}/api/clientes`;
const RECEITAS_URL = `${API_BASE}/api/receitas`;

// ============================================================
// Tabs
// ============================================================
const tabConfig = {
  clientes: { title: 'Clientes',        sub: 'Gerencie os clientes da farmácia',       btnLabel: '+ Novo Cliente' },
  receitas: { title: 'Receitas Médicas', sub: 'Gerencie as receitas dos clientes',      btnLabel: '+ Nova Receita' },
};

document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['clientes', 'receitas'].forEach(t =>
      document.getElementById(`tab-${t}`).classList.toggle('hidden', t !== tab)
    );
    document.getElementById('page-title').textContent = tabConfig[tab].title;
    document.getElementById('page-sub').textContent   = tabConfig[tab].sub;
    document.getElementById('btn-new').textContent    = tabConfig[tab].btnLabel;
    if (tab === 'receitas') { loadClienteOptions(); loadReceitas(); }
  });
});

document.getElementById('btn-new').addEventListener('click', () => {
  const active = document.querySelector('[data-tab].active').dataset.tab;
  if (active === 'clientes') { clearClienteForm(); showClienteForm(); }
  else { clearReceitaForm(); showReceitaForm(); }
});

// ============================================================
// Utilitários
// ============================================================
const fmtDate = d => d ? new Date(d).toLocaleDateString('pt-BR') : '—';
function showMsg(id, text, isError = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.style.color = isError ? '#dc2626' : '#16a34a';
  setTimeout(() => el.textContent = '', 3500);
}
function badgeClass(status) {
  return { Pendente: 'badge-pendente', Dispensada: 'badge-dispensada', Vencida: 'badge-vencida', Cancelada: 'badge-cancelada' }[status] || '';
}

// ============================================================
// CLIENTES
// ============================================================
const clienteForm     = document.getElementById('cliente-form');
const clienteIdInput  = document.getElementById('cliente-id');
const clienteFormCard = document.getElementById('cliente-form-card');

function showClienteForm() { clienteFormCard.classList.remove('hidden'); clienteFormCard.scrollIntoView({ behavior: 'smooth' }); }
function hideClienteForm() { clienteFormCard.classList.add('hidden'); }

function clearClienteForm() {
  clienteForm.reset();
  clienteIdInput.value = '';
  document.getElementById('cliente-form-title').textContent = 'Novo Cliente';
}

document.getElementById('close-cliente-form').addEventListener('click', () => { hideClienteForm(); clearClienteForm(); });
document.getElementById('cancel-cliente').addEventListener('click', () => { hideClienteForm(); clearClienteForm(); });

async function loadClientes(search = '') {
  const url = search ? `${CLIENTES_URL}?search=${encodeURIComponent(search)}` : CLIENTES_URL;
  const res      = await fetch(url);
  const clientes = await res.json();
  const list     = document.getElementById('clientes-list');

  if (!clientes.length) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">👥</div><p>Nenhum cliente encontrado.</p></div>`;
    return;
  }

  list.innerHTML = clientes.map(c => `
    <div class="list-item">
      <div class="item-info">
        <span class="mono">${c.cpf}</span>
        <h3>${c.nome}</h3>
        ${c.telefone ? `<p>📞 ${c.telefone}</p>` : ''}
        ${c.email    ? `<p>✉️ ${c.email}</p>`    : ''}
        <p>🎂 ${fmtDate(c.dataNascimento)}</p>
        ${c.endereco ? `<p>📍 ${c.endereco}</p>` : ''}
      </div>
      <div class="item-actions">
        <button class="btn-edit"   onclick="editCliente('${c._id}')">Editar</button>
        <button class="btn-delete" onclick="deleteCliente('${c._id}')">Excluir</button>
      </div>
    </div>`).join('');
}

window.editCliente = async function(id) {
  const res = await fetch(`${CLIENTES_URL}/${id}`);
  const c   = await res.json();
  clienteIdInput.value = c._id;
  document.getElementById('cliente-nome').value          = c.nome;
  document.getElementById('cliente-cpf').value           = c.cpf;
  document.getElementById('cliente-telefone').value      = c.telefone || '';
  document.getElementById('cliente-email').value         = c.email || '';
  document.getElementById('cliente-dataNascimento').value= c.dataNascimento?.slice(0,10) || '';
  document.getElementById('cliente-endereco').value      = c.endereco || '';
  document.getElementById('cliente-form-title').textContent = 'Editar Cliente';
  showClienteForm();
};

window.deleteCliente = async function(id) {
  if (!confirm('Deseja excluir este cliente?')) return;
  const res  = await fetch(`${CLIENTES_URL}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  showMsg('cliente-message', data.message, !res.ok);
  loadClientes();
};

clienteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id   = clienteIdInput.value;
  const body = {
    nome:          document.getElementById('cliente-nome').value,
    cpf:           document.getElementById('cliente-cpf').value,
    telefone:      document.getElementById('cliente-telefone').value,
    email:         document.getElementById('cliente-email').value,
    dataNascimento:document.getElementById('cliente-dataNascimento').value,
    endereco:      document.getElementById('cliente-endereco').value,
  };
  const res  = await fetch(id ? `${CLIENTES_URL}/${id}` : CLIENTES_URL, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) { showMsg('cliente-message', data.message, true); return; }
  showMsg('cliente-message', id ? 'Cliente atualizado!' : 'Cliente cadastrado!');
  hideClienteForm();
  clearClienteForm();
  loadClientes();
});

let searchTimeout;
document.getElementById('search-cliente').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => loadClientes(e.target.value), 400);
});

// ============================================================
// RECEITAS
// ============================================================
const receitaForm     = document.getElementById('receita-form');
const receitaIdInput  = document.getElementById('receita-id');
const receitaFormCard = document.getElementById('receita-form-card');

function showReceitaForm() { receitaFormCard.classList.remove('hidden'); receitaFormCard.scrollIntoView({ behavior: 'smooth' }); }
function hideReceitaForm() { receitaFormCard.classList.add('hidden'); }

function clearReceitaForm() {
  receitaForm.reset();
  receitaIdInput.value = '';
  document.getElementById('receita-form-title').textContent = 'Nova Receita';
  document.getElementById('receita-dataEmissao').value = new Date().toISOString().slice(0,10);
}

document.getElementById('close-receita-form').addEventListener('click', () => { hideReceitaForm(); clearReceitaForm(); });
document.getElementById('cancel-receita').addEventListener('click', () => { hideReceitaForm(); clearReceitaForm(); });

async function loadClienteOptions() {
  const res      = await fetch(CLIENTES_URL);
  const clientes = await res.json();
  ['receita-cliente', 'filter-cliente-receita'].forEach(selId => {
    const sel = document.getElementById(selId);
    const cur = sel.value;
    while (sel.options.length > 1) sel.remove(1);
    clientes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c._id;
      opt.textContent = `${c.nome} — ${c.cpf}`;
      sel.appendChild(opt);
    });
    if (cur) sel.value = cur;
  });
}

async function loadReceitas() {
  const filtro = document.getElementById('filter-cliente-receita').value;
  const url    = filtro ? `${RECEITAS_URL}?cliente=${filtro}` : RECEITAS_URL;
  const res      = await fetch(url);
  const receitas = await res.json();
  const list     = document.getElementById('receitas-list');

  if (!receitas.length) {
    list.innerHTML = `<div class="empty"><div class="empty-icon">📋</div><p>Nenhuma receita encontrada.</p></div>`;
    return;
  }

  list.innerHTML = receitas.map(r => `
    <div class="list-item">
      <div class="item-info">
        <span class="badge ${badgeClass(r.status)}">${r.status}</span>
        <h3>${r.cliente?.nome || '—'}</h3>
        <p>👨‍⚕️ Dr(a). ${r.medico} — CRM ${r.crm}</p>
        <p>💊 ${r.medicamentos}</p>
        <p>📅 Emissão: ${fmtDate(r.dataEmissao)} &nbsp;|&nbsp; Validade: ${fmtDate(r.dataValidade)}</p>
        ${r.observacoes ? `<p>📝 ${r.observacoes}</p>` : ''}
      </div>
      <div class="item-actions">
        <button class="btn-edit"   onclick="editReceita('${r._id}')">Editar</button>
        <button class="btn-delete" onclick="deleteReceita('${r._id}')">Excluir</button>
      </div>
    </div>`).join('');
}

window.editReceita = async function(id) {
  const res = await fetch(`${RECEITAS_URL}/${id}`);
  const r   = await res.json();
  receitaIdInput.value = r._id;
  document.getElementById('receita-cliente').value      = r.cliente?._id || r.cliente;
  document.getElementById('receita-medico').value       = r.medico;
  document.getElementById('receita-crm').value          = r.crm;
  document.getElementById('receita-status').value       = r.status;
  document.getElementById('receita-dataEmissao').value  = r.dataEmissao?.slice(0,10) || '';
  document.getElementById('receita-dataValidade').value = r.dataValidade?.slice(0,10) || '';
  document.getElementById('receita-medicamentos').value = r.medicamentos;
  document.getElementById('receita-observacoes').value  = r.observacoes || '';
  document.getElementById('receita-form-title').textContent = 'Editar Receita';
  showReceitaForm();
};

window.deleteReceita = async function(id) {
  if (!confirm('Deseja excluir esta receita?')) return;
  const res  = await fetch(`${RECEITAS_URL}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  showMsg('receita-message', data.message, !res.ok);
  loadReceitas();
};

receitaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id   = receitaIdInput.value;
  const body = {
    cliente:       document.getElementById('receita-cliente').value,
    medico:        document.getElementById('receita-medico').value,
    crm:           document.getElementById('receita-crm').value,
    status:        document.getElementById('receita-status').value,
    dataEmissao:   document.getElementById('receita-dataEmissao').value,
    dataValidade:  document.getElementById('receita-dataValidade').value,
    medicamentos:  document.getElementById('receita-medicamentos').value,
    observacoes:   document.getElementById('receita-observacoes').value,
  };
  const res  = await fetch(id ? `${RECEITAS_URL}/${id}` : RECEITAS_URL, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) { showMsg('receita-message', data.message, true); return; }
  showMsg('receita-message', id ? 'Receita atualizada!' : 'Receita cadastrada!');
  hideReceitaForm();
  clearReceitaForm();
  loadReceitas();
});

document.getElementById('filter-cliente-receita').addEventListener('change', loadReceitas);

// ============================================================
// Service Worker (PWA)
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try { await navigator.serviceWorker.register('./service-worker.js'); }
    catch (e) { console.warn('SW error:', e); }
  });
}

// ============================================================
// Init
// ============================================================
loadClientes();
clearReceitaForm();
