//(Controller has a live connection to both model and view)
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
//NPM imports
import 'core-js/stable';
import 'regenerator-runtime/runtime';

//Module reloading
if (module.hot) {
  module.hot.accept();
}

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Forkify API
 * @returns recipe data
 */
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Display the recipe (Controller function)
const controlRecipes = async function () {
  try {
    //Get the recipe id from url
    const id = window.location.hash.slice(1);

    if (!id) return;

    //Render spinner
    recipeView.renderSpinner();

    // Update the results view to mark the selected search result
    resultsView.update(model.getSearchResultsPage());

    //1) Loading Recipe
    await model.loadRecipe(id);

    //2. Rendering the recipe
    recipeView.render(model.state.recipe);
    controlRecipes();
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Render spinner
    recipeView.renderSpinner();

    //2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    //4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

/**
 * Listening to hash change and load  events - (format) window.addEventListener(event, handler function)
 *  window.addEventListener('hashchange', showRecipe);
 * window.addEventListener('load', showRecipe);
 * Instead of this we could do
 */

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
