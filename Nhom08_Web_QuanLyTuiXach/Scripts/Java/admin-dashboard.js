const dashboardPeriod = document.getElementById("dashboardPeriod");
const dashboardDay = document.getElementById("dashboardDay");
const dashboardMonth = document.getElementById("dashboardMonth");
const dashboardYear = document.getElementById("dashboardYear");
const dashboardDayTrigger = document.getElementById("dashboardDayTrigger");
const dashboardMonthTrigger = document.getElementById("dashboardMonthTrigger");
const dashboardPeriodTrigger = document.getElementById("dashboardPeriodTrigger");
const dashboardPeriodMenu = document.getElementById("dashboardPeriodMenu");

const moneyLabel = value =>
    `${Math.round(value).toLocaleString("vi-VN")}đ`;

const localDateKey = date =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;


function readDashboardOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem("maisoneOrders") || "[]"
        );

        if (!Array.isArray(orders))
            throw new TypeError("Định dạng đơn hàng không hợp lệ");

        return orders;
    } catch (error) {
        console.error("Không thể đọc đơn hàng cho dashboard.", error);

        if (typeof toast === "function") {
            toast("Không đọc được dữ liệu đơn hàng đã lưu.");
        }

        return [];
    }
}


function orderNetRevenue(order) {
    const subtotal = Number(order.subtotal);
    const discount = Number(order.discount || 0);

    return Math.max(
        0,
        (Number.isFinite(subtotal)
            ? subtotal
            : Number(order.total || 0)) - discount
    );
}


function orderDate(order) {
    const date = new Date(order.placedAt);

    return Number.isNaN(date.getTime())
        ? null
        : date;
}


function populateDashboardYears() {
    const currentYear = new Date().getFullYear();
    const previousYear = dashboardYear.value;

    const availableYears = new Set();

    for (
        let year = Math.max(2020, currentYear - 10);
        year <= currentYear + 5;
        year++
    ) {
        availableYears.add(year);
    }

    readDashboardOrders().forEach(order => {
        const date = orderDate(order);

        if (date) {
            availableYears.add(date.getFullYear());
        }
    });

    dashboardYear.innerHTML = [...availableYears]
        .sort((a, b) => b - a)
        .map(year => `<option value="${year}">${year}</option>`)
        .join("");

    dashboardYear.value =
        availableYears.has(Number(previousYear))
            ? previousYear
            : String(currentYear);
}


