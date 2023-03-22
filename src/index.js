import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const countryListEl = document.querySelector('ul.country-list');
countryListEl.previousElementSibling.addEventListener(
  'input',
  debounce(onInput, DEBOUNCE_DELAY)
);

function onInput() {
  const nameCountry = countryListEl.previousElementSibling.value.trim();
  if (nameCountry === '' || nameCountry === ' ') {
    countryListEl.nextElementSibling.innerHTML = '';
    countryListEl.innerHTML = '';
    return;
  } else {
    fetchCountries(nameCountry)
      .then(country => {
        if (country.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          countryListEl.innerHTML = '';
          countryListEl.nextElementSibling.innerHTML = '';
        } else if (country.length > 2 && country.length <= 10) {
          countryListEl.nextElementSibling.innerHTML = '';
          countryListEl.innerHTML = country
            .map(i => {
              return `<div class="country-list_flag"><img src="${i.flags.svg}" alt="" width="32" /><div class="country-list_title">${i.name.common}</div></div>`;
            })
            .join('');
        } else {
          countryListEl.innerHTML = '';
          countryListEl.nextElementSibling.innerHTML = `<div class="country-info_flag"><img src="${
            country[0].flags.svg
          }" alt="" width="32" /><div class="country-info_title">${
            country[0].name.common
          }</div></div><div class="country-info_description"><b>Capital:</b> ${
            country[0].capital[0]
          }</div><div class="country-info_description"><b>Population:</b> ${
            country[0].population
          }</div><div class="country-info_description"><b>Languages:</b> ${
            Object.values(country[0].languages)[0]
          }</div>`;
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        countryListEl.innerHTML = '';
        countryListEl.nextElementSibling.innerHTML = '';
      });
  }
}
