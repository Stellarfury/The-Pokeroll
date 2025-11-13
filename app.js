console.log('app.js loaded');

// If the Auth0 client exists, hide/show the UI
if (typeof auth0 !== 'undefined') {
  (async () => {
    const user = await auth0.getUser();
    if (user) {
      document.getElementById('login').style.display = 'none';
      document.getElementById('game').style.display = 'block';
      document.getElementById('player').textContent = user.name || user.email;
    }
  })();
    }
