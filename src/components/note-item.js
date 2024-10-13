class NotesItem extends HTMLElement {
  #shadowRoot;
  #style;
  #note;
  #filteredNotes;
  #savedNotes;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');
    this.#note = [];
    this.#filteredNotes = [];
    this.#savedNotes = [];
  }

  connectedCallback() {
    this.render();
  }

  set note(value) {
    if (!Array.isArray(value)) {
      console.error('Invalid input: note must be an array');
      return;
    }
    this.#note = value;
    this.#filteredNotes = value;
    this.render();
  }

  get note() {
    return this.#note;
  }

  render() {
    this.#resetContent();
    this.#updateStyles();
    this.#createSearchElements();
    this.#createToggleButton();
    this.#createNoteElements();
  }

  #resetContent() {
    this.#shadowRoot.innerHTML = '';
  }

  #updateStyles() {
    this.#style.textContent = this.#getStyles();
    this.#shadowRoot.appendChild(this.#style);
  }

  #createSearchElements() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search notes...';
    searchInput.className = 'search-input';

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.className = 'search-button';

    searchButton.addEventListener('click', () =>
      this.#performSearch(searchInput.value)
    );
    searchInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.#performSearch(searchInput.value);
      }
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    this.#shadowRoot.appendChild(searchContainer);
  }

  #performSearch(query) {
    this.#filteredNotes = this.#note.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.body.toLowerCase().includes(query.toLowerCase())
    );
    this.#createNoteElements();
  }

  #createToggleButton() {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show Saved Notes';
    toggleButton.className = 'toggle-button';
    toggleButton.addEventListener('click', () => this.#toggleSavedNotes());
    this.#shadowRoot.appendChild(toggleButton);
  }

  #toggleSavedNotes() {
    const toggleButton = this.#shadowRoot.querySelector('.toggle-button');
    if (toggleButton.textContent === 'Show Saved Notes') {
      this.#filteredNotes = this.#savedNotes;
      toggleButton.textContent = 'Show All Notes';
    } else {
      this.#filteredNotes = this.#note;
      toggleButton.textContent = 'Show Saved Notes';
    }
    this.#createNoteElements();
  }

  #createNoteElements() {
    const wrapper = document.createElement('div');
    wrapper.className = 'grid-wrapper';

    const title = document.createElement('h1');
    title.className = 'all-notes';
    title.textContent = 'Semua Catatan Anda Akan Tampil Di Bawah Ini';
    wrapper.appendChild(title);

    const container = document.createElement('div');
    container.className = 'grid-container';

    this.#filteredNotes.forEach((note) => {
      container.appendChild(this.#createNoteElement(note));
    });

    wrapper.appendChild(container);

    // Remove existing grid-wrapper if it exists
    const existingWrapper = this.#shadowRoot.querySelector('.grid-wrapper');
    if (existingWrapper) {
      this.#shadowRoot.removeChild(existingWrapper);
    }

    this.#shadowRoot.appendChild(wrapper);
  }

  #createNoteElement(note) {
    const card = document.createElement('div');
    card.className = 'card-note';

    const title = document.createElement('h4');
    title.textContent = note.title;

    const date = document.createElement('p');
    date.className = 'date';
    date.textContent = new Date(note.createdAt).toLocaleString();

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = note.body;

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'note-buttons';

    const saveButton = document.createElement('button');
    saveButton.className = 'button-save';
    saveButton.textContent = this.#savedNotes.some(
      (savedNote) => savedNote.id === note.id
    )
      ? 'Unsave'
      : 'Save';
    saveButton.dataset.id = note.id;
    saveButton.addEventListener('click', this.#handleSave.bind(this));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'button-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.id = note.id;
    deleteButton.addEventListener('click', this.#handleDelete.bind(this));

    buttonWrapper.appendChild(saveButton);
    buttonWrapper.appendChild(deleteButton);

    card.append(title, date, desc, buttonWrapper);

    return card;
  }

  #handleSave(event) {
    const id = event.target.dataset.id;
    const noteIndex = this.#note.findIndex((note) => note.id === id);
    const savedIndex = this.#savedNotes.findIndex((note) => note.id === id);

    if (savedIndex === -1) {
      this.#savedNotes.push(this.#note[noteIndex]);
      event.target.textContent = 'Unsave';
    } else {
      this.#savedNotes.splice(savedIndex, 1);
      event.target.textContent = 'Save';
    }

    const saveEvent = new CustomEvent('save-note', {
      detail: { id, isSaved: savedIndex === -1 },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(saveEvent);
  }

  #handleDelete(event) {
    const id = event.target.dataset.id;
    const deleteEvent = new CustomEvent('delete-note', {
      detail: { id },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(deleteEvent);
  }

  #getStyles() {
    return `
      :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }
      .search-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        padding: 20px;
      }
      .search-input {
        padding: 8px;
        margin-right: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 14px;
      }
      .search-button {
        padding: 8px 16px;
        background-color: #1E88E5;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .search-button:hover {
        background-color: #1976D2;
      }
      .grid-wrapper {
        padding: 20px;
      }
      .all-notes {
        text-align: center;
        color: #1E88E5;
        margin-bottom: 20px;
      }
      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      .card-note {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 16px;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        position: relative;
        overflow: hidden;
      }
      .card-note:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      .card-note h4 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 18px;
        color: #333;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .card-note .date {
        font-size: 12px;
        color: #999;
        margin-bottom: 12px;
      }
      .card-note .desc {
        font-size: 14px;
        color: #666;
        margin-bottom: 16px;
        flex-grow: 1;
        word-wrap: break-word;
        overflow-wrap: break-word;
        overflow: auto;
        max-height: 150px;
      }
      .note-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
      }
      .button-save {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease-in-out;
      }
      .button-save:hover {
        background-color: #45a049;
      }
      .button-delete {
        background-color: #f44336;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease-in-out;
      }
      .button-delete:hover {
        background-color: #d32f2f;
      }
      .toggle-button {
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
      }
      .toggle-button:hover {
        background-color: #45a049;
      }
      @media (max-width: 600px) {
        .grid-container {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

customElements.define('note-item', NotesItem);
