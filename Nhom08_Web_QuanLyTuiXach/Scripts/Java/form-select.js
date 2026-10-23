(() => {
    let openPicker = null;


    function closePicker() {

        if (!openPicker) return;

        openPicker.classList.remove(
            "is-open"
        );

        openPicker
            .querySelector(
                ".app-select-trigger"
            )
            .setAttribute(
                "aria-expanded",
                "false"
            );

        openPicker
            .querySelector(
                ".app-select-menu"
            )
            .hidden = true;

        openPicker = null;
    }


    function syncSelect(select) {

        const picker =
            select.closest(".app-select");

        if (!picker) return;

        const trigger =
            picker.querySelector(
                ".app-select-trigger"
            );

        const menu =
            picker.querySelector(
                ".app-select-menu"
            );

        const selected =
            select.selectedOptions[0];


        trigger
            .querySelector(
                ".app-select-value"
            )
            .textContent =
            selected?.textContent.trim() ||
            "Chọn mục";


        trigger.disabled =
            select.disabled;


        trigger.setAttribute(
            "aria-invalid",
            select.getAttribute(
                "aria-invalid"
            ) || "false"
        );


        menu.innerHTML =
            Array.from(
                select.options,
                (option, index) => {

                    const isSelected =
                        option === selected;

                    return `
                        <button
                            type="button"
                            role="option"
                            data-option-index="${index}"
                            aria-selected="${isSelected}"
                            ${option.disabled ? "disabled" : ""}
                        >
                            <span>
                                ${escapeText(
                        option.textContent.trim()
                    )}
                            </span>

                            <i
                                class="${isSelected
                            ? "fa-solid fa-check"
                            : ""
                        }"
                                aria-hidden="true"
                            ></i>
                        </button>
                    `;
                }
            ).join("");


        if (
            openPicker === picker &&
            menu.hidden
        ) {
            closePicker();
        }
    }


    function escapeText(value) {

        return String(value).replace(
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


    function fieldLabel(select) {

        const label =
            select.labels?.[0];

        if (!label) {

            return (
                select.getAttribute(
                    "aria-label"
                ) ||
                "Chọn mục"
            );
        }


        const copy =
            label.cloneNode(true);


        copy
            .querySelectorAll(
                "select, .app-select"
            )
            .forEach(
                node => node.remove()
            );


        return (
            copy.textContent.trim() ||
            "Chọn mục"
        );
    }


    function selectOption(
        select,
        index
    ) {

        const option =
            select.options[index];


        if (
            !option ||
            option.disabled ||
            select.disabled
        ) {
            return;
        }


        select.selectedIndex =
            index;


        select.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );


        select.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );


        syncSelect(select);

        closePicker();


        select
            .closest(".app-select")
            ?.querySelector(
                ".app-select-trigger"
            )
            .focus();
    }


    function addSelect(select) {

        const wrapper =
            document.createElement("span");

        wrapper.className =
            "app-select";


        select.classList.add(
            "app-select-source"
        );


        select.setAttribute(
            "aria-hidden",
            "true"
        );


        select.tabIndex = -1;


        select.parentElement.insertBefore(
            wrapper,
            select
        );


        wrapper.append(select);


        const trigger =
            document.createElement("button");


        trigger.type = "button";


        trigger.className =
            "app-select-trigger";


        trigger.setAttribute(
            "aria-haspopup",
            "listbox"
        );


        trigger.setAttribute(
            "aria-expanded",
            "false"
        );


        trigger.setAttribute(
            "aria-label",
            fieldLabel(select)
        );


        trigger.innerHTML = `
            <span class="app-select-value"></span>

            <i
                class="fa-solid fa-chevron-down app-select-chevron"
                aria-hidden="true"
            ></i>
        `;


        wrapper.append(trigger);


        const menu =
            document.createElement("div");


        menu.className =
            "app-select-menu";


        menu.setAttribute(
            "role",
            "listbox"
        );


        menu.hidden = true;


        wrapper.append(menu);


        // Mở / đóng dropdown
        trigger.addEventListener(
            "click",
            () => {

                if (
                    openPicker === wrapper
                ) {
                    closePicker();
                    return;
                }


                closePicker();

                syncSelect(select);


                openPicker =
                    wrapper;


                wrapper.classList.add(
                    "is-open"
                );


                trigger.setAttribute(
                    "aria-expanded",
                    "true"
                );


                menu.hidden = false;


                const bounds =
                    wrapper.getBoundingClientRect();


                const width =
                    Math.min(
                        Math.max(
                            bounds.width,
                            236
                        ),
                        window.innerWidth - 24
                    );


                menu.style.width =
                    `${width}px`;


                menu.style.left =
                    `${Math.min(
                        Math.max(
                            12,
                            bounds.left
                        ),
                        window.innerWidth -
                        width -
                        12
                    )}px`;


                menu.style.right =
                    "auto";


                menu.style.bottom =
                    "auto";


                menu.style.top =
                    "12px";


                const roomBelow =
                    window.innerHeight -
                    bounds.bottom -
                    8;


                const roomAbove =
                    bounds.top -
                    8;


                const placement =
                    roomBelow <
                        Math.min(
                            180,
                            menu.offsetHeight
                        ) &&
                        roomAbove > roomBelow
                        ? "top"
                        : "bottom";


                const top =
                    placement === "top"
                        ? Math.max(
                            12,
                            bounds.top -
                            menu.offsetHeight -
                            8
                        )
                        : Math.min(
                            bounds.bottom +
                            8,
                            window.innerHeight -
                            menu.offsetHeight -
                            12
                        );


                menu.dataset.placement =
                    placement;


                menu.style.top =
                    `${top}px`;


                const active =
                    menu.querySelector(
                        '[aria-selected="true"]:not(:disabled)'
                    ) ||
                    menu.querySelector(
                        "button:not(:disabled)"
                    );


                active?.focus();
            }
        );


        // Điều khiển bằng bàn phím ở nút dropdown
        trigger.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "ArrowDown" ||
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    trigger.click();
                }
            }
        );


        // Chọn option bằng click
        menu.addEventListener(
            "click",
            event => {

                const item =
                    event.target.closest(
                        "[data-option-index]"
                    );


                if (item) {

                    selectOption(
                        select,
                        Number(
                            item.dataset
                                .optionIndex
                        )
                    );
                }
            }
        );


        // Điều khiển option bằng bàn phím
        menu.addEventListener(
            "keydown",
            event => {

                const items = [
                    ...menu.querySelectorAll(
                        "button:not(:disabled)"
                    )
                ];


                const current =
                    items.indexOf(
                        document.activeElement
                    );


                let next = null;


                if (
                    event.key ===
                    "ArrowDown"
                ) {

                    next =
                        items[
                        Math.min(
                            current + 1,
                            items.length - 1
                        )
                        ];

                } else if (
                    event.key ===
                    "ArrowUp"
                ) {

                    next =
                        items[
                        Math.max(
                            current - 1,
                            0
                        )
                        ];

                } else if (
                    event.key === "Home"
                ) {

                    next =
                        items[0];

                } else if (
                    event.key === "End"
                ) {

                    next =
                        items[
                        items.length - 1
                        ];

                } else if (
                    event.key === "Escape"
                ) {

                    closePicker();

                    trigger.focus();

                } else if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();


                    if (
                        document
                            .activeElement
                            ?.dataset
                            .optionIndex !==
                        undefined
                    ) {

                        selectOption(
                            select,
                            Number(
                                document
                                    .activeElement
                                    .dataset
                                    .optionIndex
                            )
                        );
                    }
                }


                if (next) {

                    event.preventDefault();

                    next.focus();
                }
            }
        );


        // Khi select thay đổi
        select.addEventListener(
            "change",
            () => syncSelect(select)
        );


        select.addEventListener(
            "input",
            () => syncSelect(select)
        );


        // Validation
        select.addEventListener(
            "invalid",
            event => {

                event.preventDefault();


                wrapper.classList.add(
                    "is-invalid"
                );


                trigger.focus();


                if (
                    typeof window.toast ===
                    "function"
                ) {

                    window.toast(
                        `Vui lòng chọn: ${trigger
                            .getAttribute(
                                "aria-label"
                            )
                            .toLowerCase()}.`
                    );
                }
            }
        );


        // Reset form
        select.form?.addEventListener(
            "reset",
            () =>
                window.setTimeout(
                    () => {

                        wrapper.classList.remove(
                            "is-invalid"
                        );

                        syncSelect(select);

                    },
                    0
                )
        );


        // Theo dõi thay đổi option bằng JS
        new MutationObserver(
            () => syncSelect(select)
        ).observe(
            select,
            {
                childList: true,
                subtree: true,
                attributes: true
            }
        );


        syncSelect(select);
    }


    function init(root = document) {

        root
            .querySelectorAll?.(
                "select:not(.app-select-source):not(.dashboard-period-native)"
            )
            .forEach(addSelect);


        if (
            root.matches?.(
                "select:not(.app-select-source):not(.dashboard-period-native)"
            )
        ) {
            addSelect(root);
        }
    }


    // Click ra ngoài thì đóng
    document.addEventListener(
        "click",
        event => {

            if (
                openPicker &&
                !event.target.closest(
                    ".app-select"
                )
            ) {
                closePicker();
            }
        }
    );


    // ESC thì đóng
    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {
                closePicker();
            }
        }
    );


    // Resize thì đóng
    window.addEventListener(
        "resize",
        closePicker
    );


    // Theo dõi element mới được thêm vào DOM
    new MutationObserver(
        records => {

            records.forEach(
                record => {

                    record.addedNodes.forEach(
                        node => {

                            if (
                                node.nodeType ===
                                Node.ELEMENT_NODE
                            ) {
                                init(node);
                            }

                        }
                    );

                }
            );
        }
    ).observe(
        document.documentElement,
        {
            childList: true,
            subtree: true
        }
    );


    // Public API
    window.MaisoneFormSelect = {
        init
    };


    // Khởi tạo
    init();

})();