const directusAsset = "http://localhost:8055/assets/" // use it for image src paths
const endpoint = "https://kks-eshop.hasura.app/v1/graphql";
const headers = {
    "content-type": "application/json",
    "x-hasura-admin-secret": "sVDVwDf88gNYrXxcDjN1wwr1Wa0WNic0CX2rvuK669xtX9ZxAsifEsQMFuBa8Usq",
};

async function FrontPageProducts() { // Can use "limit 6" to limit the amount of products shown on the front page
    const FrontPageProductsQuery = {
        "operationName": "FrontPageProducts",
        "query": `query FrontPageProducts {
            products(where: {on_frontpage: {_eq: true}}) { 
            image
            name
            price
            category_id
            }
        }`,
        "variables": {}
    };

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(FrontPageProductsQuery)
    };

    const response = await fetch(endpoint, options);
    const data = await response.json();

    console.log(data.data);
    console.log(data.errors);

    const products = data.data.products;
    const productContainer = document.querySelector(".product-container");

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.setAttribute("category-id", product.category_id);

        const productNamePriceDiv = document.createElement("div");
        productNamePriceDiv.classList.add("name-price-container");

        const productImage = document.createElement("img");
        productImage.src = directusAsset + product.image;
        productImage.alt = product.name;
        productImage.classList.add("product-image");

        const productName = document.createElement("h2");
        productName.textContent = product.name;
        productName.classList.add("product-name");

        const productPrice = document.createElement("p");
        productPrice.textContent = product.price + "€";
        productPrice.classList.add("product-price");

        // Appends price and name to the same div

        productNamePriceDiv.appendChild(productName);
        productNamePriceDiv.appendChild(productPrice);

        // Appends image and name/price div to the product div

        productDiv.appendChild(productImage);
        productDiv.appendChild(productNamePriceDiv);

        // Appends product div to the product container

        productContainer.appendChild(productDiv);
    });
}

async function FrontPageFilterSettings() {
    const FrontPageFilterSettings = {
        "operationName": "FrontPageFilterSettings",
        "query": `query FrontPageFilterSettings {
            categories(where: {products: {category_id: {_is_null: false}}}) {
              name
              id
            }
          }`,
        "variables": {}
    };

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(FrontPageFilterSettings)
    };

    const response = await fetch(endpoint, options);
    const data = await response.json();

    console.log(data.data);
    console.log(data.errors);

    const categories = data.data.categories;
    const filterSettings = document.querySelector(".filter-settings");

    categories.forEach(category => {
        const filterName = document.createElement("a");
        filterName.textContent = category.name;
        filterName.classList.add("filter-name");
        filterName.setAttribute("id", category.id);
        filterName.onclick = FilterProducts;

        filterSettings.appendChild(filterName);
    });
}

async function FilterProducts() {
    const categoryID = this.getAttribute("id");

    const FilterProducts = {
        "operationName": "FilterProducts",
        "query": `query FilterProducts {
            products(where: {category: {name: {}, id: {_eq: ${categoryID}}}}) {
                name
            }
        }`,
    };

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(FilterProducts)
    };

    const response = await fetch(endpoint, options);
    const data = await response.json();

    console.log("FilterProducts", data.data);
    console.log("FilterProducts", data.errors);

    const products = document.querySelectorAll(".product-container .product");
    products.forEach(product => {
        if (categoryID == product.getAttribute("category-id")) {
            product.style.display = "flex";
        } else {
            product.style.display = "none";
        }
    });
}

async function AddedToCart() {
    const graphqlQuery = {
        "operationName": "ProductsToTheCart",
        "query": `query ProductsToCart {
            products(where: {added_tocart: {_eq: true}}, limit: 6) {
            image
            name
            price
            }
        }`,
        "variables": {}
    };

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(graphqlQuery)
    };

    const response = await fetch(endpoint, options);
    const data = await response.json();

    console.log(data.data);
    console.log(data.errors);

    const products = data.data.products;
    const productContainer = document.querySelector(".product-container");

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        const productNamePriceDiv = document.createElement("div");
        productNamePriceDiv.classList.add("name-price-container");

        const productImage = document.createElement("img");
        productImage.src = directusAsset + product.image;
        productImage.alt = product.name;
        productImage.classList.add("product-image");

        const productName = document.createElement("h2");
        productName.textContent = product.name;
        productName.classList.add("product-name");

        const productPrice = document.createElement("p");
        productPrice.textContent = product.price + "€";
        productPrice.classList.add("product-price");

        // Appends price and name to the same div

        productNamePriceDiv.appendChild(productName);
        productNamePriceDiv.appendChild(productPrice);

        // Appends image and name/price div to the product div

        productDiv.appendChild(productImage);
        productDiv.appendChild(productNamePriceDiv);

        // Appends product div to the product container

        productContainer.appendChild(productDiv);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    FrontPageProducts();
    FrontPageFilterSettings();
    AddedToCart();
});