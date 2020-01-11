const userContainer = document.querySelector('#user-info');
const notesContainer = document.querySelector('#notes-container');
let user, notes;

const API = 'https://acme-users-api-rev.herokuapp.com/api';

const fetchUser = async ()=> {
  const storage = window.localStorage;
  const userId = storage.getItem('userId'); 
  if(userId){
    try {
      return (await axios.get(`${API}/users/detail/${userId}`)).data;
    }
    catch(ex){
      storage.removeItem('userId');
      return fetchUser();
    }
  }
  const user = (await axios.get(`${API}/users/random`)).data;
  storage.setItem('userId', user.id);
  return  user;
};

const renderUser = ()=> {
  const html = `
    <h2>${ user.fullName}</h2>
    <img src='${user.avatar}'/>
    <div>${ user.bio }</div>
  `;
  userContainer.innerHTML = html;
};

const renderNotes = ()=> {
  let html = notes.map( note => {
    return `
      <li>
        ${ note.text }
      </li>
    `;
  }).join('');
  html = `<h2>Notes (${ notes.length})</h2><ul>${html}</ul>`;
  notesContainer.innerHTML = html;

};

const startApp = async()=> {
  user = await fetchUser();
  renderUser();
  const response = await axios.get(`${API}/users/${user.id}/notes`);
  notes = response.data;
  renderNotes();
};

startApp();