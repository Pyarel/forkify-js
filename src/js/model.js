export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    // Loading Recipe
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604691c37cdc054bd034'
    );

    const data = await res.json();

    // Guard clause - if response status is failed
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // console.log(data);

    //Extract the recipe data
    let { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    console.error(err);
  }
};
