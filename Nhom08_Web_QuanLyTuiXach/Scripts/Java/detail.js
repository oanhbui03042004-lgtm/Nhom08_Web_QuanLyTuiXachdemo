const productId = Number(
    new URLSearchParams(location.search).get("id") || 1
);

const product =
    products.find(item => item.id === productId) ||
    products[0];

const detail =
    document.getElementById("detail");

const reviewList =
    document.getElementById("reviewList");

const reviewSummary =
    document.getElementById("reviewSummary");

const reviewForm =
    document.getElementById("reviewForm");

const savedReviewKey =
    `maisoneReviews-${product.id}`;

const productColors =
    getProductColors(product);

const initialVariant =
    getProductVariant(
        product,
        productColors[0]
    );


function escapeProductText(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]
    );
}
function resolveProductImage(image) {
    if (!image) return "";

    image = String(image).trim();

    if (/^(https?:)?\/\//i.test(image)) {
        return image;
    }

    image = image.replace(/^\/+/, "");
    image = image.replace(/^Content\/+/, "");

    return window.mvcRoot + image;
}

detail.innerHTML = `
    <div class="detail-media">

        <div class="detail-main-image">
            <img
                src="${escapeProductText(window.mvcRoot + initialVariant.image)}"
                alt="${escapeProductText(product.name)}"
            >
        </div>

        <div class="detail-image-caption">
            <i class="fa-regular fa-heart"></i>
            <span>
                Một thiết kế được chọn lựa cho nhịp sống của bạn.
            </span>
        </div>

    </div>

    <div class="detail-info">

        <div class="detail-kicker">
            <span>
                ${escapeProductText(product.category)}
            </span>

            <span>
                ${escapeProductText(
    product.label || "MAISONÉ EDIT"
)}
            </span>
        </div>

        <h1 class="page-title">
            ${escapeProductText(product.name)}
        </h1>

        <div class="detail-price">
            ${product.price.toLocaleString("vi-VN")}đ

            <del>
                ${product.oldPrice
        ? `${product.oldPrice.toLocaleString("vi-VN")}đ`
        : ""
    }
            </del>
        </div>

        <div class="detail-rating">

            <span
                aria-label="Đánh giá 4.8 trên 5"
            >
                ★★★★★
            </span>

            <a href="#reviews">
                4.8 · Xem đánh giá
            </a>

        </div>

        <p class="detail-description">
            ${escapeProductText(
        product.description ||
        "Thiết kế túi Maisoné."
    )}
        </p>

        ${product.details?.length
        ? `
                    <div class="detail-spec-card">

                        ${product.details
            .map(
                ([label, value]) => `
                                    <div>
                                        <span>
                                            ${escapeProductText(label)}
                                        </span>

                                        <b>
                                            ${escapeProductText(value)}
                                        </b>
                                    </div>
                                `
            )
            .join("")}

                    </div>
                  `
        : ""
    }

        <div
            class="detail-choice-group"
            data-group="color"
            ${productColors.length <= 1 ? "hidden" : ""}
        >

            <b>MÀU SẮC</b>

            <div class="choices">

                ${productColors
        .map(
            (color, index) => `
                            <button
                                class="choice ${index === 0
                    ? "active"
                    : ""
                }"
                                type="button"
                                data-choice="${escapeProductText(color)}"
                                aria-pressed="${index === 0
                }"
                            >
                                ${escapeProductText(color)}
                            </button>
                        `
        )
        .join("")}

            </div>

        </div>

        <div class="detail-actions">

            <button
                class="ui-btn"
                id="detailAddCart"
                type="button"
            >
                THÊM VÀO GIỎ
                <i class="fa-solid fa-bag-shopping"></i>
            </button>

            <button
                class="ui-btn light"
                id="detailWishlist"
                type="button"
            >
                <i class="fa-regular fa-heart"></i>
                LƯU YÊU THÍCH
            </button>

        </div>

        <div class="detail-service-notes">

            <span>
                <i class="fa-solid fa-truck-fast"></i>
                Giao hàng toàn quốc
            </span>

            <span>
                <i class="fa-solid fa-shield-halved"></i>
                Hỗ trợ bảo hành
            </span>

            <span>
                <i class="fa-solid fa-rotate-left"></i>
                Hỗ trợ đổi trả
            </span>

        </div>

    </div>

    <section class="detail-story-card">

        <span class="eyebrow">
            THE STORY
        </span>

        <h2>
            ${escapeProductText(
            product.storyTitle ||
            `${product.name} — một thiết kế Maisoné`
        )}
        </h2>

        <p>
            ${escapeProductText(
            product.story ||
            product.description
        )}
        </p>

    </section>
`;


const reviewLink =
    document.querySelector(
        ".detail-rating a"
    );

const ratingLabel =
    document.querySelector(
        ".detail-rating > span"
    );


function selectChoice(button) {

    button.parentElement
        .querySelectorAll(".choice")
        .forEach(choice => {

            choice.classList.toggle(
                "active",
                choice === button
            );

            choice.setAttribute(
                "aria-pressed",
                choice === button
                    ? "true"
                    : "false"
            );

        });
}


