const input = document.querySelector("input");
const searchBtn = document.querySelector(".search-box button");
const cardContainer = document.querySelector(".card-container");
const recipeDetails = document.querySelector(".recipe-details");

const fetchRecipeList = async (mainIngredient) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`);
    response = await response.json();
    return response.meals;
}

const searchMealById = async (id) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    response = await response.json();
    return response.meals[0];
}

const addDetails = (container, mealObj) => {
    const name = document.createElement("h2");
    name.innerText = mealObj.strMeal;
    container.append(name)
    const details = document.createElement("p");
    details.innerText = mealObj.strInstructions;
    container.append(details);
    const img = document.createElement("img");
    img.src = mealObj.strMealThumb;
    container.append(img);
}

const createCardFromRecipeObject = (recipeObj) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const image = document.createElement('img');
    image.src = recipeObj.strMealThumb;
    const name = document.createElement('h3');
    name.textContent = recipeObj.strMeal;
    card.append(image);
    card.append(name);
    card.addEventListener('click', async () => {
        console.log(`Getting details about ${recipeObj.strMeal}`);
        while (recipeDetails.childElementCount > 1) {
            recipeDetails.lastChild.remove();
        }
        addDetails(recipeDetails, await searchMealById(recipeObj.idMeal));
        recipeDetails.style.display = "block";
    })
    cardContainer.append(card);
}

searchBtn.addEventListener('click', async () => {
    const searchValue = input.value;
    const recipeList = await fetchRecipeList(searchValue);
    while(cardContainer.firstChild) cardContainer.firstChild.remove();
    recipeList.forEach(recipe => {
        createCardFromRecipeObject(recipe);
    });
});

document.querySelector(".recipe-details button").addEventListener("click", () => {
    recipeDetails.style.display = "none";
});

window.addEventListener("click", (e) => {
    const closest = e.target.closest(".recipe-details");
    if(closest) return;
    recipeDetails.style.display = "none";
});