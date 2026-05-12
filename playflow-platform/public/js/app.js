// PlayFlow Frontend Application

const API_URL = window.location.origin;
let currentUser = null;
let currentGame = null;
let currentPage = 1;
let isLoading = false;

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const app = document.getElementById('app');
const googleLoginBtn = document.getElementById('google-login-btn');
const themeToggle = document.getElementById('theme-toggle');
const gameFeed = document.getElementById('game-feed');
const feedLoading = document.getElementById('feed-loading');

// Initialize App
async function init() {
  const token = getCookie('token') || localStorage.getItem('token');
  
  if (token) {
    try {
      await fetchCurrentUser(token);
      showApp();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      showSplash();
    }
  } else {
    showSplash();
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get('token');
  
  if (authToken) {
    localStorage.setItem('token', authToken);
    window.history.replaceState({}, document.title, window.location.pathname);
    await fetchCurrentUser(authToken);
    showApp();
  }
  
  setupEventListeners();
  loadTheme();
}

function showSplash() {
  splashScreen.classList.remove('hidden');
  app.classList.add('hidden');
}

function showApp() {
  splashScreen.classList.add('hidden');
  app.classList.remove('hidden');
  loadGames();
}

async function fetchCurrentUser(token) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Authentication failed');
  
  const data = await response.json();
  currentUser = data.data;
  updateUserUI();
}

function updateUserUI() {
  if (!currentUser) return;
  const avatar = document.getElementById('user-avatar');
  avatar.src = currentUser.avatar || '/assets/default-avatar.png';
  avatar.style.display = 'block';
}

function setupEventListeners() {
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      window.location.href = `${API_URL}/auth/google`;
    });
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToPage(link.dataset.page);
    });
  });
  
  const gameForm = document.getElementById('game-form');
  if (gameForm) {
    gameForm.addEventListener('submit', handleGameSubmit);
  }
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => switchCodeTab(e.target.dataset.tab));
  });
  
  const modalClose = document.querySelector('.modal-close');
  if (modalClose) modalClose.addEventListener('click', closeModal);
  
  const commentForm = document.getElementById('comment-form');
  if (commentForm) commentForm.addEventListener('submit', handleCommentSubmit);
  
  if (gameFeed) gameFeed.addEventListener('scroll', handleScroll);
}

function navigateToPage(pageName) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageName);
  });
  
  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === `${pageName}-page`);
    page.classList.toggle('hidden', page.id !== `${pageName}-page`);
  });
  
  if (pageName === 'library') loadLibrary();
  else if (pageName === 'profile') loadProfile();
  else if (pageName === 'feed') loadGames(true);
}

async function loadGames(reset = false) {
  if (isLoading) return;
  
  if (reset) {
    currentPage = 1;
    gameFeed.innerHTML = '';
  }
  
  isLoading = true;
  feedLoading.style.display = 'block';
  
  try {
    const response = await fetch(`${API_URL}/api/games?page=${currentPage}&limit=5`);
    const data = await response.json();
    
    if (data.success) {
      data.data.forEach(game => gameFeed.appendChild(createGameCard(game)));
      currentPage++;
    }
  } catch (error) {
    console.error('Failed to load games:', error);
  } finally {
    isLoading = false;
    feedLoading.style.display = 'none';
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = gameFeed;
  if (scrollTop + clientHeight >= scrollHeight - 100) loadGames();
}

function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.innerHTML = `
    <div class="game-preview" onclick="openGame('${game._id}')">
      ${game.thumbnail ? `<img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">` : '<div style="font-size: 3rem;">🎮</div>'}
    </div>
    <div class="game-meta">
      <h3 class="game-title">${game.title}</h3>
      <div class="game-creator">
        <img src="${game.creator?.avatar || '/assets/default-avatar.png'}" alt="${game.creator?.displayName}" class="creator-avatar">
        <span>${game.creator?.displayName || 'Unknown'}</span>
      </div>
      <div class="game-stats">
        <span class="stat-item">❤️ ${game.likes?.length || 0}</span>
        <span class="stat-item">👁️ ${game.plays || 0}</span>
        <span class="stat-item">💬 ${game.comments?.length || 0}</span>
      </div>
    </div>
    <div class="game-actions-bar">
      <button class="action-btn" onclick="toggleLike('${game._id}')">❤️</button>
      <button class="action-btn" onclick="toggleSave('${game._id}')">🔖</button>
      <button class="action-btn" onclick="shareGame('${game._id}')">📤</button>
    </div>
  `;
  return card;
}

async function openGame(gameId) {
  try {
    const response = await fetch(`${API_URL}/api/games/${gameId}`);
    const data = await response.json();
    if (data.success) {
      currentGame = data.data;
      showGameModal(currentGame);
    }
  } catch (error) {
    console.error('Failed to load game:', error);
  }
}

function showGameModal(game) {
  const modal = document.getElementById('game-modal');
  const player = document.getElementById('game-player');
  
  const gameHTML = `<!DOCTYPE html><html><head><style>${game.gameCode?.css || ''}</style></head><body>${game.gameCode?.html || ''}<script>${game.gameCode?.javascript || ''}<\/script></body></html>`;
  
  player.innerHTML = `<iframe srcdoc="${gameHTML.replace(/"/g, '&quot;')}" style="width: 100%; height: 100%; border: none;" sandbox="allow-scripts allow-same-origin"></iframe>`;
  
  document.getElementById('modal-game-title').textContent = game.title;
  document.getElementById('modal-game-desc').textContent = game.description;
  document.getElementById('like-count').textContent = game.likes?.length || 0;
  
  loadComments(game);
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('game-modal').classList.add('hidden');
  currentGame = null;
}