detail.addEventListener(
    "click",
    event => {

        const choice =
            event.target.closest(".choice");

        if (!choice) return;

        selectChoice(choice);

        const variant =
            getProductVariant(
                product,
                choice.dataset.choice
            );

        const image =
            detail.querySelector(
                ".detail-main-image img"
            );

        image.src = window.mvcRoot + variant.image;

        image.alt =
            `${product.name} - ${variant.color}`;
    }
);


document
    .getElementById("detailAddCart")
    .addEventListener(
        "click",
        () => {

            const color =
                detail.querySelector(
                    '[data-group="color"] .choice.active'
                )?.dataset.choice ||
                productColors[0];

            addCart(
                product.id,
                {
                    color
                }
            );
        }
    );


document
    .getElementById("detailWishlist")
    .addEventListener(
        "click",
        () => toggleWish(product.id)
    );


const demoReviews = [

    {
        name: "Ngọc Mai",
        rating: 5,
        text:
            "Phom túi đẹp, màu sang và dễ phối đồ. Mình dùng đi làm lẫn đi chơi đều hợp.",
        date: "Khách hàng Maisoné"
    },

    {
        name: "Thu Hà",
        rating: 5,
        text:
            "Túi được đóng gói cẩn thận, chất liệu mềm và các ngăn bên trong rất tiện.",
        date: "Khách hàng Maisoné"
    },

    {
        name: "Minh Anh",
        rating: 4,
        text:
            "Thiết kế xinh, kích thước vừa đủ cho những vật dụng cần thiết mỗi ngày.",
        date: "Khách hàng Maisoné"
    }

];


function readReviews() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    savedReviewKey
                ) || "[]"
            );

        return [
            ...saved,
            ...demoReviews
        ];

    } catch (error) {

        toast(
            "Không đọc được đánh giá đã lưu trên trình duyệt."
        );

        return demoReviews;
    }
}


function renderReviews() {

    const reviews =
        readReviews();

    const average =
        reviews.reduce(
            (sum, review) =>
                sum + Number(review.rating),
            0
        ) / reviews.length;

    reviewSummary.innerHTML = `
        <strong>
            ${average.toFixed(1)}
        </strong>

        <span>
            ${"★".repeat(
        Math.round(average)
    )
        }${"☆".repeat(
            5 - Math.round(average)
        )
        }
        </span>

        <small>
            ${reviews.length} nhận xét
        </small>
    `;

    reviewLink.textContent =
        `${average.toFixed(1)} · Xem ${reviews.length} đánh giá`;

    ratingLabel.setAttribute(
        "aria-label",
        `Đánh giá ${average.toFixed(1)} trên 5`
    );

    ratingLabel.textContent =
        `${"★".repeat(
            Math.round(average)
        )
        }${"☆".repeat(
            5 - Math.round(average)
        )
        }`;

    reviewList.innerHTML =
        reviews
            .map(
                review => `
                    <article class="customer-review-card">

                        <div class="customer-review-avatar">
                            ${String(
                    review.name || "K"
                )
                        .trim()
                        .charAt(0)
                        .toUpperCase()
                    }
                        </div>

                        <div>

                            <div class="customer-review-meta">

                                <strong>
                                    ${escapeReviewText(
                        review.name ||
                        "Khách hàng Maisoné"
                    )
                    }
                                </strong>

                                <span>
                                    ${escapeReviewText(
                        review.date ||
                        "Khách hàng Maisoné"
                    )
                    }
                                </span>

                            </div>

                            <div
                                class="customer-review-stars"
                                aria-label="${Number(
                        review.rating
                    )
                    } trên 5 sao"
                            >
                                ${"★".repeat(
                        Number(
                            review.rating
                        )
                    )
                    }${"☆".repeat(
                        5 -
                        Number(
                            review.rating
                        )
                    )
                    }
                            </div>

                            <p>
                                ${escapeReviewText(
                        review.text
                    )
                    }
                            </p>

                        </div>

                    </article>
                `
            )
            .join("");
}


function escapeReviewText(value) {

    return String(value).replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]
    );
}


reviewForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const form =
            new FormData(reviewForm);

        const review = {

            name:
                JSON.parse(
                    localStorage.getItem(
                        "currentAccount"
                    ) || "null"
                )?.name ||
                "Khách hàng Maisoné",

            rating:
                Number(
                    form.get("rating")
                ),

            text:
                String(
                    form.get("text")
                ).trim(),

            date:
                new Date()
                    .toLocaleDateString(
                        "vi-VN"
                    )
        };

        if (!review.text) {
            return;
        }

        try {

            const savedReviews =
                JSON.parse(
                    localStorage.getItem(
                        savedReviewKey
                    ) || "[]"
                );

            savedReviews.unshift(
                review
            );

            localStorage.setItem(
                savedReviewKey,
                JSON.stringify(
                    savedReviews
                )
            );

        } catch (error) {

            toast(
                "Không thể lưu đánh giá. Hãy kiểm tra dung lượng lưu trữ của trình duyệt."
            );

            return;
        }

        reviewForm.reset();

        renderReviews();

        toast(
            "Cảm ơn bạn đã gửi đánh giá."
        );
    }
);


renderReviews();


document
    .querySelectorAll("#cartNumber")
    .forEach(
        element =>
            element.textContent =
            cartCount()
    );