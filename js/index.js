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
    <legend><span class="number">2</span> Project Details</legend>
      <ul>
        <li>
          <label for="repo-project-name">Project Name:</label>
          <input type="text" name="repo-project-name" id="repo-project-name" ${STORE.name === null ? `` : `value="${STORE.name}"`} required>
        </li>
        <li>
          <label for="repo-project-description">Project Description</label>
          <textarea name="repo-project-description" id="repo-project-description" cols="30" rows="10" spellcheck="true" placeholder="Enter a description for your project here.">${STORE.description === null ? `` : `${STORE.description}`}</textarea>
        </li>
        <li>
          <label for="repo-live-demo-url">Live Demo Link:</label>
          <input type="url" name="repo-live-demo-url" id="repo-live-demo-url" placeholder="Enter your live demo URL here" ${STORE.sites === null ? `` : `value="${STORE.sites}"`}>
          <span aria-hidden="true">(e.g. https://www.autoreadme.dev)</span>
        </li>
        <li>
          <label for="repo-installation-instructions">Installation Instructions</label>
          <textarea name="repo-installation-instructions" id="repo-installation-instructions" cols="30" rows="10" spellcheck="true" placeholder="Enter installation instructions here (if applicable).">${STORE.instructions === null ? `` : `${STORE.instructions}`}</textarea>
        </li>
        <li>
          <label for="repo-license">License</label>
          <input type="text" name="repo-license" id="repo-license" placeholder="Enter your project's license here" ${STORE.license === null ? `` : `value="${STORE.license}"`}>
          <span>(e.g. GNU GPLv3) <a href="https://choosealicense.com" target="_blank" title="Need help picking a license? Visit choosealicense.com"><i class="fas fa-info-circle" aria-hidden="true"></i></a></span>
        </li>
      </ul>
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
      <ul>
        <li class="checkbox">
          <input type="checkbox" name="screenshot-mobile" id="screenshot-mobile" aria-label="Include Mobile Screenshots." ${STORE.screenshots[0].display ? `checked`: ``}>
          <label for="screenshot-mobile">Mobile</label>
        </li>
        <li>
          <label for="screenshot-mobile-url">Screenshot URL</label>
          <input type="text" name="screenshot-mobile-url" id="screenshot-mobile-url" placeholder="Enter mobile screenshot URL here." ${STORE.screenshots[0].display ? `value="${STORE.screenshots[0].url}"`: ``}>
          <span>(eg: https://i.imgur.com/3aWOj91.png)</span>
        </li>
        <li class="checkbox">
          <input type="checkbox" name="screenshot-desktop" id="screenshot-desktop" aria-label="Include Desktop Screenshots." ${STORE.screenshots[1].display ? `checked`: ``}>
          <label for="screenshot-desktop">Desktop</label>
        </li>
        <li>
          <label for="screenshot-desktop-url">Screenshot URL</label>
          <input type="text" name="screenshot-desktop-url" id="screenshot-desktop-url" placeholder="Enter desktop screenshot URL here."${STORE.screenshots[1].display ? `value="${STORE.screenshots[1].url}"`: ``}>
          <span>(eg: https://i.imgur.com/3aWOj91.png)</span>
        </li>
      </ul>
    </fieldset>
    <ul>
      <li class="button">
        <button type="submit" class="btn btn-primary">Generate ReadMe</button>
      </li>
    </ul>
    `
  }

  /* Returns Markdown to create Markdown box. */
  function generateMarkdown() {
    console.log(`markdown fired`);
    $('#output-markdown-syntax').val(`# Project Title

One Paragraph of project description goes here

[Live Demo]()

### Installation Instructions

A step by step series of examples that tell you how to get a development env running

Say what the step will be

\`\`\`
Give the example
\`\`\`

And repeat

\`\`\`
until finished
\`\`\`

End with an example of getting some data out of the system or using it for a little demo

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
    `);
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
      $('#js-error-message').html(`<i class="fas fa-times-circle" aria-hidden="true"></i> Something went wrong: ${err.message}`);
      $('#js-error-message').removeClass('hidden');
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
      $('#js-error-message').html(`<i class="fas fa-times-circle" aria-hidden="true"></i> Something went wrong: ${err.message}`);
      $('#js-error-message').removeClass('hidden');
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
          $('#js-error-message').addClass('hidden');
          const gitRepo = getUserRepoInput();
          
          try {
            const githubUserRepo = parseUserInput(gitRepo);
            getRepoDetails(githubUserRepo);
          } catch (e) {
            $('#js-error-message').html(`<i class="fas fa-times-circle" aria-hidden="true"></i> Something went wrong: ${e.message}`);
            $('#js-error-message').removeClass('hidden');
          }

      });
  }

    /* Watches for submit of README details */
    function watchButton() {
      $('#readmeOptionsForm').on('submit', function(event) {
          event.preventDefault();
          STORE.view = 'output';
          generateMarkdown();
          render();
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