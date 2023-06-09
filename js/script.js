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
            id
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
        productDiv.setAttribute("id", product.id);

        //////////////////////////////////////////////////////////////////////////////

        // NOTE: The product data isn't transferred over to the product.html page, though the data is fetched.
        // You can check the console log after disabling the redirect below.

        productDiv.onclick = function () {
            const productID = product.id;
            window.location.href = "product.html?productID=" + productID;
            GetProductData(productID);
        };

        //////////////////////////////////////////////////////////////////////////////

        const productNamePriceDiv = document.createElement("div");
        productNamePriceDiv.classList.add("name-price-container");

        const productImage = document.createElement("img");
        productImage.src = directusAsset + product.image;
        productImage.alt = product.name;
        productImage.height = 500;
        productImage.width = 500;
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
    console.log("categoryID", categoryID);

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
    const ProductsInCart = {
        "operationName": "ProductsInCart",
        "query": `query ProductsInCart {
            products(where: {in_cart: {_eq: true}}) {
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
        body: JSON.stringify(ProductsInCart)
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
        productImage.height = 100;
        productImage.width = 100;
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

async function GetProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = BigInt(urlParams.get("productID"));
    console.log("productId", productId);
  
    const getProductDataQuery = `
      query GetProductData($productId: bigint) {
        products(where: { id: { _eq: $productId } }) {
          description
          image
          name
          price
          id
        }
      }
    `;
  
    const variables = {
      productId: productId.toString()
    };
  
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        query: getProductDataQuery,
        variables: variables
      }),
    };
  
    try {
      const response = await fetch(endpoint, options);
      const data = await response.json();
  
      console.log("GetProductData", data.data);
      console.log("GetProductData", data.errors);
  
      // Clear the previous content
      const productDataContainer = document.querySelector(".product-data");
      productDataContainer.innerHTML = "";
  
      if (data.data && data.data.products && data.data.products.length > 0) {
        const product = data.data.products[0];
  
        // Create elements to display the product data
        const productName = document.createElement("h2");
        productName.textContent = product.name;
        productName.classList.add("product-name");
  
        const productPrice = document.createElement("p");
        productPrice.textContent = product.price + "€";
        productPrice.classList.add("product-price");
  
        const productDescription = document.createElement("div");
        productDescription.textContent = product.description;
        productDescription.classList.add("description");
  
        const productImage = document.createElement("img");
        productImage.src = directusAsset + product.image;
        productImage.alt = product.name;
        productImage.classList.add("product-image");
  
        // Append the product data elements to the productDataContainer
        productDataContainer.appendChild(productName);
        productDataContainer.appendChild(productPrice);
        productDataContainer.appendChild(productDescription);
        productDataContainer.appendChild(productImage);
      } else {
        console.log("No product data found");
      }
    } catch (error) {
      console.log("Error retrieving product data:", error);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    // removes unnecessary runs of functions
    window.location.pathname == "/frontpage.html" ? FrontPageProducts() : console.log("Not on frontpage");
    window.location.pathname == "/frontpage.html" ? FrontPageFilterSettings() : console.log("Not on frontpage");
    window.location.pathname == "/cart.html" ? AddedToCart() : console.log("Not on cart");
    window.location.pathname == "/product.html" ? GetProductData() : console.log("Not on product page");
});