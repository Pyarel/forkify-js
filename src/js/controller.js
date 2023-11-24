//Named exports
import * as model from './model.js';
import recipeView from './views/recipeView.js';

// console.log(icons);
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Display the recipe
const controlRecipes = async function () {
  try {
    //Get the recipe id from url
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;

    //Render spinner
    recipeView.renderSpinner();

    //1) Loading Recipe
    await model.loadRecipe(id);

    //2. Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Listening to hash change and load  events - (format) window.addEventListener(event, handler function)
 *  window.addEventListener('hashchange', showRecipe);
 * window.addEventListener('load', showRecipe);
 * Instead of this we could do
 */

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
