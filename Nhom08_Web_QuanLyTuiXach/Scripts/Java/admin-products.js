const productForm = document.getElementById("productForm");
const productModal = document.getElementById("productModal");
const productRows = document.getElementById("adminRows");
const productImageSelect = productForm.elements.image;


// ===============================
// HIỂN THỊ DANH SÁCH ẢNH SẢN PHẨM
// ===============================
function renderProductImageOptions() {

    const selectedImage =
        productImageSelect.value;


    productImageSelect.replaceChildren(
        new Option(
            "Chọn ảnh trong thư mục Images",
            "",
            true,
            !selectedImage
        )
    );


    localProductImages.forEach(image => {

        if (duplicateCatalogImages.has(image)) {
            return;
        }


        const matchingNames =
            products
                .filter(
                    product =>
                        product.image === image ||
                        product.colorVariants?.some(
                            variant =>
                                variant.image === image
                        )
                )
                .map(
                    product =>
                        product.name
                );


        const label =
            [
                ...new Set(matchingNames)
            ].join(" / ") ||
            "Ảnh sản phẩm";


        productImageSelect.add(
            new Option(
                `${label} · ${image
                    .split("/")
                    .pop()}`,
                image,
                false,
                image === selectedImage
            )
        );

    });
}


// ===============================
// ESCAPE TEXT
// ===============================
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


// ===============================
// HIỂN THỊ DANH SÁCH SẢN PHẨM
// ===============================
function renderAdminProducts() {

    productRows.innerHTML =
        products
            .map(
                product => `

                    <tr>

                        <td>
                            MS-${String(
                    product.id
                ).padStart(3, "0")}
                        </td>

                        <td>
                            ${escapeProductText(
                    product.name
                )}
                        </td>

                        <td>
                            ${escapeProductText(
                    product.category
                )}
                        </td>

                        <td>
                            ${Number(
                    product.price
                ).toLocaleString(
                    "vi-VN"
                )}đ
                        </td>

                        <td>
                            Màu sắc
                        </td>

                        <td>
                            ${18 +
                    Number(product.id) * 4}
                        </td>

                        <td>

                            <button
                                class="ui-btn admin-edit-product"
                                type="button"
                                data-product-id="${escapeProductText(
                        product.id
                    )}"
                            >
                                SỬA
                            </button>

                        </td>

                    </tr>

                `
            )
            .join("");
}


// ===============================
// MỞ FORM THÊM / SỬA SẢN PHẨM
// ===============================
function openProductForm(product = null) {

    renderProductImageOptions();

    productForm.reset();


    productForm.elements.productId.value =
        product?.id ?? "";


    productForm.elements.name.value =
        product?.name ?? "";


    productForm.elements.category.value =
        product?.category ?? "Shoulder";


    productForm.elements.price.value =
        product?.price ?? "";


    productForm.elements.oldPrice.value =
        product?.oldPrice ?? "";


    productForm.elements.label.value =
        product?.label ?? "";


    productForm.elements.image.value =
        product?.image ??
        defaultProductImages[1];


    productForm.elements.image.dispatchEvent(
        new Event(
            "change",
            {
                bubbles: true
            }
        )
    );


    productForm.elements.description.value =
        product?.description ?? "";


    productForm
        .querySelectorAll(
            'input[name="collections"]'
        )
        .forEach(input => {

            input.checked =
                product?.collections?.includes(
                    input.value
                ) ?? false;

        });


    document.getElementById(
        "productFormTitle"
    ).textContent =
        product
            ? "Chỉnh sửa sản phẩm"
            : "Thêm sản phẩm";


    productModal.hidden = false;


    productForm.elements.name.focus();
}


// ===============================
// ĐÓNG FORM
// ===============================
function closeProductForm() {

    productModal.hidden = true;
}


// ===============================
// NÚT THÊM SẢN PHẨM
// ===============================
document
    .getElementById(
        "addProductButton"
    )
    .addEventListener(
        "click",
        () => openProductForm()
    );


// ===============================
// NÚT SỬA SẢN PHẨM
// ===============================
productRows.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-product-id]"
            );


        if (!button) {
            return;
        }


        const product =
            products.find(
                item =>
                    String(item.id) ===
                    button.dataset.productId
            );


        if (product) {
            openProductForm(product);
        }

    }
);


