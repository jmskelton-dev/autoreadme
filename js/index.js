'use strict';

/*  Gets user input from text input field. */
function getUserRepoInput() {
  return $('#repo-url').val();
}

function parseUserInput (url) {
  let githubUserRepo = url.slice(19).split('/').slice(0, 2).join('/');
  return githubUserRepo;
}

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

function gitRepoDetails (responseJson) {
    console.log(responseJson);

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

function gitReleaseDetails (responseJson) {
    console.log(responseJson);

}

function watchForm() {
    $('#repoURLForm').on('submit', function(event) {
        event.preventDefault();
        const gitRepo = getUserRepoInput();
        const githubUserRepo = parseUserInput(gitRepo)
        getRepoDetails(githubUserRepo);
    });
}

$(watchForm);