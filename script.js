
// Discord API Integration
const DISCORD_GUILD_ID = '1368879954900549662';
const DISCORD_API_URL = `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`;

// DOM Elements
const memberCountElement = document.getElementById('member-count');
const onlineCountElement = document.getElementById('online-count');

// Fetch Discord server stats
async function fetchDiscordStats() {
  try {
    const response = await fetch(DISCORD_API_URL);
    const data = await response.json();
    
    // Update member count (approximate based on presence list)
    const memberCount = data.members ? data.members.length : 0;
    const onlineCount = data.presence_count || 0;
    
    // Animate counter updates
    animateCounter(memberCountElement, memberCount);
    animateCounter(onlineCountElement, onlineCount);
    
    console.log('Discord stats loaded:', { memberCount, onlineCount });
  } catch (error) {
    console.error('Error fetching Discord stats:', error);
    // Fallback values
    memberCountElement.textContent = '1.2K+';
    onlineCountElement.textContent = '420+';
  }
}

// Animate counter numbers
function animateCounter(element, targetValue) {
  const startValue = 0;
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);
    
    // Format large numbers
    if (currentValue >= 1000) {
      element.textContent = (currentValue / 1000).toFixed(1) + 'K+';
    } else {
      element.textContent = currentValue.toString();
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Intersection Observer for scroll animations
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all animated elements
  const animatedElements = document.querySelectorAll('.glass-panel, .hero-section, .features-section');
  animatedElements.forEach(el => observer.observe(el));
};

// Smooth scrolling for anchor links
const initSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// Enhanced glass panel hover effects
const initGlassEffects = () => {
  const glassPanels = document.querySelectorAll('.glass-panel');
  
  glassPanels.forEach(panel => {
    panel.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      this.style.boxShadow = `
        0 20px 60px rgba(0, 0, 0, 0.4),
        0 0 60px rgba(88, 101, 242, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `;
    });
    
    panel.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = `
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `;
    });
  });
};

// Parallax effect for background orbs
const initParallaxEffect = () => {
  const orbs = document.querySelectorAll('.bg-orb');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    orbs.forEach((orb, index) => {
      const speed = 0.5 + (index * 0.2);
      const yPos = -(scrollY * speed);
      orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  });
};

// Mouse movement parallax for glass panels
const initMouseParallax = () => {
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const glassPanels = document.querySelectorAll('.glass-panel');
    glassPanels.forEach((panel, index) => {
      const xPos = (mouseX - 0.5) * (index + 1) * 2;
      const yPos = (mouseY - 0.5) * (index + 1) * 2;
      
      panel.style.transform += ` translate3d(${xPos}px, ${yPos}px, 0)`;
    });
  });
};

// Dynamic glow effects
const initGlowEffects = () => {
  const createGlowOrb = (x, y) => {
    const orb = document.createElement('div');
    orb.className = 'glow-orb';
    orb.style.cssText = `
      position: fixed;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(88, 101, 242, 0.3), transparent);
      border-radius: 50%;
      pointer-events: none;
      left: ${x - 100}px;
      top: ${y - 100}px;
      filter: blur(40px);
      opacity: 0;
      transition: opacity 0.5s ease;
      z-index: -1;
    `;
    
    document.body.appendChild(orb);
    
    setTimeout(() => orb.style.opacity = '1', 10);
    setTimeout(() => {
      orb.style.opacity = '0';
      setTimeout(() => document.body.removeChild(orb), 500);
    }, 2000);
  };
  
  // Add glow effect on click
  document.addEventListener('click', (e) => {
    createGlowOrb(e.clientX, e.clientY);
  });
};

// Loading animation
const initLoadingAnimation = () => {
  // Add a loading class to body initially
  document.body.classList.add('loading');
  
  // Remove loading class after page loads
  window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    
    // Trigger entrance animations
    setTimeout(() => {
      document.querySelectorAll('[style*="animation-play-state: paused"]').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }, 100);
  });
};

// Performance optimization
const optimizePerformance = () => {
  // Debounce scroll events
  let scrollTimeout;
  const originalScrollHandler = window.onscroll;
  
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (originalScrollHandler) originalScrollHandler();
    }, 16); // ~60fps
  });
  
  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
  }
};

// Error handling for Discord widget
const handleDiscordWidgetError = () => {
  const discordWidget = document.querySelector('.discord-widget');
  
  discordWidget.addEventListener('error', () => {
    console.warn('Discord widget failed to load');
    // You could show a fallback join button here
  });
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌌 Echoverse Discord Portal Initialized');
  
  // Initialize all features
  fetchDiscordStats();
  observeElements();
  initSmoothScrolling();
  initGlassEffects();
  initParallaxEffect();
  initMouseParallax();
  initGlowEffects();
  initLoadingAnimation();
  optimizePerformance();
  handleDiscordWidgetError();
  
  // Refresh Discord stats every 5 minutes
  setInterval(fetchDiscordStats, 5 * 60 * 1000);
});

// Add some console art for fun
console.log(`
  ╔═══════════════════════════════════╗
  ║        🌌 ECHOVERSE PORTAL 🌌      ║
  ║     Premium Discord Experience    ║
  ╚═══════════════════════════════════╝
`);
