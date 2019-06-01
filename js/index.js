'use strict';

/* Template Generators */

  /* Generate individual input field for repo author */
  function generateAuthorInputItem(author, index) {
    const currentAuthor = index + 1;
    if (currentAuthor < STORE.authors.length) {
    return `<li><input type="text" name="author-username-${currentAuthor}" id="author-username-${currentAuthor}" data-item-id="${index}" aria-label="Author ${currentAuthor} Username" value="${author}" placeholder="Enter Author Username Here"><button type="button" class="btn btn-small btn-delete delete-author">Delete</button></li>`;
    } else {
      return `<li><input type="text" name="author-username-${currentAuthor}" id="author-username-${currentAuthor}" data-item-id="${index}" aria-label="Author ${currentAuthor} Username" value="${author}" placeholder="Enter Author Username Here"><button type="button" class="btn btn-small btn-delete delete-author">Delete</button></li>
      <li><input type="text" name="author-username" id="author-username-${currentAuthor+1}" aria-label="Author ${currentAuthor+1} Username" data-item-id="${index+1}" placeholder="Enter Author Username Here"><button type="button" class="btn btn-small btn-add add-author">Add</button></li>`;
    }
  }

  /* Generate all HTML inputs via generateAuthorInputItem */
  function generateAuthorInputs(authors) {
    const authorInputs = authors.map((author, index) => generateAuthorInputItem(author, index));
    return authorInputs.join("");
  }

  /* Generate markdown for repo author */
  function generateAuthorMarkdownItem(author, index) {
    const currentAuthor = index + 1;
    return `${currentAuthor}: ${author}`;
  }

  /* Generate markdown via generateAuthorInputItem */
  function generateAuthorMarkdown(authors) {
    const authorInputs = authors.map((author, index) => generateAuthorMarkdownItem(author, index));
    return authorInputs.join("\n");
  }

  /* Generate markdown for releases */
  function generateReleaseMarkdown() {
    for (const release of releases) {
      return `* ${release.version} | [${release.name}](${release.url})\n    * ${release.description}`;
    }
  }

  /* Returns HTML to create Readme Options Page. */
  function generateReadmeOptions() {
    
    const authors = generateAuthorInputs(STORE.authors);

    return `<fieldset>
    <legend><i class="fas fa-pencil-alt icon" aria-hidden="true"></i> Project Details</legend>
      <ul>
        <li>
          <label for="repo-project-name">Project Name *</label>
          <input type="text" name="repo-project-name" id="repo-project-name" ${STORE.name === '' ? `` : `value="${STORE.name}"`} required>
          <span>* Required</span>
        </li>
        <li>
          <label for="repo-project-description">Project Description</label>
          <textarea name="repo-project-description" id="repo-project-description" cols="30" rows="10" spellcheck="true" placeholder="Enter a description for your project here.">${STORE.description === '' ? `` : `${STORE.description}`}</textarea>
        </li>
        <li>
          <label for="repo-live-demo-url">Live Demo Link</label>
          <input type="url" name="repo-live-demo-url" id="repo-live-demo-url" placeholder="Enter your live demo URL here" ${STORE.sites === '' ? `` : `value="${STORE.sites}"`}>
          <span aria-hidden="true">(e.g. https://www.autoreadme.dev)</span>
        </li>
        <li>
          <label for="repo-installation-instructions">Installation Instructions</label>
          <textarea name="repo-installation-instructions" id="repo-installation-instructions" cols="30" rows="10" spellcheck="true" placeholder="Enter installation instructions here (if applicable).">${STORE.instructions === '' ? `` : `${STORE.instructions}`}</textarea>
        </li>
        <li>
          <label for="repo-license">License</label>
          <input type="text" name="repo-license" id="repo-license" placeholder="Enter your project's license here" ${STORE.license === '' ? `` : `value="${STORE.license}"`}>
          <span>(e.g. GNU GPLv3) <a href="https://choosealicense.com" target="_blank" title="Need help picking a license? Visit choosealicense.com"><i class="fas fa-info-circle" aria-hidden="true"></i></a></span>
        </li>
      </ul>
    </fieldset>
    <fieldset>
      <legend><i class="fas fa-users icon" aria-hidden="true"></i> Authors</legend>
      <div id="authorUsernames" class="authors">
        <ul>
          ${authors}
        </ul>
      </div>
    </fieldset>
    <fieldset>
      <legend><i class="fas fa-images icon" aria-hidden="true"></i> Screenshots</legend>
      <ul>
        <li>
          <label for="screenshot-mobile-url">Mobile Screenshot URL</label>
          <input type="text" name="screenshot-mobile-url" id="screenshot-mobile-url" placeholder="Enter mobile screenshot URL here." ${STORE.screenshots[0].display ? `value="${STORE.screenshots[0].url}"`: ``}>
          <span>(eg: https://i.imgur.com/3aWOj91.png)</span>
        </li>
        <li>
          <label for="screenshot-desktop-url">Desktop Screenshot URL</label>
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
    console.log(`generateMarkdown fired`);
    const markdownAuthors = generateAuthorMarkdown(STORE.authors);
    const markdownReleases = generateReleaseMarkdown();
    return `${STORE.name === '' ? '' : `## ${STORE.name}`}${STORE.description === '' ? '' : `\n${STORE.description}`}${STORE.sites === '' ? '' : `\n\n## Demo\n[Live Demo](${STORE.sites} "${STORE.sites}")`}${STORE.screenshots[0].url === '' ? '' : `\n![Mobile Screenshot](${STORE.screenshots[0].url})`}${STORE.screenshots[1].url === '' ? '' : `\n![Desktop Screenshot](${STORE.screenshots[1].url})`}${STORE.instructions === '' ? '' : `\n\n## Installation Instructions\n${STORE.instructions}`}${releases.version === '' ? '' : `\n\n## Release History`}\n${markdownReleases}${markdownAuthors === '' ? '' : `\n\n## Authors\n${markdownAuthors}`} ${STORE.license === '' ? '' : `\n\n## License\n${STORE.license}`}
    `;
  }

/* Data Storage */
  const STORE = {
    view: 'start',
    name : 'My Project',
    description : '',
    authors : [],
    sites : '',
    license : '',
    instructions : '',
    screenshots : [
        {type: 'mobile',
        display: false,
        url: ''},
        {type: 'desktop',
        display: false,
        url: ''}
    ]
  }

  const releases = [];
    

/* API Calls */
  /* Get details for repo to put in Readme Options input fields */
  function getRepoDetails (gitRepo) {
    const queryURL = `https://api.github.com/repos/${gitRepo}`;
    
    fetch(queryURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      storeRepoDetails(responseJson);
      getContributors(gitRepo);
    })
    .catch(err => {
      $('#js-error-message').html(`<i class="fas fa-times-circle" aria-hidden="true"></i> Something went wrong: ${err.message}`);
      $('#js-error-message').removeClass('hidden');
    });
  }
  
  /* Get list of contributors for repo to put in Readme Options Author fields */
  function getContributors (gitRepo) {
    const queryURL = `https://api.github.com/repos/${gitRepo}/contributors`;
    
    fetch(queryURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      storeAuthorDetails(responseJson);
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
    const queryURL = `https://api.github.com/repos/${gitRepo}/releases`;
    
    fetch(queryURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      storeReleaseDetails(responseJson);
    })
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

  /* Clears any empty values from Author Array */
  function cleanAuthorArray () {
    const cleanedAuthors = STORE.authors.filter(author => author.length > 0);
    STORE.authors = cleanedAuthors;
  }

  /* Get user input from Form and update STORAGE. */
  function updateFromInput () {
    console.log(`updateFromInput fired`)
    STORE.name = $('#repo-project-name').val();
    STORE.description = $('#repo-project-description').val();
    STORE.sites = $('#repo-live-demo-url').val();
    STORE.instructions = $('#repo-installation-instructions').val();
    STORE.license = $('#repo-license').val();
    STORE.screenshots[0].url = $('#screenshot-mobile-url').val();
    STORE.screenshots[1].url = $('#screenshot-desktop-url').val();

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

  /* Store GitHub Repo details in STORE object */
  function storeRepoDetails (responseJson) {

    STORE.name = responseJson.name;
    STORE.description = responseJson.description;
    
    //Check if has GitHub Pages
    responseJson.has_pages ? STORE.sites = `https://${responseJson.owner.login}.github.io/${responseJson.name}/` : ''; 

    //Check if has a license specified
    responseJson.license === null ? '' : STORE.license = responseJson.license.name;
  }

  function storeReleaseDetails (responseJson) {
    for (let release in responseJson) {
      const projectObject = {};
      projectObject.name = responseJson[release].name;
      projectObject.description = responseJson[release].body;
      projectObject.version = responseJson[release].tag_name;
      projectObject.prerelease = responseJson[release].prerelease;
      projectObject.assets = responseJson[release].assets;
      projectObject.url = responseJson[release].url;

      releases.push(projectObject);
    }
  }

  /* For each contributor in Git Repo, add to Authors array */
  function storeAuthorDetails (responseJson) {
    for (let contributor in responseJson) {
      STORE.authors.push(responseJson[contributor].login);
    }
  }

  /* Gets Author Array Index for current input */
  function getAuthorID (author) {
    return $(author).closest('li').find('input').data('item-id');
  }

  /* Delete Author value from Array */
  function deleteAuthor (authorIndex) {
    STORE.authors.splice(authorIndex, 1);
  }

  /* Add Author value to Array */
  function addAuthor (author) {
    STORE.authors.push(author);
  }

  /* Update Author value in Array */
  function updateAuthor(author, index) {
    STORE.authors[index] = author;
  }

  /* Clears STORE and releases when user pulls data for new repo */
  function resetProject () {
      console.log('resetting project');
      STORE.name = 'My Project';
      STORE.description = '';
      STORE.authors = [];
      STORE.sites = '';
      STORE.license = '';
      STORE.instructions = '';
      STORE.screenshots = [
          {type: 'mobile',
          display: false,
          url: ''},
          {type: 'desktop',
          display: false,
          url: ''}
      ]
      
      releases.length = 0;
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
      $('#resultsPage').hide();
    } else if (STORE.view === 'options') {
      renderReadmeOptions();
      $('#landing-info').hide();
      $('#repoURLForm').show();
      $('#readmeOptionsForm').show();
      $('#resultsPage').hide();
    } else if (STORE.view === 'output') {
      //renderOutput(); 
      $('#landing-info').hide();
      $('#repoURLForm').hide();
      $('#readmeOptionsForm').hide();
      $('#resultsPage').show();
    }
  }

/* Event Listeners */

  /* Watches for submit of User GitHub Repo URL */
  function watchForm() {
      $('#repoURLForm').on('submit', function(event) {
          event.preventDefault();
          $('#js-error-message').addClass('hidden');
          if (STORE.view === 'options') {
           resetProject();
          }
          const gitRepo = getUserRepoInput();
          
          try {
            const githubUserRepo = parseUserInput(gitRepo);
            getRepoDetails(githubUserRepo);
            getRepoReleases(githubUserRepo);
          } catch (e) {
            $('#js-error-message').html(`<i class="fas fa-times-circle" aria-hidden="true"></i> Something went wrong: ${e.message}`);
            $('#js-error-message').removeClass('hidden');
          }

      });
  }
  /* Watches for submit of README details */
  function watchSubmitOptionsButton() {
    $('#readmeOptionsForm').on('submit', function(event) {
        event.preventDefault();
        STORE.view = 'output';
        updateFromInput();
        cleanAuthorArray();
        render();
        const el = generateMarkdown();
        const stackedit = new Stackedit();
        console.log(el);
        // Open the iframe
        stackedit.openFile({
          name: '', // with an optional filename
          content: {
            text: el // and the Markdown content.
          }
        });
    });
  }

  /* Watches for submit of Edit Options */
  function watchEditButton() {
    $('#readmeOutputForm').on('submit', function(event) {
        event.preventDefault();
        STORE.view = 'options';
        render();
    });
  }

  /* Watches for deletion of author */
  function watchDeleteAuthor() {
    $('#readmeOptionsForm').on('click', '.delete-author', function(event) {
      const authorIndex = getAuthorID(this);
      deleteAuthor(authorIndex);
      $('#authorUsernames').html(`<ul>${generateAuthorInputs(STORE.authors)}</ul>`);
    });
  }

  /* Watches for addition of author. does not add author if already added via update author function */
  function watchAddAuthor() {
    $('#readmeOptionsForm').on('click', '.add-author', function(event) {
      const author = $(this).closest('li').find('input').val();      
      const authorIndex = getAuthorID(this);
      if (STORE.authors[authorIndex] !== author) {
        addAuthor(author);
      }
      $('#authorUsernames').html(`<ul>${generateAuthorInputs(STORE.authors)}</ul>`);
    });
  }

  /* Watch for live updates to author usernames */
  function watchUpdateAuthor() {
    $('#readmeOptionsForm').on('change', 'input', function(event) {
      const authorValue = $(this).val();
      const authorIndex = getAuthorID(this);
      updateAuthor(authorValue, authorIndex);
    })
  }

/* Scroll To Top by rdallaire */
  $(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {
        $('#return-to-top').fadeIn(200);
    } else {
        $('#return-to-top').fadeOut(200);
    }
  });
  $('#return-to-top').click(function() {
    $('body,html').animate({
        scrollTop : 0
    }, 500);
  });

  /* Run on Initialize */
  function initializePage() {
    //Event Listeners
    watchForm();
    watchSubmitOptionsButton();
    watchEditButton();
    watchDeleteAuthor();
    watchAddAuthor();
    watchUpdateAuthor();

    //Render Function
    render();
  }

//Run on page initialize
  $(initializePage);