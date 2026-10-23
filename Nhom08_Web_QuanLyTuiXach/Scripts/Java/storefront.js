const featuredGrid = document.getElementById("homeFeaturedProducts");

if (featuredGrid) {
    featuredGrid.innerHTML = products.slice(0, 4).map(product => `
        <article class="product catalog-product">
            <div class="product-image">

                <a class="catalog-product-image"
                   href="${productDetailUrl}?id=${product.id}"
                   aria-label="Xem ${product.name}">

                    <img src="${product.image}"
                         alt="${product.name}"
                         loading="lazy">
                </a>

                <span class="product-label">
                    ${product.label || "NEW"}
                </span>

                <button class="favorite"
                        type="button"
                        onclick="toggleWish(${product.id})"
                        aria-label="Lưu ${product.name} vào yêu thích">

                    <i class="fa-regular fa-heart"></i>

                </button>

                <div class="catalog-product-actions">

                    <a class="catalog-icon-action"
                       href="${productDetailUrl}?id=${product.id}"
                       aria-label="Xem chi tiết ${product.name}"
                       title="Xem chi tiết">

                        <i class="fa-solid fa-book-open"></i>

                    </a>

                    <button class="catalog-icon-action"
                            type="button"
                            onclick="addCart(${product.id})"
                            aria-label="Thêm ${product.name} vào giỏ"
                            title="Thêm vào giỏ">

                        <i class="fa-solid fa-bag-shopping"></i>

                    </button>

                </div>
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

                    <span class="old-price">
                        ${product.oldPrice
            ? `${product.oldPrice.toLocaleString("vi-VN")}đ`
            : ""
        }
                    </span>
                </div>

            </div>
        </article>
    `).join("");
}