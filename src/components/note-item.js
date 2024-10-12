class NotesItem extends HTMLElement {
  #shadowRoot;
  #style;
  #note;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');
    this.#note = [];
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
    this.render();
  }

  get note() {
    return this.#note;
  }

  render() {
    this.#resetContent();
    this.#updateStyles();
    this.#createNoteElements();
  }

  #resetContent() {
    this.#shadowRoot.innerHTML = '';
  }

  #updateStyles() {
    this.#style.textContent = this.#getStyles();
    this.#shadowRoot.appendChild(this.#style);
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

    this.#note.forEach((note) => {
      container.appendChild(this.#createNoteElement(note));
    });

    wrapper.appendChild(container);
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

    const deleteWrapper = document.createElement('div');
    deleteWrapper.className = 'note-delete';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'button-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.id = note.id;
    deleteButton.addEventListener('click', this.#handleDelete.bind(this));

    deleteWrapper.appendChild(deleteButton);

    card.append(title, date, desc, deleteWrapper);

    return card;
  }

  #handleDelete(event) {
    const id = event.target.dataset.id;

    console.log(`Delete note with id: ${id}`);
  }

  #getStyles() {
    return `
      :host {
        display: block;
        font-family: 'Arial', sans-serif;
      }
      .grid-wrapper {
        padding-top: 5%;
        display: grid;
        justify-content: center;
      }
      .grid-wrapper .all-notes {
        padding-top: 1em;
        text-align: left;
        font-size: 2em;
        color: #1E88E5;
        font-weight: bold;
      }
      .grid-wrapper .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2em;
        padding: 2em;
      }
      .grid-container .card-note {
        background-color: #E3F2FD;
        opacity: 0.9;
        border: none;
        border-radius: 10px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        padding: 1em;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .grid-container .card-note:hover {
        transform: translateY(-10px);
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
      }
      .card-note .date {
        font-size: 0.70em;
        margin-top: -9px;
        color: #1E88E5;
      }
      .card-note .desc {
        padding-top: 1em;
        font-size: 0.90em;
        color: #1E88E5;
      }
      .card-note .note-delete {
        padding-top: 1em;
      }
      .note-delete .button-delete {
        background-color: #1E88E5;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 8px;
        cursor: pointer;
      }
      .note-delete .button-delete:hover {
        background-color: #1565C0;
      }
      @media (max-width: 600px) {
        .grid-wrapper .grid-container {
          grid-template-columns: 1fr;
        }
        .grid-wrapper .all-notes {
          font-size: 1.5em; /* Adjusted for better readability on smaller screens */
        }
      }
    `;
  }
}

customElements.define('note-item', NotesItem);
