const articles = [
  {
    id:1,
    title:'Công nghệ AI làm thay đổi ngành y tế như thế nào',
    desc:'AI đang giúp chẩn đoán nhanh hơn, tối ưu hóa công việc và hỗ trợ bác sĩ trong xử lý dữ liệu lớn.',
    img:'./Ai.jpeg',
    category:'Công nghệ',
    time:'2025-11-13',
    content:`<h2>Công nghệ AI trong y tế</h2>
      <p>Trong vài năm gần đây, trí tuệ nhân tạo đã bắt đầu được ứng dụng rộng rãi trong y tế...</p>`
  },
  {
    id:2,
    title:'Bóng đá: Đội tuyển quốc gia chuẩn bị cho giải châu Á',
    desc:'Huấn luyện viên công bố danh sách sơ bộ; các cầu thủ trẻ có cơ hội tỏa sáng.',
    img:'./bóng_đá.jpg',
    category:'Thể thao',
    time:'2025-11-12',
    content:`<h2>Chuẩn bị cho đấu trường châu lục</h2><p>Đội tuyển đã tập trung tại Hà Nội...</p>`
  },
  {
    id:3,
    title:'Kinh tế: Thị trường chứng khoán biến động nhẹ',
    desc:'Nhà đầu tư theo dõi báo cáo lợi nhuận và dữ liệu lạm phát.',
    img:'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=800&q=60',
    category:'Kinh tế',
    time:'2025-11-11',
    content:`<h2>Diễn biến thị trường</h2><p>Thị trường phản ứng với các tín hiệu vĩ mô...</p>`
  },
  {
    id:4,
    title:'Ẩm thực: 5 món ăn đường phố nên thử khi đến Hà Nội',
    desc:'Phở, bún chả, nem chua rán... danh sách dành cho người lười tìm quán.',
    img:'./ẩm_thực.jpeg',
    category:'Đời sống',
    time:'2025-10-30',
    content:`<h2>Ẩm thực Hà Nội</h2><p>Hà Nội có vô số món ăn đường phố ngon...</p>`
  }
];

const grid = document.getElementById('grid');
const catsEl = document.getElementById('cats');
const recentList = document.getElementById('recentList');
const activeCat = document.getElementById('activeCat');
const searchInput = document.getElementById('q'); 

const categories = ['Tất cả', ...Array.from(new Set(articles.map(a=>a.category)))];

function createCard(a){
  const div = document.createElement('div');
  div.className='card';
  div.dataset.id = a.id;
  div.innerHTML = `
    <div class="card-img" style="background-image:url('${a.img}')"></div>
    <div class="card-title">${a.title}</div>
    <div class="card-desc">${a.desc}</div>
    <div class="meta"><div>${a.category}</div><div>${a.time}</div></div>
  `;
  div.addEventListener('click',()=>openArticle(a.id));
  return div;
}

function renderGrid(list){
  grid.innerHTML='';
  if(list.length===0){
    grid.innerHTML='<div class="muted">Không tìm thấy bài viết.</div>';
    return;
  }
  list.forEach(a=>grid.appendChild(createCard(a)));
}

function renderCats(){
  catsEl.innerHTML='';
  categories.forEach(c=>{
    const btn = document.createElement('div');
    btn.className='chip'+(c==='Tất cả'? ' active':'');
    btn.textContent=c;
    btn.addEventListener('click',()=>{
      document.querySelectorAll('#cats .chip').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      filterByCategory(c);
    });
    catsEl.appendChild(btn);
  });
}

function renderRecent(){
  recentList.innerHTML='';
  
  const historyIds = JSON.parse(localStorage.getItem('news_history')) || [];
  
  const historyArticles = historyIds.map(id => articles.find(a => a.id === id)).filter(Boolean);

  if(historyArticles.length === 0){
    recentList.innerHTML = '<div class="muted" style="font-size:13px">Chưa có bài xem gần đây</div>';
    return;
  }

  historyArticles.forEach(a=>{
    const it = document.createElement('div');it.className='item';
    it.innerHTML = `<div class="thumb" style="background-image:url('${a.img}');background-size:cover"></div><div><div style="font-weight:600">${a.title}</div><div class="meta">${a.time}</div></div>`;
    it.addEventListener('click',()=>openArticle(a.id));
    recentList.appendChild(it);
  });
}

function addToHistory(id){
  let history = JSON.parse(localStorage.getItem('news_history')) || [];
  history = history.filter(item => item !== id);
  history.unshift(id);
  if(history.length > 5) history.pop();
  
  localStorage.setItem('news_history', JSON.stringify(history));
  renderRecent(); 
}

function filterByCategory(cat){
  activeCat.textContent = cat;
  if(cat==='Tất cả') renderGrid(articles);
  else renderGrid(articles.filter(a=>a.category===cat));
}

function doSearch(){
  const q = searchInput.value.trim().toLowerCase();
  if(!q) {
    const currentCat = document.querySelector('#cats .chip.active').textContent;
    filterByCategory(currentCat);
    return; 
  }
  const res = articles.filter(a => (a.title + ' ' + a.desc + ' ' + (a.content||'')).toLowerCase().includes(q));
  renderGrid(res);
}

searchInput.addEventListener('input', doSearch);
document.getElementById('btnSearch').addEventListener('click', doSearch);

document.getElementById('q').addEventListener('keydown',e=>{
  if(e.key==='Enter') doSearch();
});

const modal = document.getElementById('modal');
const articleContent = document.getElementById('articleContent');

function openArticle(id){
  const a = articles.find(x=>x.id==id);
  if(!a) return;
  
  addToHistory(id);

  articleContent.innerHTML = `<h2>${a.title}</h2><div class="muted">${a.category} • ${a.time}</div><img src="${a.img}" alt="" style="width:100%;border-radius:10px;margin:12px 0"/><div>${a.content}</div><div style="margin-top:12px;font-size:13px;color:var(--muted)">Nguồn: giả lập</div>`;
  modal.classList.add('show');
  document.body.style.overflow='hidden';
}

document.getElementById('closeModal').addEventListener('click',closeModal);
modal.addEventListener('click',(e)=>{ if(e.target===modal) closeModal(); });

function closeModal(){ 
  modal.classList.remove('show'); 
  document.body.style.overflow='auto'; 
}

renderCats();
renderGrid(articles);
renderRecent(); 

window.addEventListener('keydown',e=>{
  if(e.key==='/' && document.activeElement.tagName !== 'INPUT'){
    e.preventDefault();document.getElementById('q').focus();
  }
  if(e.key==='Escape') closeModal();
});