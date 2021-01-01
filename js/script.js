let divCountries = null;
let divFavoritesCountries = null;

let arrayCountries = [];
let arrayFavoritesCountries = [];

let spanCountCountries = null;
let spanCountFavoritesCountries = null;

let spanTotalPopulationCountries = null;
let spanTotalPopulationFavoritesCountries = null;

let numberFormat = null;

window.addEventListener('load', () => {
  const getHTMLfromArrayCountry = (arrayParam, buttonCharacter) => {
    let countriesHTML = '<div>';

    arrayParam.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    arrayParam.forEach((country) => {
      const { name, flag, population, formatedPopulation, id } = country;

      //prettier-ignore
      const countryHtml = `
      <div class='country'>
        <div>
          <a id="${id}"class="wave-effect waves-light btn${buttonCharacter==="-"?" red darken-4":""}">${buttonCharacter}</a>
        </div>          
        <div>
          <img src="${flag}" name="${name}" class="img-flag">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formatedPopulation}</li>
          <ul>
        </div>
      </div>
      `;

      countriesHTML += countryHtml;
    });

    countriesHTML += '</div>';
    return countriesHTML;
  };

  const renderCoutriesList = () => {
    const list = getHTMLfromArrayCountry(arrayCountries, '+');
    divCountries.innerHTML = list;
  };

  const renderFavoritesCoutriesList = () => {
    //arrayFavoritesCountries.push(...arrayCountries);
    const list = getHTMLfromArrayCountry(arrayFavoritesCountries, '-');
    divFavoritesCountries.innerHTML = list;
  };

  const renderSummary = () => {
    spanCountCountries.textContent = arrayCountries.length;
    spanCountFavoritesCountries.textContent = arrayFavoritesCountries.length;

    //prettier-ignore
    const totalPopulation = arrayCountries.reduce((acc, current) => acc + current.population, 0);
    spanTotalPopulationCountries.textContent = formatNumber(totalPopulation);

    //prettier-ignore
    const totalPopulationFav = arrayFavoritesCountries.reduce((acc, current) => acc + current.population, 0);
    spanTotalPopulationFavoritesCountries.textContent = formatNumber(
      totalPopulationFav
    );
  };

  const handleCoutriesButtons = () => {
    const addToFavorites = (id) => {
      const country = arrayCountries.find((current) => current.id === id);

      arrayFavoritesCountries.push(country);

      const index = arrayCountries.indexOf(country);
      arrayCountries.splice(index, 1);

      render();
    };

    const removeFromFavorites = (id) => {
      const country = arrayFavoritesCountries.find(
        (current) => current.id === id
      );

      arrayCountries.push(country);

      const index = arrayFavoritesCountries.indexOf(country);
      arrayFavoritesCountries.splice(index, 1);

      render();
    };

    //ini handleCoutriesButtons()
    const countryButtons = Array.from(divCountries.querySelectorAll('.btn'));
    const countryFavsButtons = Array.from(
      divFavoritesCountries.querySelectorAll('.btn')
    );

    countryButtons.forEach((button) => {
      button.addEventListener('click', () => addToFavorites(button.id));
    });

    countryFavsButtons.forEach((button) => {
      button.addEventListener('click', () => removeFromFavorites(button.id));
    });
  };

  const render = () => {
    renderCoutriesList();
    renderFavoritesCoutriesList();
    renderSummary();
    handleCoutriesButtons();
  };

  const fetchCountries = async () => {
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    const json = await res.json();

    arrayCountries = json.map((country) => {
      const { numericCode, translations, population, flag } = country;

      return {
        id: numericCode,
        name: translations.br,
        population,
        formatedPopulation: formatNumber(population),
        flag,
      };
    });

    render();
  };

  const formatNumber = (number) => {
    return numberFormat.format(number);
  };

  //ini onLoad
  divCountries = document.querySelector('#divListCountries');
  divFavoritesCountries = document.querySelector('#divListFavoritesCountries');

  spanCountCountries = document.querySelector('#spanCountCountries');
  //prettier-ignore
  spanCountFavoritesCountries = document.querySelector('#spanCountFavoritesCountries');

  spanTotalPopulationCountries = document.querySelector('#spanTotalPopulation');
  //prettier-ignore
  spanTotalPopulationFavoritesCountries = document.querySelector('#spanTotalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});
