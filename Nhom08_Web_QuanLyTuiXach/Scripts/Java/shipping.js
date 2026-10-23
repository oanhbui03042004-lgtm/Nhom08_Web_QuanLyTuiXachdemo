const shippingVouchers = maisoneVouchers.filter(
    voucher => voucher.category === "shipping"
);

const shippingVoucherGrid =
    document.getElementById("shippingVouchers");


function readSavedShippingVouchers() {

    try {

        return JSON.parse(
            localStorage.getItem("savedVouchers") || "[]"
        );

    } catch (error) {

        toast(
            "Không đọc được voucher đã lưu. Hãy thử xóa dữ liệu demo lỗi trong trình duyệt."
        );

        return [];
    }
}


function renderShippingVouchers() {

    const saved =
        readSavedShippingVouchers();


    if (!maisoneVoucherFeatureEnabled) {

        shippingVoucherGrid.innerHTML =
            '<p class="admin-empty-state">Voucher đang tạm ngưng trên toàn hệ thống.</p>';

        return;
    }


    shippingVoucherGrid.innerHTML =
        shippingVouchers
            .filter(
                voucher =>
                    voucher.active !== false
            )
            .map(voucher => {

                const isSaved =
                    saved.some(
                        item =>
                            item.code === voucher.code
                    );


                return `
                    <article class="shipping-voucher-card ${isSaved ? "is-saved" : ""}">

                        <div class="shipping-voucher-icon">
                            <i class="fa-solid fa-truck-fast"></i>
                        </div>

                        <div class="shipping-voucher-copy">

                            <span>
                                ƯU ĐÃI VẬN CHUYỂN · ${voucher.code}
                            </span>

                            <strong>
                                ${voucher.label}
                            </strong>

                            <small>
                                ${voucher.condition}
                            </small>

                            <small class="voucher-validity">
                                ${formatVoucherValidity(voucher)}
                            </small>

                        </div>

                        <div class="shipping-voucher-actions">

                            <button
                                class="ui-btn light shipping-save-button"
                                type="button"
                                data-save-code="${voucher.code}"
                                ${isSaved ? "disabled" : ""}
                            >
                                ${isSaved
                        ? '<i class="fa-solid fa-check"></i> ĐÃ LƯU'
                        : "LƯU VOUCHER"
                    }
                            </button>

                            <a
                                class="text-link"
                                href="${cartUrl}?coupon=${voucher.code}"
                            >
                                DÙNG Ở GIỎ HÀNG
                                <i class="fa-solid fa-arrow-right"></i>
                            </a>

                        </div>

                    </article>
                `;

            })
            .join("");
}


if (shippingVoucherGrid) {

    shippingVoucherGrid.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-save-code]"
                );


            if (!button) return;


            const voucher =
                shippingVouchers.find(
                    item =>
                        item.code ===
                        button.dataset.saveCode
                );


            if (!voucher) {

                toast(
                    "Không tìm thấy voucher vận chuyển."
                );

                return;
            }


            const saved =
                readSavedShippingVouchers();


            if (
                !saved.some(
                    item =>
                        item.code ===
                        voucher.code
                )
            ) {

                saved.push(voucher);

            }


            try {

                localStorage.setItem(
                    "savedVouchers",
                    JSON.stringify(saved)
                );

            } catch (error) {

                toast(
                    "Không lưu được voucher vào trình duyệt."
                );

                return;
            }


            renderShippingVouchers();


            toast(
                `Đã lưu mã ${voucher.code}.`
            );

        }
    );


    renderShippingVouchers();

}