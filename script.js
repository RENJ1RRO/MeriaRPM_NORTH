// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Load news from localStorage
    loadNews();
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            navLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding tab
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Form Submission for ideas
    const suggestionForm = document.getElementById('suggestion-form');
    if (suggestionForm) {
        // Formspree will handle the submission
        // We'll just show a confirmation message
        suggestionForm.addEventListener('submit', function(e) {
            // Formspree handles the actual submission
            // We'll just show a confirmation
            setTimeout(() => {
                alert('Спасибо! Ваше предложение отправлено губернатору. Мы рассмотрим его в ближайшее время.');
                suggestionForm.reset();
            }, 500);
        });
    }
    
    // Hero button to ideas tab
    const heroButton = document.querySelector('.hero .btn');
    if (heroButton) {
        heroButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            navLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(item => item.classList.remove('active'));
            
            // Add active class to ideas link
            document.querySelector('[data-tab="ideas"]').classList.add('active');
            document.getElementById('ideas').classList.add('active');
            
            // Scroll to ideas section
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Admin functionality
    const adminPassword = "rpm2023"; // Change this to your desired password
    const loginBtn = document.getElementById('login-btn');
    const adminLogin = document.getElementById('admin-login');
    const adminContent = document.getElementById('admin-content');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('admin-password').value;
            
            if (passwordInput === adminPassword) {
                adminLogin.classList.add('hidden');
                adminContent.classList.remove('hidden');
            } else {
                alert('Неверный пароль!');
            }
        });
    }
    
    // Admin news management
    const addNewsBtn = document.getElementById('add-news-btn');
    const manageNewsBtn = document.getElementById('manage-news-btn');
    const exportNewsBtn = document.getElementById('export-news-btn');
    const importNewsBtn = document.getElementById('import-news-btn');
    const addNewsForm = document.getElementById('add-news-form');
    const manageNewsList = document.getElementById('manage-news-list');
    const importExportSection = document.getElementById('import-export-section');
    const saveNewsBtn = document.getElementById('save-news-btn');
    const copyExportBtn = document.getElementById('copy-export-btn');
    const importNewsConfirmBtn = document.getElementById('import-news-confirm-btn');
    
    if (addNewsBtn) {
        addNewsBtn.addEventListener('click', function() {
            addNewsForm.classList.remove('hidden');
            manageNewsList.classList.add('hidden');
            importExportSection.classList.add('hidden');
            
            // Reset form
            document.getElementById('news-title').value = '';
            document.getElementById('news-content').value = '';
            document.getElementById('news-image').value = '';
            document.getElementById('news-date').valueAsDate = new Date();
        });
    }
    
    if (manageNewsBtn) {
        manageNewsBtn.addEventListener('click', function() {
            addNewsForm.classList.add('hidden');
            manageNewsList.classList.remove('hidden');
            importExportSection.classList.add('hidden');
            displayNewsForManagement();
        });
    }
    
    if (exportNewsBtn) {
        exportNewsBtn.addEventListener('click', function() {
            addNewsForm.classList.add('hidden');
            manageNewsList.classList.add('hidden');
            importExportSection.classList.remove('hidden');
            
            // Generate export data
            const news = getNewsFromStorage();
            document.getElementById('export-data').value = JSON.stringify(news, null, 2);
        });
    }
    
    if (importNewsBtn) {
        importNewsBtn.addEventListener('click', function() {
            addNewsForm.classList.add('hidden');
            manageNewsList.classList.add('hidden');
            importExportSection.classList.remove('hidden');
            
            // Clear import field
            document.getElementById('import-data').value = '';
        });
    }
    
    if (saveNewsBtn) {
        saveNewsBtn.addEventListener('click', function() {
            const title = document.getElementById('news-title').value;
            const content = document.getElementById('news-content').value;
            const image = document.getElementById('news-image').value;
            const dateInput = document.getElementById('news-date').value;
            
            if (!title || !content) {
                alert('Пожалуйста, заполните заголовок и текст новости');
                return;
            }
            
            const date = dateInput ? new Date(dateInput).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU');
            
            // Save news to localStorage
            saveNewsToStorage(title, content, image, date);
            
            // Reset form
            document.getElementById('news-title').value = '';
            document.getElementById('news-content').value = '';
            document.getElementById('news-image').value = '';
            document.getElementById('news-date').valueAsDate = new Date();
            
            // Reload news on the site
            loadNews();
            
            alert('Новость успешно опубликована!');
        });
    }
    
    if (copyExportBtn) {
        copyExportBtn.addEventListener('click', function() {
            const exportData = document.getElementById('export-data');
            exportData.select();
            document.execCommand('copy');
            alert('Данные скопированы в буфер обмена!');
        });
    }
    
    if (importNewsConfirmBtn) {
        importNewsConfirmBtn.addEventListener('click', function() {
            const importData = document.getElementById('import-data').value;
            
            if (!importData) {
                alert('Пожалуйста, введите данные для импорта');
                return;
            }
            
            try {
                const news = JSON.parse(importData);
                
                if (!Array.isArray(news)) {
                    throw new Error('Некорректный формат данных');
                }
                
                // Save imported news to localStorage
                localStorage.setItem('rpm-news', importData);
                
                // Reload news on the site
                loadNews();
                
                alert('Новости успешно импортированы!');
            } catch (e) {
                alert('Ошибка при импорте данных: ' + e.message);
            }
        });
    }
    
    // Load news from localStorage and display
    function loadNews() {
        const newsContainer = document.getElementById('news-container');
        const homeNewsContainer = document.getElementById('home-news');
        
        if (!newsContainer && !homeNewsContainer) return;
        
        const news = getNewsFromStorage();
        
        // Display latest 3 news on home page
        if (homeNewsContainer) {
            homeNewsContainer.innerHTML = '';
            const latestNews = news.slice(0, 3);
            
            if (latestNews.length === 0) {
                homeNewsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Новостей пока нет. Губернатор скоро добавит первые новости!</p>';
            } else {
                latestNews.forEach(item => {
                    homeNewsContainer.appendChild(createNewsCard(item));
                });
            }
        }
        
        // Display all news on news page
        if (newsContainer) {
            newsContainer.innerHTML = '';
            
            if (news.length === 0) {
                newsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Новостей пока нет. Губернатор скоро добавит первые новости!</p>';
            } else {
                news.forEach(item => {
                    newsContainer.appendChild(createNewsCard(item));
                });
            }
        }
    }
    
    function createNewsCard(newsItem) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.dataset.id = newsItem.id;
        
        const imageUrl = newsItem.image || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80';
        
        card.innerHTML = `
            <div class="news-image" style="background-image: url('${imageUrl}')"></div>
            <div class="news-content">
                <div class="news-date"><i class="far fa-calendar-alt"></i> ${newsItem.date}</div>
                <h3 class="news-title">${newsItem.title}</h3>
                <p class="news-excerpt">${newsItem.content.substring(0, 150)}${newsItem.content.length > 150 ? '...' : ''}</p>
                <a href="#" class="read-more" onclick="showFullNews(${newsItem.id})">Читать полностью <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        return card;
    }
    
    function displayNewsForManagement() {
        const newsList = document.getElementById('news-list');
        const news = getNewsFromStorage();
        
        newsList.innerHTML = '';
        
        if (news.length === 0) {
            newsList.innerHTML = '<p>Новостей пока нет</p>';
            return;
        }
        
        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'admin-form';
            newsItem.innerHTML = `
                <h4>${item.title}</h4>
                <p><strong>Дата:</strong> ${item.date}</p>
                <p>${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}</p>
                <button class="btn-primary" onclick="deleteNews(${item.id})" style="margin-top: 0.5rem;">Удалить</button>
            `;
            newsList.appendChild(newsItem);
        });
    }
    
    // Save news to localStorage
    function saveNewsToStorage(title, content, image, date) {
        const news = getNewsFromStorage();
        const newNews = {
            id: Date.now(),
            title,
            content,
            image,
            date
        };
        
        news.unshift(newNews); // Add to beginning of array
        localStorage.setItem('rpm-news', JSON.stringify(news));
    }
    
    // Get news from localStorage
    function getNewsFromStorage() {
        const newsJSON = localStorage.getItem('rpm-news');
        return newsJSON ? JSON.parse(newsJSON) : [];
    }
    
    // Delete news
    window.deleteNews = function(id) {
        if (confirm('Вы уверены, что хотите удалить эту новость?')) {
            let news = getNewsFromStorage();
            news = news.filter(item => item.id !== id);
            localStorage.setItem('rpm-news', JSON.stringify(news));
            
            // Refresh displays
            loadNews();
            displayNewsForManagement();
        }
    };
    
    // Show full news
    window.showFullNews = function(id) {
        const news = getNewsFromStorage();
        const newsItem = news.find(item => item.id === id);
        
        if (newsItem) {
            // Create modal or redirect to a detailed view
            // For simplicity, we'll just show an alert with the full content
            alert(`Новость: ${newsItem.title}\n\n${newsItem.content}\n\nДата: ${newsItem.date}`);
        }
    };
});