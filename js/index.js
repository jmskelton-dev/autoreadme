'use strict';

/* Template Generators */

/* Data Storage */
  const STORE = {
    view: 'start',
    name : 'My Project',
    description : null,
    authors : [],
    sites : null,
    license : null,
    instructions : null,
    screenshots : [
        {type: 'mobile',
        display: false,
        url: null},
        {type: 'desktop',
        display: false,
        url: null}
    ]
  }

/* API Calls */
  function getRepoDetails (gitRepo) {
    const queryURL = `https://api.github.com/repos/${gitRepo}`
    
    fetch(queryURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => gitRepoDetails(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
  }

  function getRepoReleases (gitRepo) {
    const queryURL = `https://api.github.com/repos/${gitRepo}/releases`
    
    fetch(queryURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => gitReleaseDetails(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
  }

/* Get Functions */

  /*  Gets user input from text input field. */
  function getUserRepoInput() {
    return $('#repo-url').val();
  }

  /* Parses user input to find github repo URL */
  function parseUserInput (url) {
    let githubUserRepo = url.slice(19).split('/').slice(0, 2).join('/');
    return githubUserRepo;
  }

  function gitRepoDetails (responseJson) {
    console.log(responseJson); 
  }

  function gitReleaseDetails (responseJson) {
    console.log(responseJson);
    
  }

/* Rendering Functions */
  /* Renders proper page according to STORE.view value */
  function render() {
    if (STORE.view === 'start') {
      $('#landing-info').show();
      $('#repoURLForm').show();
      $('#readmeOptionsForm').hide();
      $('#readmeOutputForm').hide();
    } else if (STORE.view === 'options') {
      //renderReadmeOptions();
      $('#landing-info').hide();
      $('#repoURLForm').show();
      $('#readmeOptionsForm').show();
      $('#readmeOutputForm').hide();
    } else if (STORE.view === 'output') {
      //renderOutput(); 
      $('#landing-info').hide();
      $('#repoURLForm').hide();
      $('#readmeOptionsForm').hide();
      $('#readmeOutputForm').show();
    }
  }

/* Event Listeners */

  /* Watches for submit of User GitHub Repo URL */
  function watchForm() {
      $('#repoURLForm').on('submit', function(event) {
          event.preventDefault();
          const gitRepo = getUserRepoInput();
          const githubUserRepo = parseUserInput(gitRepo)
          getRepoDetails(githubUserRepo);
      });
  }

  /* Run on Initialize */
  function initializePage() {
    //Event Listeners
    watchForm();

    //Render Function
    render();
  }

//Run on page initialize
  $(initializePage);