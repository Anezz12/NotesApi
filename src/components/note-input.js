class NoteInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.minTitleLength = 3;
    this.minDescriptionLength = 10;
  }

  connectedCallback() {
    this.render();
    this.shadowRoot
      .querySelector('#form')
      .addEventListener('submit', this._handleSubmit.bind(this));
    this.shadowRoot
      .querySelector('#title')
      .addEventListener('input', this._updateCharCount.bind(this));
    this.shadowRoot
      .querySelector('#title')
      .addEventListener('input', this._validateForm.bind(this));
    this.shadowRoot
      .querySelector('#description')
      .addEventListener('input', this._validateForm.bind(this));
  }

  _updateCharCount(event) {
    const charCount = event.target.value.length;
    const charCountElement = this.shadowRoot.querySelector('#char-count');
    charCountElement.textContent = `${charCount}/50`;
    if (charCount > 40) {
      charCountElement.style.color = '#e74c3c';
    } else {
      charCountElement.style.color = '#7f8c8d';
    }
  }

  _validateForm() {
    const title = this.shadowRoot.querySelector('#title').value.trim();
    const description = this.shadowRoot
      .querySelector('#description')
      .value.trim();
    const submitButton = this.shadowRoot.querySelector('button[type="submit"]');
    const errorMessage = this.shadowRoot.querySelector('#error-message');

    if (
      title.length >= this.minTitleLength &&
      description.length >= this.minDescriptionLength
    ) {
      submitButton.disabled = false;
      errorMessage.style.display = 'none';
    } else {
      submitButton.disabled = true;
      errorMessage.style.display = 'block';
      if (
        title.length < this.minTitleLength &&
        description.length < this.minDescriptionLength
      ) {
        errorMessage.textContent = `Judul minimal ${this.minTitleLength} karakter dan Deskripsi minimal ${this.minDescriptionLength} karakter.`;
      } else if (title.length < this.minTitleLength) {
        errorMessage.textContent = `Judul minimal ${this.minTitleLength} karakter.`;
      } else {
        errorMessage.textContent = `Deskripsi minimal ${this.minDescriptionLength} karakter.`;
      }
    }
  }

  _handleSubmit(event) {
    event.preventDefault();

    const title = this.shadowRoot.querySelector('#title').value.trim();
    const description = this.shadowRoot
      .querySelector('#description')
      .value.trim();

    if (
      title.length < this.minTitleLength ||
      description.length < this.minDescriptionLength
    ) {
      this._showError(
        `Judul minimal ${this.minTitleLength} karakter dan Deskripsi minimal ${this.minDescriptionLength} karakter.`
      );
      return;
    }

    const newNote = {
      id: `notes-${Date.now()}`,
      title: title,
      body: description,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    this.dispatchEvent(new CustomEvent('note-added', { detail: newNote }));

    this.shadowRoot.querySelector('#title').value = '';
    this.shadowRoot.querySelector('#description').value = '';
    this.shadowRoot.querySelector('#char-count').textContent = '0/50';
    this._showSuccess('Catatan Berhasil Ditambahkan!');
    this._validateForm();
  }

  _showError(message) {
    this._showMessage(message, '#e74c3c');
  }

  _showSuccess(message) {
    this._showMessage(message, '#2ecc71');
  }

  _showMessage(message, color) {
    const messageElement = this.shadowRoot.querySelector('#message');
    messageElement.textContent = message;
    messageElement.style.color = color;
    messageElement.style.display = 'block';
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 3000);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Arial', sans-serif;
          --primary-color: #1E88E5;
          --primary-dark: #1565C0;
          --error-color: #e74c3c;
          --success-color: #2ecc71;
          --focus-color: #3498db;
        }
        
        .wrapper {
          display: flex;
          justify-content: center;
          padding-top: 10rem;
        }
        
        .form-wrapper {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          width: 100%;
          max-width: 500px;
        }
        
        h1 {
          color: var(--primary-color);
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          font-weight: bold;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--primary-color);
          font-weight: bold;
        }
        
        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--primary-color);
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: var(--focus-color);
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
        }
        
        textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .char-count {
          text-align: right;
          color: #7f8c8d;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }
        
        button {
          display: block;
          width: 100%;
          padding: 0.75rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease, opacity 0.3s ease;
        }
        
        button:hover {
          background-color: var(--primary-dark);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        #error-message {
          color: var(--error-color);
          font-size: 0.9rem;
          margin-top: 0.5rem;
          display: none;
        }
        
        #message {
          text-align: center;
          margin-top: 1rem;
          font-weight: bold;
          display: none;
        }
        
        @media screen and (max-width: 600px) {
          .form-wrapper {
            padding: 1.5rem;
          }
          
          h1 {
            font-size: 1.5rem;
          }
        }
      </style>

      <div class="wrapper">
        <div class="form-wrapper">
          <h1>BUAT CATATAN BARU</h1>
          <form id="form">
            <div class="form-group">
              <label for="title">JUDUL (min. ${this.minTitleLength} karakter)</label>
              <input type="text" id="title" name="title" maxlength="50" placeholder="Masukan Judul Catatan" required>
              <div class="char-count" id="char-count">0/50</div>
            </div>
            <div class="form-group">
              <label for="description">DESKRIPSI (min. ${this.minDescriptionLength} karakter)</label>
              <textarea name="description" id="description" placeholder="Masukan Deskripsi Catatan" required></textarea>
            </div>
            <div id="error-message"></div>
            <button type="submit" disabled>TAMBAH CATATAN</button>
          </form>
          <div id="message"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('note-input', NoteInput);