function buildRevenueBuckets(period, selectedDate) {

    if (period === "day") {

        return Array.from({ length: 8 }, (_, index) => ({
            key: String(index * 3).padStart(2, "0"),

            label:
                `${String(index * 3).padStart(2, "0")}:00`,

            interval:
                `${String(index * 3).padStart(2, "0")}:00–${String(index * 3 + 2).padStart(2, "0")}:59`,

            matches: date =>
                localDateKey(date) === selectedDate &&
                Math.floor(date.getHours() / 3) === index
        }));
    }


    if (period === "month") {

        const [year, month] =
            selectedDate.split("-").map(Number);

        const count =
            new Date(year, month, 0).getDate();

        return Array.from({ length: count }, (_, index) => {

            const day = index + 1;

            const dateKey =
                `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            return {
                key: dateKey,

                label: String(day),

                interval:
                    new Date(year, month - 1, day)
                        .toLocaleDateString("vi-VN"),

                matches: date =>
                    localDateKey(date) === dateKey
            };
        });
    }


    const year = Number(selectedDate);

    return Array.from({ length: 12 }, (_, index) => {

        const month = index + 1;

        return {
            key:
                `${year}-${String(month).padStart(2, "0")}`,

            label:
                new Date(year, index, 1)
                    .toLocaleDateString("vi-VN", {
                        month: "short"
                    }),

            interval:
                new Date(year, index, 1)
                    .toLocaleDateString("vi-VN", {
                        month: "long",
                        year: "numeric"
                    }),

            matches: date =>
                date.getFullYear() === year &&
                date.getMonth() === index
        };
    });
}


function selectedPeriod() {

    if (dashboardPeriod.value === "day") {
        return {
            period: "day",
            key: dashboardDay.value
        };
    }

    if (dashboardPeriod.value === "month") {
        return {
            period: "month",
            key: dashboardMonth.value
        };
    }

    return {
        period: "year",
        key: dashboardYear.value
    };
}


const calendarMonths = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12"
];


const calendarWeekdays = [
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "CN"
];


function parseLocalDate(value) {

    const [year, month, day] =
        value.split("-").map(Number);

    return new Date(year, month - 1, day);
}


function updateCalendarTriggers() {

    dashboardDayTrigger.textContent =
        dashboardDay.value
            ? parseLocalDate(dashboardDay.value)
                .toLocaleDateString("vi-VN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })
            : "Chọn ngày";


    const [year, month] =
        (dashboardMonth.value || "")
            .split("-")
            .map(Number);

    dashboardMonthTrigger.textContent =
        year && month
            ? `${calendarMonths[month - 1]}, ${year}`
            : "Chọn tháng";
}


function renderDayCalendar(displayDate) {

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const firstDayOffset =
        (new Date(year, month, 1).getDay() + 6) % 7;

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    const selected = dashboardDay.value;

    const today = localDateKey(new Date());

    let days = "";


    for (let index = 0; index < 42; index++) {

        const day =
            index - firstDayOffset + 1;

        const inMonth =
            day > 0 && day <= daysInMonth;

        const date =
            new Date(year, month, day);

        const dateKey =
            localDateKey(date);

        const classes = [
            "calendar-day",
            inMonth ? "" : "is-outside",
            dateKey === selected ? "is-selected" : "",
            dateKey === today ? "is-today" : ""
        ]
            .filter(Boolean)
            .join(" ");


        days += `
            <button
                type="button"
                class="${classes}"
                data-calendar-day="${dateKey}"
                aria-pressed="${dateKey === selected}">
                ${date.getDate()}
            </button>
        `;
    }


    return `
        <div class="calendar-popover-head">

            <button
                type="button"
                class="calendar-nav"
                data-calendar-shift="-1"
                aria-label="Tháng trước">

                <i class="fa-solid fa-chevron-left"></i>

            </button>

            <strong>
                ${new Date(year, month, 1)
            .toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric"
            })}
            </strong>

            <button
                type="button"
                class="calendar-nav"
                data-calendar-shift="1"
                aria-label="Tháng sau">

                <i class="fa-solid fa-chevron-right"></i>

            </button>

        </div>

        <div class="calendar-weekdays">

            ${calendarWeekdays
            .map(day => `<span>${day}</span>`)
            .join("")}

        </div>

        <div class="calendar-day-grid">

            ${days}

        </div>

        <div class="calendar-popover-foot">

            <button
                type="button"
                data-calendar-today>
                Hôm nay
            </button>

            <button
                type="button"
                data-calendar-close>
                Đóng
            </button>

        </div>
    `;
}


function renderMonthCalendar(year) {

    const selected = dashboardMonth.value;

    const today =
        localDateKey(new Date()).slice(0, 7);


    const months =
        calendarMonths
            .map((monthName, index) => {

                const monthValue =
                    `${year}-${String(index + 1).padStart(2, "0")}`;

                const classes = [
                    "calendar-month",
                    monthValue === selected
                        ? "is-selected"
                        : "",
                    monthValue === today
                        ? "is-today"
                        : ""
                ]
                    .filter(Boolean)
                    .join(" ");


                return `
                    <button
                        type="button"
                        class="${classes}"
                        data-calendar-month="${monthValue}"
                        aria-pressed="${monthValue === selected}">
                        ${monthName}
                    </button>
                `;
            })
            .join("");


    return `
        <div class="calendar-popover-head">

            <button
                type="button"
                class="calendar-nav"
                data-calendar-shift="-1"
                aria-label="Năm trước">

                <i class="fa-solid fa-chevron-left"></i>

            </button>

            <strong>${year}</strong>

            <button
                type="button"
                class="calendar-nav"
                data-calendar-shift="1"
                aria-label="Năm sau">

                <i class="fa-solid fa-chevron-right"></i>

            </button>

        </div>

        <div class="calendar-month-grid">

            ${months}

        </div>

        <div class="calendar-popover-foot">

            <button
                type="button"
                data-calendar-current-month>
                Tháng này
            </button>

            <button
                type="button"
                data-calendar-close>
                Đóng
            </button>

        </div>
    `;
}


function closeCalendarPickers() {

    document
        .querySelectorAll(".dashboard-calendar-popover")
        .forEach(popover => {

            popover.hidden = true;

        });


    document
        .querySelectorAll(".dashboard-picker-trigger")
        .forEach(trigger => {

            trigger.setAttribute(
                "aria-expanded",
                "false"
            );

        });
}


function openCalendarPicker(type) {

    closeCalendarPickers();


    const popover =
        document.getElementById(
            type === "day"
                ? "dashboardDayPicker"
                : "dashboardMonthPicker"
        );


    const trigger =
        document.getElementById(
            type === "day"
                ? "dashboardDayTrigger"
                : "dashboardMonthTrigger"
        );


    if (type === "day") {

        const date =
            dashboardDay.value
                ? parseLocalDate(dashboardDay.value)
                : new Date();

        popover.innerHTML =
            renderDayCalendar(date);

    } else {

        const [year] =
            (
                dashboardMonth.value ||
                localDateKey(new Date()).slice(0, 7)
            )
                .split("-")
                .map(Number);

        popover.innerHTML =
            renderMonthCalendar(year);
    }


    popover.hidden = false;

    trigger.setAttribute(
        "aria-expanded",
        "true"
    );
}


function commitCalendarValue(input, value) {

    input.value = value;

    updateCalendarTriggers();

    closeCalendarPickers();

    input.dispatchEvent(
        new Event("change", {
            bubbles: true
        })
    );
}


function handleCalendarClick(event, type) {

    const button =
        event.target.closest("button");

    if (!button) return;


    const popover =
        document.getElementById(
            type === "day"
                ? "dashboardDayPicker"
                : "dashboardMonthPicker"
        );


    if (button.hasAttribute("data-calendar-close")) {

        closeCalendarPickers();

        return;
    }


    if (
        type === "day" &&
        button.hasAttribute("data-calendar-today")
    ) {

        commitCalendarValue(
            dashboardDay,
            localDateKey(new Date())
        );

        return;
    }


    if (
        type === "month" &&
        button.hasAttribute("data-calendar-current-month")
    ) {

        commitCalendarValue(
            dashboardMonth,
            localDateKey(new Date()).slice(0, 7)
        );

        return;
    }


    const selectedDay =
        button.dataset.calendarDay;


    if (
        type === "day" &&
        selectedDay
    ) {

        commitCalendarValue(
            dashboardDay,
            selectedDay
        );

        return;
    }


    const selectedMonth =
        button.dataset.calendarMonth;


    if (
        type === "month" &&
        selectedMonth
    ) {

        commitCalendarValue(
            dashboardMonth,
            selectedMonth
        );

        return;
    }


    if (
        !button.hasAttribute(
            "data-calendar-shift"
        )
    ) {
        return;
    }


    const offset =
        Number(
            button.dataset.calendarShift
        );


    if (type === "day") {

        const current =
            dashboardDay.value
                ? parseLocalDate(dashboardDay.value)
                : new Date();

        current.setDate(1);

        current.setMonth(
            current.getMonth() + offset
        );

        popover.innerHTML =
            renderDayCalendar(current);

    } else {

        const [year] =
            (
                popover
                    .querySelector(
                        ".calendar-popover-head strong"
                    )
                    ?.textContent ||
                new Date().getFullYear()
            )
                .split("-")
                .map(Number);

        popover.innerHTML =
            renderMonthCalendar(
                year + offset
            );
    }
}


function renderDashboardChart(buckets) {

    const svg =
        document.getElementById(
            "dashboardChart"
        );


    const availableWidth =
        svg.parentElement.clientWidth || 760;


    const width =
        Math.max(
            680,
            Math.min(
                1120,
                availableWidth - 24
            )
        );


    const height = 360;


    const margin = {
        top: 25,
        right: 24,
        bottom: 56,
        left: 82
    };


    const plotWidth =
        width -
        margin.left -
        margin.right;


    const plotHeight =
        height -
        margin.top -
        margin.bottom;


    const maximum =
        Math.max(
            100000,
            ...buckets.map(
                bucket => bucket.revenue
            )
        );


    const rawStep =
        maximum / 4;


    const stepMagnitude =
        10 **
        Math.floor(
            Math.log10(rawStep)
        );


    const normalizedStep =
        rawStep / stepMagnitude;


    const stepFactor =
        normalizedStep <= 1
            ? 1
            : normalizedStep <= 2
                ? 2
                : normalizedStep <= 2.5
                    ? 2.5
                    : normalizedStep <= 5
                        ? 5
                        : 10;


    const axisStep =
        stepFactor * stepMagnitude;


    const axisMaximum =
        Math.max(
            axisStep * 4,
            (
                Math.ceil(
                    maximum / axisStep
                ) + 1
            ) * axisStep
        );


    const axisUnit = "VNĐ";


    document.getElementById(
        "dashboardAxisLabel"
    ).textContent =
        "Doanh thu (VNĐ)";


    const slot =
        plotWidth / buckets.length;


    const barWidth =
        Math.min(
            34,
            slot * .64
        );


    const svgParts = [

        `<title>
            Doanh thu đã hoàn tất theo thời gian
        </title>`,

        `<desc>
            Trục đứng là doanh thu theo ${axisUnit};
            trục ngang là khoảng thời gian đã chọn.
        </desc>`,

        `<defs>

            <linearGradient
                id="revenueBarGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1">

                <stop
                    offset="0%"
                    stop-color="#a86a6c">
                </stop>

                <stop
                    offset="100%"
                    stop-color="#702d35">
                </stop>

            </linearGradient>

        </defs>`
    ];


    const tickCount =
        Math.round(
            axisMaximum / axisStep
        );


    for (
        let tick = 0;
        tick <= tickCount;
        tick++
    ) {

        const value =
            axisStep * tick;


        const y =
            margin.top +
            plotHeight -
            plotHeight *
            tick /
            tickCount;


        svgParts.push(`
            <line
                x1="${margin.left}"
                y1="${y}"
                x2="${width - margin.right}"
                y2="${y}"
                class="chart-grid-line">
            </line>
        `);


        svgParts.push(`
            <text
                x="${margin.left - 10}"
                y="${y + 4}"
                text-anchor="end"
                class="chart-axis-label">
                ${Math.round(value)
                .toLocaleString("vi-VN")}
            </text>
        `);
    }


    svgParts.push(`
        <line
            x1="${margin.left}"
            y1="${margin.top}"
            x2="${margin.left}"
            y2="${margin.top + plotHeight}"
            class="chart-axis-line">
        </line>
    `);


    svgParts.push(`
        <line
            x1="${margin.left}"
            y1="${margin.top + plotHeight}"
            x2="${width - margin.right}"
            y2="${margin.top + plotHeight}"
            class="chart-axis-line">
        </line>
    `);


    buckets.forEach(
        (bucket, index) => {

            const barHeight =
                bucket.revenue /
                axisMaximum *
                plotHeight;


            const x =
                margin.left +
                index * slot +
                (slot - barWidth) / 2;


            const y =
                margin.top +
                plotHeight -
                barHeight;


            svgParts.push(`
                <rect
                    x="${x}"
                    y="${y}"
                    width="${barWidth}"
                    height="${Math.max(0, barHeight)}"
                    rx="4"
                    class="chart-bar">

                    <title>
                        ${bucket.interval}:
                        ${moneyLabel(bucket.revenue)}
                        ·
                        ${bucket.orderCount}
                        đơn đặt
                    </title>

                </rect>
            `);


            const labelEvery =
                buckets.length > 20
                    ? 4
                    : 1;


            if (
                index % labelEvery === 0 ||
                index === buckets.length - 1
            ) {

                svgParts.push(`
                    <text
                        x="${x + barWidth / 2}"
                        y="${height - 20}"
                        text-anchor="middle"
                        class="chart-axis-label">
                        ${bucket.label}
                    </text>
                `);
            }
        }
    );


    if (
        buckets.every(
            bucket => bucket.revenue === 0
        )
    ) {

        svgParts.push(`
            <text
                x="${margin.left + plotWidth / 2}"
                y="${margin.top + plotHeight / 2}"
                text-anchor="middle"
                class="chart-empty-label">
                Chưa có doanh thu hoàn tất trong kỳ này
            </text>
        `);
    }


    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    svg.setAttribute(
        "width",
        String(width)
    );


    svg.setAttribute(
        "height",
        String(height)
    );


    svg.innerHTML =
        svgParts.join("");


    svg.style.minWidth =
        `${width}px`;
}


function renderDashboard() {

    const {
        period,
        key
    } = selectedPeriod();


    const field =
        period === "day"
            ? document.getElementById(
                "dashboardDayField"
            )
            : period === "month"
                ? document.getElementById(
                    "dashboardMonthField"
                )
                : document.getElementById(
                    "dashboardYearField"
                );


    document.getElementById(
        "dashboardDayField"
    ).hidden =
        period !== "day";


    document.getElementById(
        "dashboardMonthField"
    ).hidden =
        period !== "month";


    document.getElementById(
        "dashboardYearField"
    ).hidden =
        period !== "year";


    const periodInput =
        field.querySelector(
            "input, select"
        );


    if (
        !key ||
        !periodInput.checkValidity()
    ) {

        periodInput.reportValidity();

        return;
    }


    const buckets =
        buildRevenueBuckets(
            period,
            key
        ).map(
            bucket => ({
                ...bucket,
                revenue: 0,
                orderCount: 0,
                completedCount: 0
            })
        );


    const allOrders =
        readDashboardOrders();


    const matchingOrders =
        allOrders.filter(order => {

            const date =
                orderDate(order);

            return (
                date &&
                buckets.some(
                    bucket =>
                        bucket.matches(date)
                )
            );
        });


    matchingOrders.forEach(
        order => {

            const date =
                orderDate(order);


            const bucket =
                buckets.find(
                    item =>
                        item.matches(date)
                );


            bucket.orderCount++;


            if (
                Number(order.deliveryStage) >= 3
            ) {

                bucket.completedCount++;

                bucket.revenue +=
                    orderNetRevenue(order);
            }
        }
    );


    const completedOrders =
        matchingOrders.filter(
            order =>
                Number(order.deliveryStage) >= 3
        );


    const revenue =
        buckets.reduce(
            (sum, bucket) =>
                sum + bucket.revenue,
            0
        );


    document.getElementById(
        "dashboardRevenue"
    ).textContent =
        moneyLabel(revenue);


    document.getElementById(
        "dashboardOrders"
    ).textContent =
        String(matchingOrders.length);


    document.getElementById(
        "dashboardAverage"
    ).textContent =
        moneyLabel(
            completedOrders.length
                ? revenue /
                completedOrders.length
                : 0
        );


    document.getElementById(
        "dashboardPending"
    ).textContent =
        String(
            allOrders.filter(
                order =>
                    Number(order.deliveryStage) < 3
            ).length
        );


    const periodTitle =
        period === "day"
            ? new Date(
                `${key}T00:00:00`
            ).toLocaleDateString(
                "vi-VN",
                {
                    dateStyle: "long"
                }
            )
            : period === "month"
                ? new Date(
                    `${key}-01T00:00:00`
                ).toLocaleDateString(
                    "vi-VN",
                    {
                        month: "long",
                        year: "numeric"
                    }
                )
                : key;


    document.getElementById(
        "dashboardRevenuePeriod"
    ).textContent =
        periodTitle;


    document.getElementById(
        "dashboardChartTitle"
    ).textContent =
        `Doanh thu theo ${period === "day"
            ? "giờ"
            : period === "month"
                ? "ngày"
                : "tháng"
        } · ${periodTitle}`;


    document.getElementById(
        "dashboardChartDescription"
    ).textContent =
        `Mỗi cột là ${period === "day"
            ? "một khoảng 3 giờ"
            : period === "month"
                ? "một ngày trong tháng"
                : "một tháng trong năm"
        } · chỉ tính đơn đã giao.`;


    renderDashboardChart(
        buckets
    );


    document.getElementById(
        "dashboardHistory"
    ).innerHTML =
        buckets
            .map(
                bucket => `
                    <tr>
                        <td>${bucket.interval}</td>
                        <td>${bucket.orderCount}</td>
                        <td>${bucket.completedCount}</td>
                        <td>
                            <strong>
                                ${moneyLabel(bucket.revenue)}
                            </strong>
                        </td>
                    </tr>
                `
            )
            .join("");


    document.getElementById(
        "dashboardHistoryEmpty"
    ).hidden =
        matchingOrders.length > 0;
}


function updateDashboardPeriodFields() {

    updateDashboardPeriodMenu();

    closeCalendarPickers();

    document.getElementById(
        "dashboardDayField"
    ).hidden =
        dashboardPeriod.value !== "day";


    document.getElementById(
        "dashboardMonthField"
    ).hidden =
        dashboardPeriod.value !== "month";


    document.getElementById(
        "dashboardYearField"
    ).hidden =
        dashboardPeriod.value !== "year";


    // SỬA LỖI ĐỆ QUY VÔ HẠN
    renderDashboard();
}


function closeDashboardPeriodMenu() {

    dashboardPeriodMenu.hidden = true;

    dashboardPeriodTrigger.setAttribute(
        "aria-expanded",
        "false"
    );
}


function updateDashboardPeriodMenu() {

    const selected =
        dashboardPeriod.value;


    const selectedOption =
        dashboardPeriodMenu.querySelector(
            `[data-period="${selected}"]`
        );


    dashboardPeriodTrigger
        .childNodes[0]
        .textContent =
        selectedOption
            ?.querySelector("span")
            .textContent ||
        "Chọn kỳ";


    dashboardPeriodMenu
        .querySelectorAll(
            "[data-period]"
        )
        .forEach(option => {

            option.setAttribute(
                "aria-checked",
                String(
                    option.dataset.period ===
                    selected
                )
            );
        });
}


const currentDashboardDate =
    new Date();


populateDashboardYears();


dashboardDay.value =
    localDateKey(
        currentDashboardDate
    );


dashboardMonth.value =
    `${currentDashboardDate.getFullYear()}-${String(
        currentDashboardDate.getMonth() + 1
    ).padStart(2, "0")}`;


updateCalendarTriggers();


dashboardPeriod.addEventListener(
    "change",
    updateDashboardPeriodFields
);


dashboardPeriodTrigger.addEventListener(
    "click",
    () => {

        const isOpen =
            dashboardPeriodTrigger
                .getAttribute(
                    "aria-expanded"
                ) === "true";


        closeDashboardPeriodMenu();


        if (!isOpen) {

            dashboardPeriodMenu.hidden =
                false;


            dashboardPeriodTrigger
                .setAttribute(
                    "aria-expanded",
                    "true"
                );


            dashboardPeriodMenu
                .querySelector(
                    '[aria-checked="true"]'
                )
                ?.focus();
        }
    }
);


dashboardPeriodMenu.addEventListener(
    "click",
    event => {

        const option =
            event.target.closest(
                "[data-period]"
            );


        if (!option) return;


        dashboardPeriod.value =
            option.dataset.period;


        closeDashboardPeriodMenu();


        dashboardPeriod.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );


        dashboardPeriodTrigger.focus();
    }
);


[
    dashboardDay,
    dashboardMonth
].forEach(
    input =>
        input.addEventListener(
            "change",
            () => {

                updateCalendarTriggers();

                renderDashboard();
            }
        )
);


dashboardYear.addEventListener(
    "change",
    renderDashboard
);


dashboardDayTrigger.addEventListener(
    "click",
    () => {

        const isOpen =
            dashboardDayTrigger
                .getAttribute(
                    "aria-expanded"
                ) === "true";


        if (isOpen) {

            closeCalendarPickers();

        } else {

            openCalendarPicker("day");
        }
    }
);


dashboardMonthTrigger.addEventListener(
    "click",
    () => {

        const isOpen =
            dashboardMonthTrigger
                .getAttribute(
                    "aria-expanded"
                ) === "true";


        if (isOpen) {

            closeCalendarPickers();

        } else {

            openCalendarPicker("month");
        }
    }
);


document
    .getElementById(
        "dashboardDayPicker"
    )
    .addEventListener(
        "click",
        event =>
            handleCalendarClick(
                event,
                "day"
            )
    );


document
    .getElementById(
        "dashboardMonthPicker"
    )
    .addEventListener(
        "click",
        event =>
            handleCalendarClick(
                event,
                "month"
            )
    );


document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".dashboard-date-field"
            )
        ) {

            closeCalendarPickers();
        }


        if (
            !event.target.closest(
                ".dashboard-mode-field"
            )
        ) {

            closeDashboardPeriodMenu();
        }
    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCalendarPickers();

            closeDashboardPeriodMenu();
        }
    }
);


window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "maisoneOrders"
        ) {

            populateDashboardYears();

            renderDashboard();

        } else if (
            event.key ===
            "maisoneInventory"
        ) {

            renderDashboard();
        }
    }
);


let dashboardResizeTimer;


window.addEventListener(
    "resize",
    () => {

        window.clearTimeout(
            dashboardResizeTimer
        );


        dashboardResizeTimer =
            window.setTimeout(
                renderDashboard,
                140
            );
    }
);


renderDashboard();