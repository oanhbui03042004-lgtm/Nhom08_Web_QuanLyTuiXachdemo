const grid = document.getElementById("products");
const search = document.getElementById("searchInput");
const count = document.getElementById("catalogCount");

let category = "all";

function renderProducts() {

    const query = search.value.trim().toLocaleLowerCase("vi");

    const visibleProducts = products.filter(product =>
        (category === "all" || product.category === category) &&
        product.name.toLocaleLowerCase("vi").includes(query)
    );

    count.textContent = `${visibleProducts.length} sản phẩm`;

    grid.innerHTML = visibleProducts.map(product => `

        <article class="product catalog-product">

            <div class="product-image">

                <a
                    class="catalog-product-image"
                    href="${productDetailUrl}?id=${product.id}"
                    aria-label="Xem ${product.name}">

                    <img
                       src="${window.mvcRoot}Content/${product.image}"
                        alt="${product.name}"
                        loading="lazy">

                </a>

                <span class="product-label">
                    ${product.label || "NEW"}
                </span>

                <button
                    class="favorite"
                    onclick="toggleWish(${product.id})"
                    aria-label="Thêm ${product.name} vào yêu thích">

                    <i class="fa-regular fa-heart"></i>

                </button>

                <div class="catalog-product-actions">

                    <a
                        class="catalog-icon-action"
                        href="${productDetailUrl}?id=${product.id}"
                        aria-label="Xem chi tiết ${product.name}"
                        title="Xem chi tiết">

                        <i class="fa-solid fa-book-open"></i>

                    </a>

                    <button
                        class="catalog-icon-action"
                        type="button"
                        onclick="addCart(${product.id})"
                        aria-label="Thêm ${product.name} vào giỏ hàng"
                        title="Thêm vào giỏ hàng">

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
            ? product.oldPrice.toLocaleString("vi-VN") + "đ"
            : ""
        }

                    </span>

                </div>

            </div>

        </article>

    `).join("") || `

        <p class="catalog-empty">
            Không tìm thấy túi phù hợp.
            Thử đổi từ khóa hoặc danh mục nhé.
        </p>

    `;
}


// ================================
// TÌM KIẾM SẢN PHẨM
// ================================

search.addEventListener("input", renderProducts);


// ================================
// LỌC SẢN PHẨM THEO DANH MỤC
// ================================

document.querySelectorAll(".filter button").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter button").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        category = button.dataset.cat;

        renderProducts();

    });

});


// ================================
// HIỂN THỊ SẢN PHẨM LẦN ĐẦU
// ================================

renderProducts();