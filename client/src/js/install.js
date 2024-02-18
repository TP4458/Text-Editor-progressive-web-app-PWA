const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
// An event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  butInstall.classList.toggle('hidden', false);
  window.deferredPrompt = event;
});

//  Implements a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    return;
  }
  butInstall.classList.toggle('hidden', true);
  //display prompt
  promptEvent.prompt();
  // Reset the deferred prompt variable, prompt() can only be called once.

  window.deferredPrompt = null;
});

// TODO: Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  //clears prompt
  window.deferredPrompt = null;
});