// ===============================
// ĐÓNG MODAL
// ===============================
productModal.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "[data-close-product-modal]"
            )
        ) {

            closeProductForm();

        }

    }
);


// ===============================
// NHẤN ESC ĐỂ ĐÓNG
// ===============================
document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !productModal.hidden
        ) {

            closeProductForm();

        }

    }
);


// ===============================
// LƯU SẢN PHẨM
// ===============================
productForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const formData =
            new FormData(productForm);


        const existingId =
            formData.get("productId");


        const price =
            Number(
                formData.get("price")
            );


        const oldPrice =
            Number(
                formData.get("oldPrice")
            ) || 0;


        const image =
            String(
                formData.get("image") || ""
            ).trim();


        // -------------------------------
        // KIỂM TRA GIÁ
        // -------------------------------
        if (
            !Number.isFinite(price) ||
            price < 0 ||
            (oldPrice && oldPrice < price)
        ) {

            toast(
                "Vui lòng kiểm tra giá bán và giá gốc."
            );

            return;
        }


        // -------------------------------
        // KIỂM TRA ẢNH
        // -------------------------------
        if (
            !localProductImages.includes(image)
        ) {

            toast(
                "Vui lòng chọn ảnh có sẵn trong thư mục Images."
            );

            return;
        }


        // -------------------------------
        // KIỂM TRA ẢNH BỊ TRÙNG
        // -------------------------------
        const imageOwner =
            products.find(
                product =>
                    String(product.id) !==
                    String(
                        existingId || ""
                    ) &&
                    (
                        product.image === image ||
                        product.colorVariants?.some(
                            variant =>
                                variant.image ===
                                image
                        )
                    )
            );


        if (imageOwner) {

            toast(
                `Ảnh này đã được dùng cho sản phẩm “${imageOwner.name}”. Chọn ảnh khác để tránh trùng mẫu.`
            );

            return;
        }


        // -------------------------------
        // TẠO DỮ LIỆU SẢN PHẨM
        // -------------------------------
        const productData = {

            name:
                String(
                    formData.get("name")
                ).trim(),

            category:
                String(
                    formData.get("category")
                ),

            price,

            oldPrice,

            label:
                String(
                    formData.get("label") || ""
                ).trim(),

            collections:
                formData.getAll(
                    "collections"
                ),

            description:
                String(
                    formData.get(
                        "description"
                    ) || ""
                ).trim()

        };


        productData.image = image;


        // ===============================
        // TRƯỜNG HỢP CHỈNH SỬA
        // ===============================
        if (existingId) {

            const index =
                products.findIndex(
                    product =>
                        String(
                            product.id
                        ) ===
                        String(
                            existingId
                        )
                );


            if (index === -1) {

                toast(
                    "Không tìm thấy sản phẩm cần chỉnh sửa."
                );

                return;
            }


            if (
                products[index].image !==
                image
            ) {

                productData.colorVariants = [

                    {
                        color: "Màu duy nhất",
                        image
                    }

                ];


                productData.details = [];


                productData.story = "";


                productData.storyTitle = "";

            }


            products[index] = {

                ...products[index],

                ...productData

            };

        }


        // ===============================
        // TRƯỜNG HỢP THÊM MỚI
        // ===============================
        else {

            const nextId =
                products.reduce(
                    (
                        maximum,
                        product
                    ) =>
                        Math.max(
                            maximum,
                            Number(
                                product.id
                            ) || 0
                        ),
                    0
                ) + 1;


            products.push({

                id: nextId,

                image,

                ...productData

            });

        }


        // ===============================
        // LƯU LOCAL STORAGE
        // ===============================
        try {

            localStorage.setItem(
                "maisoneProducts",
                JSON.stringify(
                    products
                )
            );

        }
        catch (error) {

            toast(
                "Không thể lưu sản phẩm. Vui lòng kiểm tra dung lượng trình duyệt."
            );

            return;
        }


        // ===============================
        // CẬP NHẬT GIAO DIỆN
        // ===============================
        renderAdminProducts();


        closeProductForm();


        toast(
            existingId
                ? "Đã cập nhật sản phẩm."
                : "Đã thêm sản phẩm."
        );

    }
);


// ===============================
// HIỂN THỊ BAN ĐẦU
// ===============================
renderAdminProducts();