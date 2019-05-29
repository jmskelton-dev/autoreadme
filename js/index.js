'use strict';

/* Template Generators */

  /* Generate individual input field for repo author */
  function generateAuthorInputItem(author, index) {
    const currentAuthor = index + 1;
    return `<input type="text" name="author-username-${currentAuthor}" id="author-username-${currentAuthor}" aria-label="Author ${currentAuthor} Username" value="${author}" placeholder="Enter Author Username Here"><button type="button" class="btn btn-add">+</button><button type="button" class="btn btn-delete">-</button><br>`;
  }

  /* Generate all HTML inputs via generateAuthorInputItem */
  function generateAuthorInputs(authors) {
    const authorInputs = authors.map((author, index) => generateAuthorInputItem(author, index));
    return authorInputs.join("");
  }

  /* Returns HTML to create Readme Options Page. */
  function generateReadmeOptions() {
    
    const authors = generateAuthorInputs(STORE.authors);

    return `<fieldset>
    <legend>Readme Options</legend>
    <label for="repo-project-name">Project Name:</label>
    <input type="text" name="repo-project-name" id="repo-project-name" ${STORE.name === null ? `` : `value="${STORE.name}"`} required><br>
    <label for="repo-project-description">Project Description</label><br>
    <textarea name="repo-project-description" id="repo-project-description" cols="30" rows="10" spellcheck="true" placeholder="Enter a description for your project here.">${STORE.description === null ? `` : `${STORE.description}`}</textarea><br>
    <label for="repo-live-demo-url">Live Demo Link:</label>
    <input type="url" name="repo-live-demo-url" id="repo-live-demo-url" placeholder="Enter your live demo URL here" ${STORE.sites === null ? `` : `value="${STORE.sites}"`}><br>
    <span aria-hidden="true">(e.g. https://www.autoreadme.dev)</span><br>
    <label for="repo-installation-instructions">Installation Instructions</label><br>
    <textarea name="repo-installation-instructions" id="repo-installation-instructions" cols="30" rows="10" spellcheck="true" placeholder="Enter installation instructions here (if applicable).">${STORE.instructions === null ? `` : `${STORE.instructions}`}</textarea><br>
    <label for="repo-license">License</label> <a href="https://choosealicense.com" target="_blank" title="Need help picking a license? Visit choosealicense.com"><i class="fas fa-info-circle" aria-hidden="true"></i></a>
    <input type="text" name="repo-license" id="repo-license" placeholder="Enter your project's license here" ${STORE.license === null ? `` : `value="${STORE.license}"`}><br>
    <span aria-hidden="true">(e.g. GNU GPLv3)</span>
</fieldset>
<fieldset>
    <legend>Authors</legend>
    <p>Enter GitHub Usernames</p>
    <div id="authorUsernames">
      ${authors}
    </div>
</fieldset>
<fieldset>
    <legend>Screenshots</legend>
    <p>Select which screenshots (if any) you wish to display in your readme. Enter the URL for the appropriate screenshots.</p>
    <input type="checkbox" name="screenshot-mobile" id="screenshot-mobile" aria-label="Include Mobile Screenshots." ${STORE.screenshots[0].display ? `checked`: ``}>
    <label for="screenshot-mobile">Mobile</label><br>
    <label for="screenshot-mobile-url">Screenshot URL</label>
    <input type="text" name="screenshot-mobile-url" id="screenshot-mobile-url" placeholder="Enter mobile screenshot URL here." ${STORE.screenshots[0].display ? `value="${STORE.screenshots[0].url}"`: ``}><br>
    <input type="checkbox" name="screenshot-desktop" id="screenshot-desktop" aria-label="Include Desktop Screenshots." ${STORE.screenshots[1].display ? `checked`: ``}>
    <label for="screenshot-desktop">Desktop</label><br>
    <label for="screenshot-desktop-url">Screenshot URL</label>
    <input type="text" name="screenshot-desktop-url" id="screenshot-desktop-url" placeholder="Enter desktop screenshot URL here."${STORE.screenshots[1].display ? `value="${STORE.screenshots[1].url}"`: ``}>
</fieldset>
<button type="submit" class="btn btn-primary">Generate ReadMe</button>`
  }

/* Data Storage */
  const STORE = {
    view: 'start',
    name : 'My Project',
    description : null,
    authors : [''],
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
  /* Get details for repo to put in Readme Options input fields */
  function getRepoDetails (gitRepo) {
    const queryURL = `https://api.github.com/repos/${gitRepo}`
    
    fetch(queryURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      storeRepoDetails(responseJson);
      STORE.view = 'options';
      render();
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
  }

  /* Get release details for repo to put in Readme Output */
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
    let sliceIndex = 0;
    let gitHub = 'github.com';
    let gitPages = '.github.io';

    if (url.includes(gitHub)) {
      sliceIndex = url.indexOf(gitHub);
      return url.slice(sliceIndex+11).split('/').slice(0, 2).join('/');

    } else if (url.includes(gitPages)) {
      sliceIndex = url.indexOf('.github.io');
      let userName = url.slice(0,sliceIndex).split('/').pop();
      let repoName = url.slice(sliceIndex+11).split('/').shift();
      return `${userName}/${repoName}`;

    } else {
      throw new Error('Not a valid GitHub Repo URL');
    }
  }

  function storeRepoDetails (responseJson) {

    STORE.name = responseJson.name;
    STORE.description = responseJson.description;
    STORE.authors = [responseJson.owner.login];

    //Check if has GitHub Pages
    responseJson.has_pages ? STORE.sites = `https://${responseJson.owner.login}.github.io/${responseJson.name}/` : ''; 

    //Check if has a license specified
    responseJson.license === null ? '' : STORE.license = responseJson.license.name;
  }

  function gitReleaseDetails (responseJson) {
    console.log(responseJson);
    
  }

/* Rendering Functions */

  /* Appends result from generateReadmeOptions to readmeOptionsForm id for Options page */
  function renderReadmeOptions() {
    $('#readmeOptionsForm').html(generateReadmeOptions());
  }
  /* Renders proper page according to STORE.view value */
  function render() {
    if (STORE.view === 'start') {
      $('#landing-info').show();
      $('#repoURLForm').show();
      $('#readmeOptionsForm').hide();
      $('#readmeOutputForm').hide();
    } else if (STORE.view === 'options') {
      renderReadmeOptions();
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
          
          try {
            const githubUserRepo = parseUserInput(gitRepo);
            getRepoDetails(githubUserRepo);
          } catch (e) {
            $('#js-error-message').text(`Something went wrong: ${e.message}`);
          }

      });
  }

    /* Watches for submit of README details */
    function watchButton() {
      $('#readmeOptionsForm').on('submit', function(event) {
          event.preventDefault();

      });
  }

  /* Run on Initialize */
  function initializePage() {
    //Event Listeners
    watchForm();
    watchButton();

    //Render Function
    render();
  }

//Run on page initialize
  $(initializePage);