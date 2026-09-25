import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Heart,
  Home,
  Instagram,
  MapPin,
  Menu as MenuIcon,
  MoveRight,
  Play,
  Utensils,
  X,
} from 'lucide-react';

const images = {
  hero:
    'https://images.pexels.com/photos/36430173/pexels-photo-36430173.jpeg?auto=compress&cs=tinysrgb&h=1100&w=1600',
  pasta:
    'https://images.pexels.com/photos/13068783/pexels-photo-13068783.jpeg?auto=compress&cs=tinysrgb&h=1000&w=900',
  juice:
    'https://images.pexels.com/photos/28053226/pexels-photo-28053226.jpeg?auto=compress&cs=tinysrgb&h=1100&w=800',
  room:
    'https://images.pexels.com/photos/7590623/pexels-photo-7590623.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
};

const mobileNavItems = [
  { id: 'top', label: 'Home', href: '#top', icon: Home },
  { id: 'menu', label: 'Menu', href: '#menu', icon: Utensils },
  { id: 'experience', label: 'Experience', href: '#experience', icon: Heart },
  { id: 'visit', label: 'Visit Us', href: '#visit', icon: MapPin },
];

function BrandLogo() {
  return (
    <span className="brand-logo">
      <img src="/images/curve_img.jpg" alt="Curve Lounge logo" />
    </span>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderLeaving, setIsLoaderLeaving] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    const resetScrollPosition = () => {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
      });
    };

    window.history.scrollRestoration = 'manual';
    resetScrollPosition();
    const resetAfterLoadTimer = window.setTimeout(resetScrollPosition, 1100);

    return () => {
      window.clearTimeout(resetAfterLoadTimer);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  }, [isLoading]);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setIsContentVisible(true);
      setIsLoaderLeaving(true);
    }, 550);
    const removeTimer = window.setTimeout(() => setIsLoading(false), 1000);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    if (isLoading || !isContentVisible) return;

    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -10%' },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [isLoading, isContentVisible]);

  useEffect(() => {
    if (isLoading) return;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY;
      const sectionOffset = 96;
      let currentSection = 'top';

      ['top', 'experience', 'menu', 'visit'].forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        const sectionTop = section.getBoundingClientRect().top + scrollPosition;
        if (sectionTop <= scrollPosition + sectionOffset) currentSection = id;
      });

      if (scrollPosition <= 8) currentSection = 'top';
      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      const navHeight = navRef.current?.offsetHeight ?? 100;
      const heroBottom = document.getElementById('top')?.getBoundingClientRect().bottom ?? navHeight;
      setIsScrolled(heroBottom < navHeight);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`app-viewport ${isContentVisible ? 'is-content-visible' : ''}`}>
      {isLoading && (
        <div className={`loading-screen ${isLoaderLeaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading Curve Lounge">
          <div className="loading-mark" aria-hidden="true"><img src="/images/curve_img.jpg" alt="" /></div>
          <span>Preparing your table</span>
          <i className="loading-line" aria-hidden="true" />
        </div>
      )}
      <div className="page-content" aria-hidden={!isContentVisible}>
        <div className="site-shell">
      <header className="site-header">
        <nav ref={navRef} className={`site-nav ${isScrolled || menuOpen ? 'site-nav-scrolled' : ''}`} aria-label="Main navigation">
        <a className="nav-brand" href="#top" aria-label="Curve Lounge home">
          <BrandLogo />
          <span className="brand-detail">lounge · kafr saqr</span>
        </a>
        <div className="nav-links">
          <a href="#experience">The experience</a>
          <a href="#menu">Menu</a>
          <a href="#visit">Visit us</a>
        </div>
        <div className="nav-actions">
          <a className="instagram-link" href="https://www.instagram.com/curve_lounge/" target="_blank" rel="noreferrer" aria-label="Curve Lounge on Instagram">
            <Instagram size={17} strokeWidth={1.5} />
          </a>
          <a className="nav-cta" href="#visit">Plan your visit <MoveRight size={16} /></a>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
            {menuOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#experience" onClick={closeMenu}>The experience</a>
            <a href="#menu" onClick={closeMenu}>Menu</a>
            <a href="#visit" onClick={closeMenu}>Visit us</a>
            <a href="https://www.instagram.com/curve_lounge/" target="_blank" rel="noreferrer" onClick={closeMenu}>Instagram <ArrowUpRight size={16} /></a>
          </div>
        )}
      </header>

      <main>
        <section className="hero" id="top">
        <div className="hero-image-wrap">
          <img src={images.hero} alt="Creamy pasta with herbs in a bowl" className="hero-image" />
          <div className="hero-image-shade" />
        </div>
        <div className="hero-veil" />
        <div className="hero-content">
          <p className="eyebrow light">Italian pasta · fresh natural juices · Kafr Saqr</p>
          <h1>Made for<br /><em>good moments.</em></h1>
          <p className="hero-copy">Freshly plated pasta, bright natural juices, and a place to linger over both.</p>
          <a href="#menu" className="button button-light hero-primary-cta">Explore the menu <ArrowDownRight size={18} /></a>
          <div className="hero-secondary">
            <a href="#visit" className="text-link light-link">Find us <MoveRight size={18} /></a>
            <div className="hero-feature">
              <div className="hero-feature-image"><img src={images.juice} alt="Fresh juice served in a tall glass" /></div>
              <div><span>Fresh, bright,</span><strong>always worth<br />the pause.</strong></div>
            </div>
            <div className="hero-note"><span>01</span><i /><span>03</span></div>
          </div>
        </div>
        <a className="hero-scroll-cue" href="#experience" aria-label="Scroll to the Curve Lounge experience section"><span>scroll to explore</span><ArrowDownRight size={16} /></a>
        <div className="hero-side-label">crafted for good moments</div>
        <svg className="hero-wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M0 58C210 96 420 8 650 34c252 28 416 58 790 6v60H0Z" />
        </svg>
      </section>

      <section className="intro section-pad" id="experience" aria-labelledby="experience-title">
        <div className="intro-mark"><BrandLogo /><span>since today</span></div>
        <div className="intro-copy">
          <p className="eyebrow">Welcome to Curve</p>
          <h2 id="experience-title">Good food has a way<br />of <em>bringing us closer.</em></h2>
          <p className="body-copy">Curve Lounge is a contemporary space for Italian-inspired pasta, fresh natural juices, and the easy conversations that happen around a table.</p>
          <a href="#menu" className="text-link dark-link">Discover the feeling <MoveRight size={18} /></a>
        </div>
        <div className="intro-image-frame" data-reveal>
          <img src={images.room} alt="Warmly lit modern lounge interior" loading="lazy" />
          <span className="image-caption">A place to linger</span>
        </div>
      </section>

      <section className="categories section-pad" data-reveal aria-labelledby="categories-title">
        <div className="section-heading">
          <div><p className="eyebrow">At the table</p><h2 id="categories-title">Made to be <em>tasted.</em></h2></div>
          <p className="heading-aside">Two ways to make an ordinary day feel a little more special.</p>
        </div>
        <div className="category-grid">
          <article className="category-card pasta-card">
            <div className="category-photo" data-reveal><img src={images.pasta} alt="Creamy pasta topped with fresh herbs" loading="lazy" /></div>
            <div className="category-meta"><span>01 / 02</span><span>slow moments</span></div>
            <h3>Italian<br /><em>pasta</em></h3>
            <a className="round-arrow" href="#menu" aria-label="Explore Italian pasta"><ArrowUpRight size={19} /></a>
          </article>
          <article className="category-card juice-card">
            <div className="category-photo" data-reveal><img src={images.juice} alt="Fresh green and tropical juice in a tall glass" loading="lazy" /></div>
            <div className="category-meta"><span>02 / 02</span><span>bright & fresh</span></div>
            <h3>Natural<br /><em>juices</em></h3>
            <a className="round-arrow" href="#menu" aria-label="Explore fresh natural juices"><ArrowUpRight size={19} /></a>
          </article>
        </div>
      </section>

      <section className="menu-preview section-pad" id="menu" data-reveal aria-labelledby="menu-title">
        <div className="menu-intro"><p className="eyebrow">A taste of Curve</p><h2 id="menu-title">Simple choices.<br /><em>Beautifully done.</em></h2><p className="body-copy">Our menu is made for following your mood — something comforting, something fresh, and always something worth sharing.</p><a className="button button-dark" href="#visit">View full menu <MoveRight size={17} /></a></div>
        <div className="menu-board" data-reveal>
          <div className="menu-board-top"><span>curve lounge</span><span>kafr saqr · egypt</span></div>
          <div className="menu-board-title"><span>the</span><strong>menu</strong></div>
          <div className="menu-lines">
            <div><span>01</span><strong>Italian pasta</strong><i>freshly made moments</i></div>
            <div><span>02</span><strong>Natural juices</strong><i>bright, cold, and fresh</i></div>
            <div><span>03</span><strong>Something to share</strong><i>made for the middle of the table</i></div>
          </div>
          <div className="menu-board-bottom">fresh ingredients · unforgettable flavors</div>
        </div>
      </section>

      <section className="social section-pad" data-reveal aria-labelledby="social-title">
        <div className="social-header"><div><p className="eyebrow">Follow along</p><h2 id="social-title">From <em>Curve Lounge.</em></h2></div><a href="https://www.instagram.com/curve_lounge/" target="_blank" rel="noreferrer" className="text-link dark-link">@curve_lounge <ArrowUpRight size={17} /></a></div>
        <div className="social-grid" data-reveal>
          <div className="social-tile logo-tile"><img src="/images/curve_img.jpg" alt="Curve Lounge wordmark" loading="lazy" /></div>
          <div className="social-tile"><img src={images.juice} alt="Fresh juice at Curve Lounge" loading="lazy" /><span className="tile-play"><Play size={15} fill="currentColor" /></span></div>
          <div className="social-tile social-tile-pasta"><img src={images.pasta} alt="Pasta at Curve Lounge" loading="lazy" /></div>
          <div className="social-tile quote-tile"><span>made for<br /><em>good company</em></span><Instagram size={28} strokeWidth={1.2} /></div>
        </div>
      </section>

      <section className="visit" id="visit" data-reveal aria-labelledby="visit-title">
        <div className="visit-map"><div className="map-grid" /><div className="map-pin"><MapPin size={22} fill="currentColor" /></div><span className="map-label">you are here</span></div>
        <div className="visit-content"><p className="eyebrow">Come say hello</p><h2 id="visit-title">Find your way<br /><em>to Curve.</em></h2><div className="address"><strong>Curve Lounge</strong><span>Main Hospital Road</span><span>Above Vodafone's branch</span><span>Kafr Saqr, Egypt</span></div><a href="https://www.google.com/maps/search/?api=1&query=Curve+Lounge+Kafr+Saqr+Egypt" target="_blank" rel="noreferrer" className="button button-dark">Open in maps <ArrowUpRight size={17} /></a></div>
        </section>
      </main>

      <footer className="footer" data-reveal>
        <div className="footer-main"><div><BrandLogo /><p>Fresh ingredients.<br />Unforgettable flavors.</p></div><div className="footer-links"><a href="#experience">The experience</a><a href="#menu">Menu</a><a href="#visit">Visit us</a><a href="https://www.instagram.com/curve_lounge/" target="_blank" rel="noreferrer">Instagram</a></div><a className="footer-top" href="#top" aria-label="Back to top"><ArrowUpRight size={19} /></a></div>
        <div className="footer-bottom"><span>Curve Lounge · Kafr Saqr, Egypt</span><span>© 2026 Curve Lounge</span></div>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {mobileNavItems.map(({ id, label, href, icon: Icon }) => (
          <a key={id} href={href} aria-current={activeSection === id ? 'location' : undefined}>
            <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
        </div>
      </div>
    </div>
  );
}

export default App;
