const supportStorageKey = "maisoneSupportMessages";

const adminSupportMessages =
    document.getElementById("adminSupportMessages");

const adminSupportForm =
    document.getElementById("adminSupportForm");

const adminSupportStatus =
    document.getElementById("adminSupportStatus");


function readSupportMessages() {

    try {

        const messages =
            JSON.parse(
                localStorage.getItem(
                    supportStorageKey
                ) || "[]"
            );

        return Array.isArray(messages)
            ? messages
            : [];

    } catch (error) {

        console.error(
            "Không đọc được tin nhắn hỗ trợ.",
            error
        );

        toast(
            "Không đọc được dữ liệu hỗ trợ."
        );

        return [];
    }
}


function renderAdminSupport() {

    if (!adminSupportMessages) return;


    const messages =
        readSupportMessages();


    adminSupportMessages.replaceChildren();


    if (!messages.length) {

        const empty =
            document.createElement("p");

        empty.className =
            "support-welcome";

        empty.textContent =
            "Chưa có tin nhắn mới. Khi khách gửi câu hỏi từ trang hỗ trợ, nội dung sẽ hiển thị ở đây.";

        adminSupportMessages.append(
            empty
        );


        if (adminSupportForm) {

            const button =
                adminSupportForm.querySelector(
                    "button"
                );

            if (button) {
                button.disabled = true;
            }
        }


        if (adminSupportStatus) {

            adminSupportStatus.textContent =
                "Hãy mở trang hỗ trợ ở tab khác để gửi tin nhắn demo.";

        }

        return;
    }


    messages.forEach(message => {

        const bubble =
            document.createElement(
                "article"
            );

        bubble.className =
            `support-message ${message.role}`;


        const sender =
            document.createElement(
                "strong"
            );

        sender.textContent =
            message.role === "staff"
                ? "Nhân viên Maisoné"
                : "Khách hàng";


        const text =
            document.createElement(
                "p"
            );

        text.textContent =
            message.text;


        const time =
            document.createElement(
                "small"
            );

        time.textContent =
            new Date(
                message.sentAt
            ).toLocaleString(
                "vi-VN"
            );


        bubble.append(
            sender,
            text,
            time
        );


        adminSupportMessages.append(
            bubble
        );

    });


    adminSupportMessages.scrollTop =
        adminSupportMessages.scrollHeight;


    if (adminSupportForm) {

        const button =
            adminSupportForm.querySelector(
                "button"
            );

        if (button) {
            button.disabled = false;
        }
    }


    if (adminSupportStatus) {

        const customerMessages =
            messages.filter(
                message =>
                    message.role ===
                    "customer"
            ).length;


        const staffMessages =
            messages.filter(
                message =>
                    message.role ===
                    "staff"
            ).length;


        adminSupportStatus.textContent =
            `${customerMessages} tin nhắn từ khách · ${staffMessages} phản hồi từ nhân viên.`;

    }
}


if (adminSupportForm) {

    adminSupportForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const input =
                document.getElementById(
                    "adminSupportInput"
                );


            if (!input) return;


            const text =
                input.value.trim();


            if (!text) return;


            const messages =
                readSupportMessages();


            if (
                !messages.some(
                    message =>
                        message.role ===
                        "customer"
                )
            ) {

                toast(
                    "Chưa có tin nhắn khách hàng để phản hồi."
                );

                return;
            }


            messages.push({

                role:
                    "staff",

                text:
                    text,

                sentAt:
                    new Date().toISOString()

            });


            try {

                localStorage.setItem(
                    supportStorageKey,
                    JSON.stringify(
                        messages
                    )
                );

            } catch (error) {

                console.error(
                    "Không thể lưu phản hồi hỗ trợ.",
                    error
                );

                toast(
                    "Không thể lưu phản hồi trên trình duyệt."
                );

                return;
            }


            input.value = "";


            renderAdminSupport();


            toast(
                "Đã gửi phản hồi demo."
            );

        }
    );

}


window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            supportStorageKey
        ) {

            renderAdminSupport();

        }

    }
);


renderAdminSupport();