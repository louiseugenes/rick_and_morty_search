document.addEventListener("DOMContentLoaded", function() {
  axios.get('https://rickandmortyapi.com/api/character')
    .then(function (response) {
      var characters = response.data.results;
      var info = response.data.info;
      var nextPage = info.next;
      
      function getAllCharacters(nextPage) {
        if (nextPage !== null) {
          axios.get(nextPage)
            .then(function(response) {
              characters = characters.concat(response.data.results);
              nextPage = response.data.info.next;
              getAllCharacters(nextPage);
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          criarOptions(characters);
          var episodes = characters[0].episode;
          criarOptionsEpisodes(episodes);
          showCharacterInfo(characters[0]);
        }
      }
      getAllCharacters(nextPage);
    })
    .catch(function (error) {
      console.log(error);
    });
});

function getLocationIdFromUrl(url) {
  var matches = url.match(/\/(\d+)\/?$/);
  if (matches) {
    return matches[1];
  }
  return null;
}

function fetchLocationDimensions(locationId) {
  axios.get('https://rickandmortyapi.com/api/location/' + locationId)
    .then(function (response) {
      var location = response.data;
      var residentesUrls = location.residents;
      criarOptionsResidents(residentesUrls);
      var originElement = document.querySelector('.show_origin');
      originElement.textContent = "(" + location.dimension + ")";
    })
    .catch(function (error) {
      console.log(error);
    });
}

function fetchFirstEpisode(espisodeId) {
  axios.get('https://rickandmortyapi.com/api/episode/' + espisodeId)
    .then(function (response) {
      var episode = response.data;
      var originElement = document.querySelector('.show_first_seen');
      originElement.textContent = episode.name;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function fetchAllEpisodes(episodes) {
  axios.get('https://rickandmortyapi.com/api/episode/' + espisodeId)
    .then(function (response) {
      var episode = response.data;
      var originElement = document.querySelector('.show_first_seen');
      originElement.textContent = episode.name;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function criarOptions(personagens) {
  var select = document.querySelector('.select-first');
  select.innerHTML = '';
  select.innerHTML += '<option value="" disabled selected>Sobre quem você quer saber?</option>';

  personagens.forEach(function(personagem) {
    select.innerHTML += '<option value="' + personagem.id + '">' + personagem.name + '</option>';
  });

  select.addEventListener('change', function() {
    var selectedCharacterId = parseInt(this.value);
    var selectedCharacter = personagens.find(function(character) {
      return character.id === selectedCharacterId;
    });
    showCharacterInfo(selectedCharacter);
    updateStatus(selectedCharacter);
  });
}

function criarOptionsEpisodes(episodes) {
  var select = document.querySelector('.select_first_episodes');
  select.innerHTML = '';
  select.innerHTML += '<option value="" disabled selected>Ver episódios</option>';

  episodes.forEach(function(episodeUrl) {
    var episodeId = getLocationIdFromUrl(episodeUrl);
    axios.get('https://rickandmortyapi.com/api/episode/' + episodeId)
      .then(function (response) {
        var episode = response.data;
        select.innerHTML += '<option value="' + episode.id + '">' + episode.name + '</option>';
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  select.addEventListener('change', function() {
    var selectedEpisodeId = parseInt(this.value);
    axios.get('https://rickandmortyapi.com/api/episode/' + selectedEpisodeId)
      .then(function(response) {
        var selectedEpisode = response.data;
        showEpisodeInfo(selectedEpisode);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}

function criarOptionsResidents(residents) {
  var select = document.querySelector('.select_first_residents');
  select.innerHTML = '';
  select.innerHTML += '<option value="" disabled selected>Conhecer os vizinhos</option>';

  residents.forEach(function(residentUrl) {
    var residentId = getLocationIdFromUrl(residentUrl);
    axios.get('https://rickandmortyapi.com/api/character/' + residentId)
      .then(function (response) {
        var resident = response.data;
        select.innerHTML += '<option value="' + resident.id + '">' + resident.name + '</option>';
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  select.addEventListener('change', function() {
    var selectedResidentId = parseInt(this.value);
    axios.get('https://rickandmortyapi.com/api/character/' + selectedResidentId)
      .then(function(response) {
        var selectedResident = response.data;
        showResidentInfo(selectedResident);
      })
      .catch(function(error) {
        console.log(error);
      });
  });
}
function showCharacterInfo(character) {
  var nameElement = document.querySelector('.show_name');
  var statusElement = document.querySelector('.show_status');
  var locationElement = document.querySelector('.show_location');
  var imageElement = document.querySelector('.show_image img');

  nameElement.textContent = character.name;
  statusElement.textContent = character.status + " - " + character.species;
  locationElement.textContent = character.location.name;

  imageElement.src = character.image;
  imageElement.alt = character.name;

  var locationUrl = character.location.url;
  var locationId = getLocationIdFromUrl(locationUrl);
  fetchLocationDimensions(locationId);

  var episodeUrl = character.episode[0];
  console.log(episodeUrl);
  var espisodeId = getLocationIdFromUrl(episodeUrl);
  fetchFirstEpisode(espisodeId);

  var episodes = character.episode;
  criarOptionsEpisodes(episodes);


  updateStatus(statusElement, character);
}

function updateStatus(statusElement, character) {
  let status = character.status.toLowerCase();
  let newContent = status + " - " + character.species;

  statusElement.textContent = newContent;

  switch (status) {
    case "dead":
      statusElement.classList.add('dead');
      statusElement.classList.remove('alive', 'unknown');
      break;
    case "alive":
      statusElement.classList.add('alive');
      statusElement.classList.remove('dead', 'unknown');
      break;
    default:
      statusElement.classList.add('unknown');
      statusElement.classList.remove('dead', 'alive');
  }
  statusElement.textContent = statusElement.textContent.charAt(0).toUpperCase() + statusElement.textContent.slice(1).toLowerCase();
}