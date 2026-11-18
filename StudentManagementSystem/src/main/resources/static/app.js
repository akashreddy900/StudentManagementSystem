const API = '/api/students';
const rows = document.getElementById('studentRows');
const dialog = document.getElementById('studentDialog');
const form = document.getElementById('studentForm');
let students = [];

// Demo-only client-side login. For production, implement server-side authentication.
const DEMO_USERNAME = 'akash';
const DEMO_PASSWORD = '123456';
const AUTH_KEY = 'campusdesk_demo_signed_in';
function showApp() {
  const signedIn = sessionStorage.getItem(AUTH_KEY) === 'yes';
  document.getElementById('loginScreen').hidden = signedIn;
  document.getElementById('appShell').hidden = !signedIn;
  if (signedIn) loadStudents();
}
document.getElementById('loginForm').addEventListener('submit', event => {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, 'yes');
    document.getElementById('loginError').textContent = '';
    showApp();
  } else {
    document.getElementById('loginError').textContent = 'Incorrect username or password. Please try again.';
  }
});
document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem(AUTH_KEY);
  document.getElementById('loginForm').reset();
  showApp();
});

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {'Content-Type': 'application/json', ...(options.headers || {})},
    ...options
  });
  if (!response.ok) {
    let message = `Request failed (${response.status}). Please try again.`;
    try { const body = await response.json(); message = body.detail || body.message || body.title || message; } catch {}
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}
function showMessage(text, isError = false) {
  const el = document.getElementById('message'); el.textContent = text;
  el.classList.toggle('error-message', isError);
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
async function loadStudents() {
  try {
    const term = document.getElementById('searchInput').value.trim();
    students = await request(API + (term ? '?search=' + encodeURIComponent(term) : ''));
    updateCourseOptions(); render();
  } catch (error) {
    rows.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(error.message)}</td></tr>`;
    document.getElementById('resultSummary').textContent = 'Could not load records';
    showMessage('Could not load records. Check that the application and database are running.', true);
  }
}
function updateCourseOptions() {
  const filter = document.getElementById('courseFilter'); const current = filter.value;
  const courses = [...new Set(students.map(s => s.course).filter(Boolean))].sort((a,b) => a.localeCompare(b));
  filter.innerHTML = '<option value="">All courses</option>' + courses.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  if (courses.includes(current)) filter.value = current;
  document.getElementById('courseSuggestions').innerHTML = courses.map(c => `<option value="${escapeHtml(c)}"></option>`).join('');
}
function getVisibleStudents() {
  const course = document.getElementById('courseFilter').value; const sort = document.getElementById('sortSelect').value;
  const visible = students.filter(s => !course || s.course === course);
  visible.sort((a,b) => sort === 'name-desc' ? (b.name||'').localeCompare(a.name||'') : sort === 'course-asc' ? (a.course||'').localeCompare(b.course||'') : sort === 'newest' ? Number(b.id)-Number(a.id) : (a.name||'').localeCompare(b.name||''));
  return visible;
}
function render() {
  const visible = getVisibleStudents();
  document.getElementById('totalCount').textContent = students.length;
  document.getElementById('courseCount').textContent = new Set(students.map(s => s.course).filter(Boolean)).size;
  document.getElementById('matchingCount').textContent = visible.length;
  document.getElementById('resultSummary').textContent = `Showing ${visible.length} of ${students.length} student${students.length === 1 ? '' : 's'}`;
  if (!visible.length) { rows.innerHTML = '<tr><td colspan="5" class="empty">No students match these filters.</td></tr>'; return; }
  rows.innerHTML = visible.map(s => `<tr><td><span class="student-avatar">${escapeHtml((s.name||'?').charAt(0).toUpperCase())}</span>${escapeHtml(s.name)}</td><td>${escapeHtml(s.email)}</td><td><span class="course-pill">${escapeHtml(s.course)}</span></td><td>${escapeHtml(s.phone||'—')}</td><td class="actions-cell"><button class="action" data-edit="${s.id}">Edit</button> <button class="action delete" data-delete="${s.id}">Delete</button></td></tr>`).join('');
}
function openForm(student = null) {
  form.reset(); document.getElementById('formError').textContent = '';
  document.getElementById('studentId').value = student?.id ?? '';
  document.getElementById('dialogTitle').textContent = student ? 'Edit student' : 'Add student';
  if (student) ['name','email','course','phone'].forEach(k => document.getElementById(k).value = student[k] || '');
  dialog.showModal();
}
function exportCsv() {
  const visible = getVisibleStudents();
  if (!visible.length) { showMessage('There are no student records to export.', true); return; }
  const columns = [['Student ID','id'],['Name','name'],['Email','email'],['Course','course'],['Phone','phone']];
  const quote = v => `"${String(v ?? '').replace(/"/g,'""')}"`;
  const csv = [columns.map(([label]) => quote(label)).join(','), ...visible.map(s => columns.map(([,k]) => quote(s[k])).join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'}); const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href=url; link.download='student-records.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  showMessage(`Exported ${visible.length} student record${visible.length === 1 ? '' : 's'}.`);
}
document.getElementById('addBtn').addEventListener('click', () => openForm());
document.getElementById('closeBtn').addEventListener('click', () => dialog.close());
document.getElementById('cancelBtn').addEventListener('click', () => dialog.close());
document.getElementById('searchInput').addEventListener('input', loadStudents);
document.getElementById('courseFilter').addEventListener('change', render);
document.getElementById('sortSelect').addEventListener('change', render);
document.getElementById('clearFiltersBtn').addEventListener('click', () => { document.getElementById('searchInput').value=''; document.getElementById('courseFilter').value=''; document.getElementById('sortSelect').value='name-asc'; loadStudents(); });
document.getElementById('exportBtn').addEventListener('click', exportCsv);
document.getElementById('refreshBtn').addEventListener('click', loadStudents);
document.getElementById('printBtn').addEventListener('click', () => window.print());
rows.addEventListener('click', async event => {
  const editId = event.target.dataset.edit; const deleteId = event.target.dataset.delete;
  if (editId) { const student = students.find(s => s.id === Number(editId)); if (student) openForm(student); }
  if (deleteId && confirm('Delete this student record? This cannot be undone.')) {
    try { await request(`${API}/${deleteId}`, {method:'DELETE'}); showMessage('Student deleted successfully.'); await loadStudents(); }
    catch (error) { showMessage(error.message, true); }
  }
});
form.addEventListener('submit', async event => {
  event.preventDefault(); const id = document.getElementById('studentId').value;
  const student = Object.fromEntries(['name','email','course','phone'].map(k => [k,document.getElementById(k).value.trim()]));
  try {
    await request(id ? `${API}/${id}` : API, {method:id?'PUT':'POST',body:JSON.stringify(student)});
    dialog.close(); showMessage(id?'Student updated successfully.':'Student added successfully.'); await loadStudents();
  } catch (error) { document.getElementById('formError').textContent = error.message; }
});
showApp();
