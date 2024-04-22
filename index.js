document.addEventListener("DOMContentLoaded", function() {
  axios.get('https://rickandmortyapi.com/api/character')
    .then(function (response) {
      var characters = response.data.results;
      criarOptions(characters);
      showCharacterInfo(characters[0]);
      var locationUrl = characters[0].location.url;
      var locationId = getLocationIdFromUrl(locationUrl);
      fetchLocationDimensions(locationId);

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
      var originElement = document.querySelector('.show_origin');
      originElement.textContent = "(" + location.dimension + ")";
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

