class Navbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
  
          header {
            background-color: #4a90e2;
            color: white;
            padding: 1rem;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
  
          nav {
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
          }
  
          .logo {
            display: flex;
            align-items: center;
            font-size: 1.5rem;
            font-weight: bold;
          }
  
          .logo svg {
            width: 24px;
            height: 24px;
            margin-right: 0.5rem;
            fill: currentColor;
          }
  
          .nav-links {
            display: flex;
            gap: 1rem;
          }
  
          .nav-links a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }
  
          .nav-links a:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
  
          .search-bar {
            display: flex;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            padding: 0.5rem;
          }
  
          .search-bar input {
            background: none;
            border: none;
            color: white;
            padding: 0.25rem;
            margin-left: 0.5rem;
            outline: none;
          }
  
          .search-bar input::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
  
          .search-bar svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
          }
  
          @media (max-width: 768px) {
            .nav-links {
              display: none;
            }
          }
        </style>
  
        <header>
          <nav>
            <div class="logo">
              <svg viewBox="0 0 24 24">
                <path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/>
              </svg>
              Aplikasi Catatan || Harsena Argretya
            </div>
          </nav>
        </header>
      `;
  }
}

customElements.define('navbar-ini', Navbar);
