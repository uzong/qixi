// 七夕传统文化网站 - JavaScript 交互功能

class QixiWebsite {
    constructor() {
        this.init();
    }

    init() {
        // 等待DOM加载完成
        document.addEventListener('DOMContentLoaded', () => {
            this.initCountdown();
            this.initThemeToggle();
            this.initWishesWall();
            this.initSmoothScroll();
            this.initScrollAnimations();
            this.initNavigation();
            this.loadSampleWishes();
        });
    }

    // 初始化倒计时功能
    initCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;

        // 计算下一个七夕节日期
        const getNextQixi = () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            
            // 2025年七夕是8月29日（农历七月初七对应公历日期）
            // 2026年七夕是8月19日
            let qixiDate;
            
            if (currentYear === 2025) {
                qixiDate = new Date(2025, 7, 29); // 8月29日
            } else if (currentYear === 2026) {
                qixiDate = new Date(2026, 7, 19); // 8月19日
            } else {
                // 对于其他年份，使用近似日期8月中旬
                qixiDate = new Date(currentYear, 7, 15);
            }
            
            // 如果今年的七夕已过，计算明年的
            if (now > qixiDate) {
                if (currentYear === 2025) {
                    qixiDate = new Date(2026, 7, 19); // 2026年8月19日
                } else {
                    qixiDate = new Date(currentYear + 1, 7, 15);
                }
            }
            
            return qixiDate;
        };

        const updateCountdown = () => {
            const now = new Date();
            const qixiDate = getNextQixi();
            const timeDiff = qixiDate - now;

            if (timeDiff > 0) {
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            } else {
                // 七夕节当天
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                
                // 可以在这里添加七夕节特殊效果
                this.showQixiCelebration();
            }
        };

        // 立即更新一次，然后每秒更新
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // 七夕节庆祝效果
    showQixiCelebration() {
        // 创建飘落的花瓣或星星效果
        const createFloatingElement = () => {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.textContent = Math.random() > 0.5 ? '✨' : '🌸';
            element.style.cssText = `
                position: fixed;
                top: -20px;
                left: ${Math.random() * 100}vw;
                font-size: 20px;
                z-index: 9999;
                pointer-events: none;
                animation: float-down 3s ease-in forwards;
            `;
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 3000);
        };

        // 创建动画样式
        if (!document.getElementById('float-animation')) {
            const style = document.createElement('style');
            style.id = 'float-animation';
            style.textContent = `
                @keyframes float-down {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 每200ms创建一个元素，持续5秒
        const celebrationInterval = setInterval(createFloatingElement, 200);
        setTimeout(() => clearInterval(celebrationInterval), 5000);
    }

    // 初始化日夜模式切换
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        // 从localStorage读取用户偏好
        const savedTheme = localStorage.getItem('qixi-theme') || 'day';
        body.className = `${savedTheme}-mode`;

        themeToggle.addEventListener('click', () => {
            const isNightMode = body.classList.contains('night-mode');
            const newTheme = isNightMode ? 'day' : 'night';
            
            body.className = `${newTheme}-mode`;
            localStorage.setItem('qixi-theme', newTheme);

            // 添加切换动画效果
            this.addThemeTransitionEffect();
        });
    }

    // 主题切换动画效果
    addThemeTransitionEffect() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%);
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }, 150);
        });
    }

    // 初始化祈愿墙功能
    initWishesWall() {
        const wishForm = document.getElementById('wishForm');
        const wishesList = document.getElementById('wishesList');

        if (!wishForm || !wishesList) return;

        wishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('wishName');
            const contentInput = document.getElementById('wishContent');
            
            const name = nameInput.value.trim() || '匿名用户';
            const content = contentInput.value.trim();
            
            if (!content) {
                this.showNotification('请输入您的心愿内容', 'warning');
                return;
            }

            // 创建新愿望
            const wish = {
                id: Date.now(),
                name: name,
                content: content,
                time: new Date().toLocaleString('zh-CN')
            };

            // 添加到祈愿墙
            this.addWishToWall(wish);
            
            // 保存到localStorage
            this.saveWishToStorage(wish);
            
            // 清空表单
            nameInput.value = '';
            contentInput.value = '';
            
            this.showNotification('愿望已送达织女星，祝您心想事成！', 'success');
        });

        // 加载已有的愿望
        this.loadWishesFromStorage();
    }

    // 添加愿望到祈愿墙
    addWishToWall(wish) {
        const wishesList = document.getElementById('wishesList');
        const wishElement = document.createElement('div');
        wishElement.className = 'wish-item fade-in-up';
        
        wishElement.innerHTML = `
            <div class="wish-author">${this.escapeHtml(wish.name)}</div>
            <p class="wish-content">${this.escapeHtml(wish.content)}</p>
            <div class="wish-time">${wish.time}</div>
        `;
        
        wishesList.insertBefore(wishElement, wishesList.firstChild);
        
        // 触发动画
        requestAnimationFrame(() => {
            wishElement.classList.add('visible');
        });
        
        // 限制显示的愿望数量
        const wishItems = wishesList.querySelectorAll('.wish-item');
        if (wishItems.length > 20) {
            wishItems[wishItems.length - 1].remove();
        }
    }

    // 保存愿望到本地存储
    saveWishToStorage(wish) {
        const wishes = JSON.parse(localStorage.getItem('qixi-wishes') || '[]');
        wishes.unshift(wish);
        
        // 只保留最近的50个愿望
        if (wishes.length > 50) {
            wishes.splice(50);
        }
        
        localStorage.setItem('qixi-wishes', JSON.stringify(wishes));
    }

    // 从本地存储加载愿望
    loadWishesFromStorage() {
        const wishes = JSON.parse(localStorage.getItem('qixi-wishes') || '[]');
        wishes.slice(0, 20).forEach(wish => {
            this.addWishToWall(wish);
        });
    }

    // 加载示例愿望
    loadSampleWishes() {
        const sampleWishes = [
            {
                id: 1,
                name: '星语心愿',
                content: '愿天下有情人终成眷属，愿所有的爱情都能像牛郎织女一样坚贞不渝。',
                time: '2025-08-26 20:30:00'
            },
            {
                id: 2,
                name: '月下许愿',
                content: '希望能找到属于自己的那个人，就像织女遇到牛郎一样。',
                time: '2025-08-26 19:45:00'
            },
            {
                id: 3,
                name: '梦想成真',
                content: '愿我的手艺能像织女一样精巧，愿我的生活充满美好。',
                time: '2025-08-26 18:20:00'
            }
        ];

        // 只在没有存储愿望时加载示例
        const existingWishes = JSON.parse(localStorage.getItem('qixi-wishes') || '[]');
        if (existingWishes.length === 0) {
            sampleWishes.forEach(wish => {
                this.addWishToWall(wish);
            });
        }
    }

    // 初始化平滑滚动
    initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // 更新活动链接
                    this.updateActiveNavLink(link);
                }
            });
        });
    }

    // 更新活动导航链接
    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // 初始化滚动动画
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // 观察所有需要动画的元素
        document.querySelectorAll('.fade-in-up').forEach(element => {
            observer.observe(element);
        });
    }

    // 初始化导航功能
    initNavigation() {
        // 滚动时更新导航栏样式
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 导航栏背景透明度
            if (scrollTop > 50) {
                navbar.style.background = 'var(--nav-bg)';
            } else {
                navbar.style.background = 'transparent';
            }
            
            lastScrollTop = scrollTop;
        });

        // 根据滚动位置更新活动导航链接
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 动画显示
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // HTML转义函数
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化网站
const qixiWebsite = new QixiWebsite();