function loadComments(game) {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '';
  
  if (game.comments && game.comments.length > 0) {
    game.comments.forEach(comment => {
      const commentEl = document.createElement('div');
      commentEl.className = 'comment';
      commentEl.innerHTML = `
        <div class="comment-header">
          <img src="${comment.user?.avatar || '/assets/default-avatar.png'}" width="24" height="24" style="border-radius: 50%;">
          <strong>${comment.user?.displayName || 'Anonymous'}</strong>
        </div>
        <p>${comment.text}</p>
      `;
      commentsList.appendChild(commentEl);
    });
  } else {
    commentsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No comments yet. Be the first!</p>';
  }
}

async function handleCommentSubmit(e) {
  e.preventDefault();
  if (!currentUser) { alert('Please login to comment'); return; }
  
  const text = document.getElementById('comment-text').value.trim();
  if (!text) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/games/${currentGame._id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text })
    });
    
    const data = await response.json();
    if (data.success) {
      document.getElementById('comment-text').value = '';
      loadComments(data.data);
    }
  } catch (error) {
    console.error('Failed to post comment:', error);
  }
}

async function toggleLike(gameId) {
  if (!currentUser) { alert('Please login to like games'); return; }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/games/${gameId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.success && currentGame && currentGame._id === gameId) {
      document.getElementById('like-count').textContent = data.data.likes?.length || 0;
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
  }
}

async function toggleSave(gameId) {
  if (!currentUser) { alert('Please login to save games'); return; }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/games/${gameId}/save`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.success) {
      alert(data.data.saves.some(s => s.user === currentUser._id) ? 'Game saved to library!' : 'Game removed from library');
    }
  } catch (error) {
    console.error('Failed to toggle save:', error);
  }
}

function shareGame(gameId) {
  const url = `${window.location.origin}/game/${gameId}`;
  if (navigator.share) {
    navigator.share({ title: 'Check out this game on PlayFlow!', url });
  } else {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }
}

async function handleGameSubmit(e) {
  e.preventDefault();
  if (!currentUser) { alert('Please login to create games'); return; }
  
  const formData = {
    title: document.getElementById('game-title').value,
    description: document.getElementById('game-description').value,
    category: document.getElementById('game-category').value,
    tags: document.getElementById('game-tags').value.split(',').map(t => t.trim()).filter(t => t),
    gameCode: {
      html: document.getElementById('code-html').value,
      css: document.getElementById('code-css').value,
      javascript: document.getElementById('code-js').value
    }
  };
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) {
      alert('Game published successfully!');
      e.target.reset();
      navigateToPage('feed');
    } else {
      alert('Failed to publish game: ' + data.message);
    }
  } catch (error) {
    console.error('Failed to create game:', error);
    alert('Failed to publish game');
  }
}

function switchCodeTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  document.querySelectorAll('.code-input').forEach(input => input.classList.toggle('active', input.id === `code-${tab}`));
}

async function loadLibrary() {
  if (!currentUser) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/users/me/library`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    const libraryGrid = document.getElementById('library-games');
    libraryGrid.innerHTML = '';
    
    if (data.success) {
      if (data.data.length === 0) {
        libraryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No saved games yet. Start exploring!</p>';
      } else {
        data.data.forEach(game => libraryGrid.appendChild(createGameGridCard(game)));
      }
    }
  } catch (error) {
    console.error('Failed to load library:', error);
  }
}

async function loadProfile() {
  if (!currentUser) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/users/me/games`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.success) {
      document.getElementById('profile-name').textContent = currentUser.displayName;
      document.getElementById('profile-bio').textContent = currentUser.bio || 'No bio yet';
      document.getElementById('profile-avatar').src = currentUser.avatar || '/assets/default-avatar.png';
      document.getElementById('stat-games').textContent = data.data.length;
      
      const gamesGrid = document.getElementById('profile-games');
      gamesGrid.innerHTML = '';
      data.data.forEach(game => gamesGrid.appendChild(createGameGridCard(game)));
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

function createGameGridCard(game) {
  const card = document.createElement('div');
  card.className = 'game-grid-card';
  card.onclick = () => openGame(game._id);
  card.innerHTML = `
    ${game.thumbnail ? `<img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">` : '<div style="height: 160px; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; font-size: 3rem;">🎮</div>'}
    <div class="game-info">
      <h4>${game.title}</h4>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">${game.category}</p>
      <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem;">
        <span>❤️ ${game.likes?.length || 0}</span>
        <span>👁️ ${game.plays || 0}</span>
      </div>
    </div>
  `;
  return card;
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', init);
