const voucherSettingsKey = "maisoneVoucherSettings";
const voucherForm = document.getElementById("voucherForm");


function escapeVoucherAdmin(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,

        char => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"

        })[char]
    );
}


function persistVoucherSettings(
    vouchers = maisoneVouchers,
    enabled = maisoneVoucherFeatureEnabled
) {

    try {

        localStorage.setItem(
            voucherSettingsKey,
            JSON.stringify({
                enabled,
                vouchers
            })
        );

    } catch (error) {

        console.error(
            "Không thể lưu cấu hình voucher.",
            error
        );

        toast(
            "Không thể lưu voucher trên trình duyệt."
        );

        return false;
    }


    maisoneVouchers = vouchers;

    maisoneVoucherFeatureEnabled = enabled;

    return true;
}


function formatVoucherType(voucher) {

    return voucher.category === "shipping"
        ? "Vận chuyển"
        : "Sản phẩm";
}


function renderVouchers() {

    document.getElementById(
        "voucherFeatureToggle"
    ).checked =
        maisoneVoucherFeatureEnabled;


    document.getElementById(
        "voucherEmpty"
    ).hidden =
        maisoneVouchers.length > 0;


    document.getElementById(
        "voucherRows"
    ).innerHTML =

        maisoneVouchers
            .map(
                voucher => {

                    const type =
                        formatVoucherType(
                            voucher
                        );


                    const condition =
                        voucher.type === "percent"

                            ? `${Number(
                                voucher.value
                            ) * 100}% · tối đa ${Number(
                                voucher.cap || 0
                            ).toLocaleString(
                                "vi-VN"
                            )}đ · đơn từ ${Number(
                                voucher.min
                            ).toLocaleString(
                                "vi-VN"
                            )}đ`

                            : `${voucher.label}${Number(voucher.min)
                                ? ` · đơn từ ${Number(
                                    voucher.min
                                ).toLocaleString(
                                    "vi-VN"
                                )}đ`
                                : ""
                            }`;


                    return `
                        <tr>

                            <td>

                                <strong>
                                    ${escapeVoucherAdmin(
                        voucher.code
                    )}
                                </strong>

                                <br>

                                ${escapeVoucherAdmin(
                        voucher.label
                    )}

                            </td>


                            <td>

                                <span
                                    class="voucher-admin-badge ${type === "Vận chuyển"
                            ? "shipping"
                            : ""
                        }">

                                    ${type}

                                </span>

                            </td>


                            <td>
                                ${escapeVoucherAdmin(
                            condition
                        )}
                            </td>


                            <td>

                                ${escapeVoucherAdmin(
                            voucher.validFrom
                        )}

                                –

                                ${escapeVoucherAdmin(
                            voucher.validUntil
                        )}

                            </td>


                            <td>

                                ${voucher.active === false
                            ? "Đã tắt"
                            : "Đang bật"
                        }

                            </td>


                            <td>

                                <div
                                    class="admin-row-actions">

                                    <button
                                        class="ui-btn"
                                        type="button"
                                        data-voucher-action="edit"
                                        data-code="${escapeVoucherAdmin(
                            voucher.code
                        )}">

                                        SỬA

                                    </button>


                                    <button
                                        class="ui-btn"
                                        type="button"
                                        data-voucher-action="toggle"
                                        data-code="${escapeVoucherAdmin(
                            voucher.code
                        )}">

                                        ${voucher.active === false
                            ? "BẬT"
                            : "TẮT"
                        }

                                    </button>


                                    <button
                                        class="ui-btn danger"
                                        type="button"
                                        data-voucher-action="delete"
                                        data-code="${escapeVoucherAdmin(
                            voucher.code
                        )}">

                                        XÓA

                                    </button>

                                </div>

                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


function resetVoucherForm() {

    voucherForm.reset();


    voucherForm.elements.originalCode.value =
        "";


    voucherForm.elements.type.value =
        "fixed";


    voucherForm.elements.min.value =
        "0";


    document.getElementById(
        "voucherFormTitle"
    ).textContent =
        "Tạo voucher mới";


    document.getElementById(
        "cancelVoucherEdit"
    ).hidden =
        true;
}


document.getElementById(
    "voucherFeatureToggle"
).addEventListener(
    "change",
    event => {

        if (
            persistVoucherSettings(
                maisoneVouchers,
                event.target.checked
            )
        ) {

            toast(
                event.target.checked
                    ? "Đã bật voucher trên toàn website."
                    : "Đã tắt voucher trên toàn website."
            );

        } else {

            event.target.checked =
                maisoneVoucherFeatureEnabled;
        }
    }
);


voucherForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const form =
            new FormData(
                voucherForm
            );


        const originalCode =
            String(
                form.get(
                    "originalCode"
                ) || ""
            );


        const code =
            String(
                form.get(
                    "code"
                )
            )
                .trim()
                .toUpperCase();


        const type =
            String(
                form.get(
                    "type"
                )
            );


        const value =
            Number(
                form.get(
                    "value"
                )
            );


        const min =
            Number(
                form.get(
                    "min"
                )
            );


        const cap =
            Number(
                form.get(
                    "cap"
                )
            ) || 0;


        const validFrom =
            String(
                form.get(
                    "validFrom"
                )
            );


        const validUntil =
            String(
                form.get(
                    "validUntil"
                )
            );


        if (
            !/^[A-Z0-9_]+$/.test(
                code
            )
        ) {

            toast(
                "Mã voucher chỉ gồm chữ, số và dấu gạch dưới."
            );

            return;
        }


        if (
            !validFrom ||
            !validUntil ||
            validFrom > validUntil ||
            !Number.isFinite(value) ||
            value < 0 ||
            !Number.isFinite(min) ||
            min < 0
        ) {

            toast(
                "Vui lòng kiểm tra giá trị và thời hạn voucher."
            );

            return;
        }


        if (
            type === "percent" &&
            (
                value > 100 ||
                cap <= 0
            )
        ) {

            toast(
                "Voucher giảm phần trăm cần giá trị tối đa 100% và có mức giảm tối đa."
            );

            return;
        }


        if (
            maisoneVouchers.some(
                voucher =>
                    voucher.code === code &&
                    voucher.code !== originalCode
            )
        ) {

            toast(
                "Mã voucher này đã tồn tại."
            );

            return;
        }


        const category =
            type === "shipping-discount" ||
                type === "ship"

                ? "shipping"

                : "product";


        const previousVoucher =
            maisoneVouchers.find(
                voucher =>
                    voucher.code === originalCode
            );


        const updatedVoucher = {

            ...(previousVoucher || {}),

            code,

            label:
                String(
                    form.get(
                        "label"
                    )
                ).trim(),

            condition:
                `Đơn từ ${min.toLocaleString(
                    "vi-VN"
                )}đ`,

            type,

            value:
                type === "ship"
                    ? 0
                    : type === "percent"
                        ? value / 100
                        : value,

            min,

            category,

            validFrom,

            validUntil,

            active:
                previousVoucher?.active !== false
        };


        if (
            type === "percent"
        ) {

            updatedVoucher.cap =
                cap;

        } else {

            delete updatedVoucher.cap;
        }


        if (
            type === "fixed" ||
            type === "percent"
        ) {

            delete updatedVoucher.birthdayOnly;

            delete updatedVoucher.weekendOnly;

            delete updatedVoucher.membershipTier;
        }


        const nextVouchers =
            originalCode

                ? maisoneVouchers.map(
                    voucher =>
                        voucher.code ===
                            originalCode

                            ? updatedVoucher

                            : voucher
                )

                : [
                    ...maisoneVouchers,
                    updatedVoucher
                ];


        if (
            !persistVoucherSettings(
                nextVouchers
            )
        ) {

            return;
        }


        resetVoucherForm();


        renderVouchers();


        toast(
            originalCode
                ? "Đã cập nhật voucher."
                : "Đã tạo voucher và đồng bộ cho cửa hàng."
        );
    }
);


document.getElementById(
    "cancelVoucherEdit"
).addEventListener(
    "click",
    resetVoucherForm
);


document.getElementById(
    "voucherRows"
).addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-voucher-action]"
            );


        if (!button) {
            return;
        }


        const voucher =
            maisoneVouchers.find(
                item =>
                    item.code ===
                    button.dataset.code
            );


        if (!voucher) {
            return;
        }


        let nextVouchers =
            maisoneVouchers;


        if (
            button.dataset.voucherAction ===
            "edit"
        ) {

            voucherForm.elements.originalCode.value =
                voucher.code;


            voucherForm.elements.code.value =
                voucher.code;


            voucherForm.elements.label.value =
                voucher.label;


            voucherForm.elements.type.value =
                voucher.type;


            voucherForm.elements.value.value =
                voucher.type === "percent"

                    ? Number(
                        voucher.value
                    ) * 100

                    : voucher.value;


            voucherForm.elements.min.value =
                voucher.min || 0;


            voucherForm.elements.cap.value =
                voucher.cap || "";


            voucherForm.elements.validFrom.value =
                voucher.validFrom;


            voucherForm.elements.validUntil.value =
                voucher.validUntil;


            window.MaisoneDatePicker.refresh(
                voucherForm.elements.validFrom
            );


            window.MaisoneDatePicker.refresh(
                voucherForm.elements.validUntil
            );


            document.getElementById(
                "voucherFormTitle"
            ).textContent =
                `Sửa voucher ${voucher.code}`;


            document.getElementById(
                "cancelVoucherEdit"
            ).hidden =
                false;


            voucherForm.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            return;
        }


        if (
            button.dataset.voucherAction ===
            "toggle"
        ) {

            nextVouchers =
                maisoneVouchers.map(
                    item =>
                        item.code ===
                            voucher.code

                            ? {
                                ...item,
                                active:
                                    item.active === false
                            }

                            : item
                );

        } else if (
            button.dataset.voucherAction ===
            "delete"
        ) {

            if (
                !confirm(
                    `Xóa voucher ${voucher.code}?`
                )
            ) {

                return;
            }


            nextVouchers =
                maisoneVouchers.filter(
                    item =>
                        item.code !==
                        voucher.code
                );
        }


        if (
            persistVoucherSettings(
                nextVouchers
            )
        ) {

            renderVouchers();


            toast(
                button.dataset.voucherAction ===
                    "delete"

                    ? "Đã xóa voucher."

                    : "Đã cập nhật trạng thái voucher."
            );
        }
    }
);


renderVouchers();