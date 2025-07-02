class PortfolioApp {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'writing', 'projects', 'publications', 'news'];
        this.routes = {
            '/': 'home',
            '/writing': 'writing',
            '/projects': 'projects',
            '/publications': 'publications',
            '/news': 'news'
        };
        this.shortcuts = {
            'H': 'home',
            'W': 'writing',
            'P': 'projects',
            'U': 'publications',
            'N': 'news',
            'G': 'github',
            'L': 'linkedin'
        };
        
        this.init();
    }

    async getVisitorCount() {
        try {
          const response = await fetch("https://backend-272833152577.us-central1.run.app/visitor-count", {
            method: "POST"
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Visitor count data:", data);
      
          const countEl = document.getElementById("count");
          if (countEl) {
            countEl.innerText = data.count;
          } else {
            console.warn("Element with id 'count' not found.");
          }
        } catch (error) {
          console.error("Error fetching visitor count:", error);
        }
      }
      

    init() {
        this.setupEventListeners();
        this.setupRouting();
        this.handleInitialRoute();
    }


    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuToggle && sidebar) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.toggle('open');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            });
        }

        // Command palette
        const searchBtn = document.getElementById('searchBtn');
        const commandPaletteOverlay = document.getElementById('commandPaletteOverlay');
        const commandSearch = document.getElementById('commandSearch');

        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCommandPalette();
            });
        }

        if (commandPaletteOverlay) {
            commandPaletteOverlay.addEventListener('click', (e) => {
                if (e.target === commandPaletteOverlay) {
                    this.closeCommandPalette();
                }
            });
        }

        // Command palette search
        if (commandSearch) {
            commandSearch.addEventListener('input', (e) => {
                this.filterCommands(e.target.value);
            });
        }

        // Command items
        document.querySelectorAll('.command-item').forEach(item => {
            item.addEventListener('click', () => {
                const command = item.dataset.command;
                this.navigateTo(command);
                this.closeCommandPalette();
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // Browser navigation
        window.addEventListener('popstate', (e) => {
            this.handlePopState(e);
        });
    }

    setupRouting() {
        // Override default link behavior for SPA routing
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="/"]') && !e.target.hasAttribute('target')) {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                this.navigateToPath(path);
            }
        });
    }

    handleInitialRoute() {
        const path = window.location.pathname;
        const page = this.routes[path] || 'home';
        this.showPage(page, false);
    }

    navigateTo(page) {
        if (this.pages.includes(page)) {
            const path = this.getPathForPage(page);
            this.navigateToPath(path);
        }
    }

    navigateToPath(path) {
        const page = this.routes[path] || 'home';
        this.showPage(page, true);
        
        // Update URL without triggering popstate
        if (window.location.pathname !== path) {
            window.history.pushState({ page }, '', path);
        }
    }

    showPage(page, updateHistory = true) {
        if (!this.pages.includes(page)) {
            page = 'home';
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.add('hidden');
        });

        // Show target page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Update navigation
        this.updateNavigation(page);

        // Update page title
        this.updatePageTitle(page);

        // Close mobile menu
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }

        this.currentPage = page;
    }

    updateNavigation(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }

    updatePageTitle(page) {
        const pageElement = document.getElementById(page);
        if (pageElement && pageElement.dataset.title) {
            document.title = pageElement.dataset.title;
        }
    }

    getPathForPage(page) {
        for (const [path, pageName] of Object.entries(this.routes)) {
            if (pageName === page) {
                return path;
            }
        }
        return '/';
    }

    handlePopState(e) {
        const path = window.location.pathname;
        const page = this.routes[path] || 'home';
        this.showPage(page, false);
    }

    handleKeydown(e) {
        // Command palette toggle (Ctrl+F or Cmd+F)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
            e.preventDefault();
            e.stopPropagation();
            this.openCommandPalette();
            return;
        }

        // Close command palette on Escape
        if (e.key === 'Escape') {
            this.closeCommandPalette();
            return;
        }

        // Navigation shortcuts (Shift + Letter)
        if (e.shiftKey && this.shortcuts[e.key.toUpperCase()]) {
            e.preventDefault();
            const page = this.shortcuts[e.key.toUpperCase()];
            if (page === 'github') {
                window.open('https://github.com/shraddha-aangiras', '_blank');
            } else if (page === 'linkedin') {
                window.open('https://www.linkedin.com/in/shraddha-aangiras', '_blank');
            } else {
                this.navigateTo(page);
            }
            return;
        }
        

        // Command palette navigation
        const commandPaletteOverlay = document.getElementById('commandPaletteOverlay');
        if (commandPaletteOverlay && !commandPaletteOverlay.classList.contains('hidden')) {
            this.handleCommandPaletteNavigation(e);
        }
    }

    openCommandPalette() {
        const overlay = document.getElementById('commandPaletteOverlay');
        const searchInput = document.getElementById('commandSearch');
        
        if (overlay) {
            overlay.classList.remove('hidden');
        }
        
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
                searchInput.value = '';
            }, 10);
        }
        
        this.filterCommands('');
        this.selectFirstCommand();
    }

    closeCommandPalette() {
        const overlay = document.getElementById('commandPaletteOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    filterCommands(query) {
        const commands = document.querySelectorAll('.command-item');
        const lowerQuery = query.toLowerCase();

        commands.forEach(command => {
            const textElement = command.querySelector('.command-text');
            if (textElement) {
                const text = textElement.textContent.toLowerCase();
                if (text.includes(lowerQuery)) {
                    command.style.display = 'flex';
                } else {
                    command.style.display = 'none';
                }
            }
        });

        this.selectFirstCommand();
    }

    selectFirstCommand() {
        // Remove previous selection
        document.querySelectorAll('.command-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Select first visible command
        const visibleCommands = Array.from(document.querySelectorAll('.command-item')).filter(cmd => 
            cmd.style.display !== 'none'
        );
        
        if (visibleCommands.length > 0) {
            visibleCommands[0].classList.add('selected');
        }
    }

    handleCommandPaletteNavigation(e) {
        const commands = Array.from(document.querySelectorAll('.command-item')).filter(cmd => 
            cmd.style.display !== 'none'
        );
        const currentSelected = document.querySelector('.command-item.selected');
        let currentIndex = commands.indexOf(currentSelected);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentSelected) currentSelected.classList.remove('selected');
                currentIndex = (currentIndex + 1) % commands.length;
                if (commands[currentIndex]) {
                    commands[currentIndex].classList.add('selected');
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (currentSelected) currentSelected.classList.remove('selected');
                currentIndex = currentIndex <= 0 ? commands.length - 1 : currentIndex - 1;
                if (commands[currentIndex]) {
                    commands[currentIndex].classList.add('selected');
                }
                break;

            case 'Enter':
                e.preventDefault();
                if (currentSelected) {
                    const command = currentSelected.dataset.command;
                    this.navigateTo(command);
                    this.closeCommandPalette();
                }
                break;
        }
    }

    // Utility methods for error handling
    handleError(error) {
        console.error('Portfolio App Error:', error);
    }

    // Method to programmatically navigate (useful for testing)
    goto(page) {
        this.navigateTo(page);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.portfolioApp = new PortfolioApp();
        console.log('Portfolio App initialized successfully');
        window.portfolioApp.getVisitorCount();
    } catch (error) {
        console.error('Failed to initialize Portfolio App:', error);
    }
});

// Handle page refresh
window.addEventListener('beforeunload', () => {
    // Clean up any resources if needed
});

// Export for potential testing or external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}

// ************************************************************
// Use this for new changes to trick browser to fetch new data:

// <script src="app.js?v=2"></script>
//<link rel="stylesheet" href="style.css?v=2">
