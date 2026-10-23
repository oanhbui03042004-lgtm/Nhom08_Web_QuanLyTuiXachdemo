const wishlist = JSON.parse(
    localStorage.getItem("wishlist") || "[]"
);

const wishlistContainer =
    document.getElementById("wish");

const wishlistProducts = wishlist.length
    ? products.filter(
        product => wishlist.includes(product.id)
    )
    : products.slice(0, 3);


if (wishlistContainer) {

    wishlistContainer.innerHTML =
        wishlistProducts.map(product => `
            <article class="product">

                <a href="${productDetailUrl}?id=${product.id}">

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                    </div>

                    <div class="product-info">

                        <div class="product-category">
                            ${product.category}
                        </div>

                        <h3 class="product-name">
                            ${product.name}
                        </h3>

                        <div class="price">
                            ${product.price.toLocaleString("vi-VN")}đ
                        </div>

                    </div>

                </a>

            </article>
        `).join("");

}