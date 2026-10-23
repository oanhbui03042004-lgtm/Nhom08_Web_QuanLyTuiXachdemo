const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
function normalizeCartImage(image) {
    if (!image) return "";

    image = String(image).trim();

    // URL Ä‘áº§y Ä‘á»§
    if (/^(https?:)?\/\//i.test(image)) {
        return image;
    }

    // Náº¿u Ä‘Ã£ lÃ  /Content/Images/... thÃ¬
    // chuyá»ƒn vá» Images/... Ä‘á»ƒ dÃ²ng <img> hiá»‡n táº¡i dÃ¹ng Ä‘Æ°á»£c.
    image = image.replace(/^\/+/, "");
    image = image.replace(/^Content\/+/, "");

    return image;
}
let cart = savedCart.map(item => {
    const { size, ...bag } = item;

    const product = products.find(
        product => String(product.id) === String(bag.id)
    );

    const availableColors = product
        ? getProductColors(product)
        : [];

    const color = availableColors.includes(bag.color)
        ? bag.color
        : availableColors[0] || "";

    return {
        ...bag,
        color,
        image: localProductImageFor(bag.id, color),
        qty: bag.qty || bag.quantity || 1,
        selected: bag.selected === true
    };
});

if (
    savedCart.some((item, index) =>
        item &&
        (
            Object.prototype.hasOwnProperty.call(item, "size") ||
            item.image !== cart[index].image ||
            item.selected === undefined ||
            item.selected !== cart[index].selected
        )
    )
) {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
        toast(
            "KhÃ´ng thá»ƒ cáº­p nháº­t giá» hÃ ng Ä‘Ã£ lÆ°u. Thá»­ xÃ³a mÃ£ cÅ© hoáº·c táº£i láº¡i trang."
        );
    }
}

const freeShippingMinimum = 999000;
const shippingFee = 30000;

const shopVouchers = maisoneVouchers;

let selectedProductVoucher = null;
let selectedShippingVoucher = null;

const getVoucherCategory = voucher =>
    voucher?.category === "shipping" ||
        voucher?.type === "ship" ||
        voucher?.type === "shipping-discount"
        ? "shipping"
        : "product";

try {
    const savedProductVoucher = JSON.parse(
        localStorage.getItem("selectedProductVoucher") || "null"
    );

    const savedShippingVoucher = JSON.parse(
        localStorage.getItem("selectedShippingVoucher") || "null"
    );

    const legacyVoucher = JSON.parse(
        localStorage.getItem("selectedVoucher") || "null"
    );

    selectedProductVoucher =
        shopVouchers.find(
            voucher =>
                voucher.code === savedProductVoucher?.code &&
                getVoucherCategory(voucher) === "product"
        ) || null;

    selectedShippingVoucher =
        shopVouchers.find(
            voucher =>
                voucher.code === savedShippingVoucher?.code &&
                getVoucherCategory(voucher) === "shipping"
        ) || null;

    const legacySelection =
        shopVouchers.find(
            voucher => voucher.code === legacyVoucher?.code
        ) || null;

    if (
        legacySelection &&
        getVoucherCategory(legacySelection) === "product" &&
        !selectedProductVoucher
    ) {
        selectedProductVoucher = legacySelection;

        localStorage.setItem(
            "selectedProductVoucher",
            JSON.stringify(legacySelection)
        );
    } else if (
        legacySelection &&
        getVoucherCategory(legacySelection) === "shipping" &&
        !selectedShippingVoucher
    ) {
        selectedShippingVoucher = legacySelection;

        localStorage.setItem(
            "selectedShippingVoucher",
            JSON.stringify(legacySelection)
        );
    }

    if (legacySelection) {
        localStorage.removeItem("selectedVoucher");
    }
} catch (error) {
    toast(
        "Voucher Ä‘Ã£ chá»n bá»‹ lá»—i dá»¯ liá»‡u. HÃ£y chá»n láº¡i voucher."
    );
}

const requestedCoupon =
    new URLSearchParams(location.search).get("coupon");

if (requestedCoupon) {
    const requestedVoucher =
        shopVouchers.find(
            voucher => voucher.code === requestedCoupon
        );

    if (requestedVoucher) {

        if (getVoucherCategory(requestedVoucher) === "shipping") {
            selectedShippingVoucher = requestedVoucher;
        } else {
            selectedProductVoucher = requestedVoucher;
        }

        try {
            localStorage.setItem(
                getVoucherCategory(requestedVoucher) === "shipping"
                    ? "selectedShippingVoucher"
                    : "selectedProductVoucher",
                JSON.stringify(requestedVoucher)
            );

            history.replaceState(
                null,
                "",
                location.pathname
            );
        } catch (error) {
            toast(
                "KhÃ´ng thá»ƒ lÆ°u voucher vÃ o giá» hÃ ng. HÃ£y chá»n láº¡i á»Ÿ bÆ°á»›c thanh toÃ¡n."
            );
        }
    }
}

function money(amount) {
    return amount.toLocaleString("vi-VN") + "Ä‘";
}

function render() {

    const items = document.getElementById("cartItems");
    const summary = document.getElementById("summary");

    // Trang khÃ´ng cÃ³ giá» hÃ ng chi tiáº¿t (vd: trang chá»§) thÃ¬ bá» qua
    if (!items || !summary) return;

    const selectedItems = cart.filter(
        item => item.selected
    );

    const selectedSubtotal = selectedItems.reduce(
        (sum, item) =>
            sum + item.price * item.qty,
        0
    );

    const itemCountEl = document.getElementById("cartItemCount");
    if (itemCountEl) {
        itemCountEl.textContent =
            `${cart.reduce((sum, item) => sum + item.qty, 0)} sáº£n pháº©m Â· ${selectedItems.reduce((sum, item) => sum + item.qty, 0)} Ä‘Ã£ chá»n`;
    }

    const selectAllEl = document.getElementById("selectAllCartItems");
    if (selectAllEl) {
        selectAllEl.checked =
            cart.length > 0 &&
            selectedItems.length === cart.length;

        selectAllEl.indeterminate =
            selectedItems.length > 0 &&
            selectedItems.length < cart.length;
    }

    if (!cart.length) {

        items.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Giá» hÃ ng Ä‘ang trá»‘ng.</p>

                <a class="ui-btn"
                   href="${productsUrl}">
                    KHÃM PHÃ Sáº¢N PHáº¨M
                </a>
            </div>
        `;

        document
            .getElementById("checkoutLink")
            .classList.add("is-disabled");

        document
            .getElementById("checkoutLink")
            .setAttribute("aria-disabled", "true");

        const selectedCodes = [
            selectedProductVoucher?.code,
            selectedShippingVoucher?.code
        ].filter(Boolean);

        summary.innerHTML =
            selectedCodes.length
                ? `<p class="voucher-reminder">
                    ÄÃ£ chá»n ${selectedCodes.join(" vÃ  ")}.
                    ThÃªm sáº£n pháº©m Ä‘á»ƒ kiá»ƒm tra Ä‘iá»u kiá»‡n Ã¡p dá»¥ng.
                  </p>`
                : "";

        return;
    }

    items.innerHTML = cart
        .map(
            (item, index) => `
            <div class="cart-row">

                <label class="cart-item-check">

                    <input
                        type="checkbox"
                        ${item.selected ? "checked" : ""}
                        onchange="toggleCartItem(${index},this.checked)"
                        aria-label="Chá»n ${item.name} Ä‘á»ƒ thanh toÃ¡n"
                    >

                    <span></span>

                </label>

                <a
                    href="${productDetailUrl}?id=${item.id}"
                    class="cart-row-image"
                >
                    <img
                        src="${window.mvcRoot || window.mvcImageRoot || '/Content/'}${item.image}"
                        alt="${item.name}"
                    >
                </a>

                <div class="cart-row-info">

                    <span class="cart-row-category">
                        MAISONÃ‰ Â· ${item.category || "BAG"}
                    </span>

                    <a
                        class="cart-row-name"
                        href="${productDetailUrl}?id=${item.id}"
                    >
                        ${item.name}
                    </a>

                    <p>
                        ${item.color || "MÃ u máº·c Ä‘á»‹nh"}
                        Â· ${item.qty} sáº£n pháº©m
                    </p>

                    <div class="qty">

                        <button
                            aria-label="Giáº£m sá»‘ lÆ°á»£ng"
                            onclick="changeCartQuantity(${index},-1)"
                        >
                            âˆ’
                        </button>

                        <span>${item.qty}</span>

                        <button
                            aria-label="TÄƒng sá»‘ lÆ°á»£ng"
                            onclick="changeCartQuantity(${index},1)"
                        >
                            +
                        </button>

                        <button
                            class="remove-btn"
                            onclick="removeCartItem(${index})"
                        >
                            XÃ“A
                        </button>

                    </div>

                </div>

                <strong>
                    ${money(item.price * item.qty)}
                </strong>

            </div>
        `
        )
        .join("");

    let account = null;

    try {
        account = JSON.parse(
            localStorage.getItem("currentAccount") || "null"
        );
    } catch (error) {
        toast(
            "KhÃ´ng Ä‘á»c Ä‘Æ°á»£c thÃ´ng tin tÃ i khoáº£n Ä‘á»ƒ kiá»ƒm tra voucher."
        );
    }

    const productVoucherEligible = Boolean(
        selectedItems.length &&
        selectedProductVoucher &&
        isVoucherEligible(
            selectedProductVoucher,
            selectedSubtotal,
            account
        )
    );

    const shippingVoucherEligible = Boolean(
        selectedItems.length &&
        selectedShippingVoucher &&
        isVoucherEligible(
            selectedShippingVoucher,
            selectedSubtotal,
            account
        )
    );

    const discount =
        productVoucherEligible
            ? selectedProductVoucher.type === "fixed"
                ? Math.min(
                    selectedSubtotal,
                    selectedProductVoucher.value
                )
                : selectedProductVoucher.type === "percent"
                    ? Math.min(
                        selectedSubtotal *
                        selectedProductVoucher.value,
                        selectedProductVoucher.cap || 150000
                    )
                    : 0
            : 0;

    const freeShipping =
        shippingVoucherEligible &&
        selectedShippingVoucher.type === "ship";

    const shippingDiscount =
        shippingVoucherEligible
            ? freeShipping
                ? shippingFee
                : selectedShippingVoucher.type ===
                    "shipping-discount"
                    ? Math.min(
                        shippingFee,
                        selectedShippingVoucher.value
                    )
                    : 0
            : 0;

    const delivery =
        selectedItems.length
            ? shippingFee - shippingDiscount
            : 0;

    const total =
        Math.max(
            0,
            selectedSubtotal - discount
        ) + delivery;

    const renderSelectedVoucher = (
        voucher,
        eligible,
        category,
        emptyMessage
    ) =>
        voucher
            ? `
                <div class="selected-voucher voucher-kind-${category} ${eligible ? "" : "voucher-ineligible"
            }">

                    <i class="fa-solid fa-ticket"></i>

                    <span>
                        <b>${voucher.code}</b>

                        <small>
                            ${eligible
                ? `${voucher.label} Â· ${formatVoucherValidity(voucher)}`
                : selectedItems.length
                    ? `${voucher.condition} Â· ${formatVoucherValidity(voucher)}`
                    : "Chá»n Ã­t nháº¥t má»™t sáº£n pháº©m Ä‘á»ƒ Ã¡p dá»¥ng voucher"
            }
                        </small>
                    </span>

                    <button
                        aria-label="Bá» voucher ${category}"
                        onclick="clearVoucher('${category}')"
                    >
                        Ã—
                    </button>

                </div>
            `
            : `
                <div class="selected-voucher">
                    <span>${emptyMessage}</span>
                </div>
            `;

    const voucherLines = [

        renderSelectedVoucher(
            selectedProductVoucher,
            productVoucherEligible,
            "product",
            "ChÆ°a chá»n voucher giáº£m giÃ¡ sáº£n pháº©m"
        ),

        renderSelectedVoucher(
            selectedShippingVoucher,
            shippingVoucherEligible,
            "shipping",
            "ChÆ°a chá»n voucher váº­n chuyá»ƒn"
        )

    ].join("");

    summary.innerHTML = `

        ${selectedItems.length
            ? ""
            : `
                    <p class="cart-selection-hint">
                        TÃ­ch chá»n sáº£n pháº©m muá»‘n mua Ä‘á»ƒ tÃ­nh tiá»n.
                    </p>
                `
        }

        <div class="summary-line">
            <span>Táº¡m tÃ­nh</span>
            <b>${money(selectedSubtotal)}</b>
        </div>

        <div class="summary-line">
            <span>Giáº£m giÃ¡ sáº£n pháº©m</span>
            <b class="discount">
                -${money(discount)}
            </b>
        </div>

        <div class="summary-line">
            <span>PhÃ­ váº­n chuyá»ƒn</span>
            <b>
                ${!selectedItems.length
            ? "â€”"
            : money(shippingFee)
        }
            </b>
        </div>

        <div class="summary-line shipping-discount-line">
            <span>Giáº£m phÃ­ váº­n chuyá»ƒn</span>
            <b class="discount">
                -${money(shippingDiscount)}
            </b>
        </div>

        <div class="summary-line">
            <span>PhÃ­ giao sau Æ°u Ä‘Ã£i</span>
            <b>
                ${!selectedItems.length
            ? "â€”"
            : freeShipping
                ? "Miá»…n phÃ­"
                : money(delivery)
        }
            </b>
        </div>

        <div class="summary-total">
            <span>Tá»”NG THANH TOÃN</span>
            <strong>${money(total)}</strong>
        </div>

        ${voucherLines}
    `;

    const checkoutLink =
        document.getElementById("checkoutLink");

    checkoutLink.classList.toggle(
        "is-disabled",
        !selectedItems.length
    );

    if (selectedItems.length) {
        checkoutLink.removeAttribute(
            "aria-disabled"
        );
    } else {
        checkoutLink.setAttribute(
            "aria-disabled",
            "true"
        );
    }
}

function saveCart() {

    try {
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );
    } catch (error) {

        toast(
            "KhÃ´ng thá»ƒ cáº­p nháº­t giá» hÃ ng trÃªn trÃ¬nh duyá»‡t."
        );

        return;
    }

    document
        .querySelectorAll("#cartNumber")
        .forEach(
            element =>
                element.textContent = cartCount()
        );

    render();
}

function toggleCartItem(index, checked) {

    if (!cart[index]) return;

    cart[index].selected = checked;

    try {
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );
    } catch (error) {
        toast(
            "KhÃ´ng thá»ƒ cáº­p nháº­t giá» hÃ ng trÃªn trÃ¬nh duyá»‡t."
        );
        return;
    }

    document
        .querySelectorAll("#cartNumber")
        .forEach(
            element =>
                element.textContent = cartCount()
        );

    render();
}

function toggleAllCartItems(checked) {

    cart.forEach(item => {
        item.selected = checked;
    });

    try {
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );
    } catch (error) {
        toast(
            "KhÃ´ng thá»ƒ cáº­p nháº­t giá» hÃ ng trÃªn trÃ¬nh duyá»‡t."
        );
        return;
    }

    document
        .querySelectorAll("#cartNumber")
        .forEach(
            element =>
                element.textContent = cartCount()
        );

    render();
}

function changeCartQuantity(index, difference) {

    cart[index].qty =
        Math.max(
            1,
            cart[index].qty + difference
        );

    saveCart();
}

function removeCartItem(index) {

    cart.splice(index, 1);

    saveCart();
}

function openVoucherModal() {

    document
        .getElementById("voucherModal")
        .classList.add("show");

    renderVoucherList();

    document.body.classList.add(
        "voucher-modal-open"
    );
}

function closeVoucherModal() {

    document
        .getElementById("voucherModal")
        .classList.remove("show");

    document.body.classList.remove(
        "voucher-modal-open"
    );
}

function renderVoucherList() {

    const selectedItems =
        cart.filter(item => item.selected);

    const subtotal =
        selectedItems.reduce(
            (sum, item) =>
                sum + item.price * item.qty,
            0
        );

    let account = null;

    try {

        account = JSON.parse(
            localStorage.getItem("currentAccount") || "null"
        );

    } catch (error) {

        toast(
            "KhÃ´ng Ä‘á»c Ä‘Æ°á»£c thÃ´ng tin tÃ i khoáº£n Ä‘á»ƒ kiá»ƒm tra voucher."
        );
    }

    const availableVouchers =
        selectedItems.length
            ? shopVouchers.filter(
                voucher =>
                    isVoucherEligible(
                        voucher,
                        subtotal,
                        account
                    )
            )
            : [];

    const productVouchers =
        availableVouchers.filter(
            voucher =>
                getVoucherCategory(voucher) === "product"
        );

    const shippingVouchers =
        availableVouchers.filter(
            voucher =>
                getVoucherCategory(voucher) === "shipping"
        );

    const renderVoucher = voucher => `

        <div class="shop-voucher shop-voucher-${voucher.category}">

            <div>

                <span>
                    ${voucher.code}
                </span>

                <b>
                    ${voucher.label}
                </b>

                <small>
                    ${voucher.condition}
                </small>

                <small class="voucher-validity">
                    ${formatVoucherValidity(voucher)}
                </small>

            </div>

            <button
                onclick="chooseVoucher('${voucher.code}')"
            >
                ${(
            getVoucherCategory(voucher) === "shipping"
                ? selectedShippingVoucher
                : selectedProductVoucher
        )?.code === voucher.code
            ? "ÄANG Sá»¬ Dá»¤NG"
            : "DÃ™NG NGAY"
        }
            </button>

        </div>
    `;

    const groups = [

        productVouchers.length
            ? `
                <section class="voucher-group">

                    <h3>
                        Voucher giáº£m giÃ¡ sáº£n pháº©m
                    </h3>

                    ${productVouchers
                .mavìág!dg°Tkuá8eH0	@(²!d#°£ ."S$ & ZmMê(²b+mH° C b¢8(4100!.o#§pekŒî0´(°°1`Â(*(@‘B:`d²p `h$±  )0! ¢, ( / 2cŠahéasëØG×e¤ìªf46_éoå=a.J¢¤%"!1 (±µ(&Éxa"0 §¡cä€  bg¤Ure@æéMfâC­ECJrïqËdÔ|)fr©Ue*®AJO j`Ó¤"  !0:"tà ¤å`°h(x(s8
lQ¼r.+”¤€$‘4# " $"a0FÍejx@Rb~í³‹n0âaWøÅı	nAJa†(g TP ágh¢  0d ! ,wg:V\]%!4F( (b B .3» „ ?yóIyzp Æsöpgj@rwKh ¢(
` —¹`-ª1@“,ìÕ2 Ó%ò¥cvÖmqg+¥t)LK‰ © "`"I$ (¤`n~o…lIÛ¨¡¨ 0 3ğà8ğ,2: ¤¼.e&tá*>I
)%É d  å(0à `	KX(! ,).0#( ‘"ï&ÓK.4 $$Y+ #H)äm£gÏEjä±oçÓô\)7m*rbÑWäI‹‚* ` °¢Ä`notÁ#ãr$ë;æ€­Nè±© 9k%FIsÈÂX í}Œğ¢% dƒ$¤qC÷Rg®©o%ÇX(b:bf¤Sğ #¤t|•À¨¢à"q,l
"%@Á°¨à(,),ğ`%éûpíµbwìmfø­m¯d\ØDš
"  òH`I$è0)(! "%$KBÌì'cDaïÇtåoıìgşM~ØBö$)!e18&a91p= jGøÆ²¤ş‘q3ïL7èaq9•´? …³ã»¦ äQéG¸‡ı0jM%«_ceu(àÓcò€ÿf/ `Éà»mlÃš$$b9Œš
r<òº @Ê" à`#´€0Y ÔÏ¹wü3vim›ş³â	¶+(1~a¹u0½´D±‘.`Ï}¡0…“é3Ê kçM8vNc"ègÙ0C Qdä¿°èu@ÔÅ–¨éû!dn¶ŒX¸¤ŠuÌ
(£€ &ãv4  $´%w<N  &èu1x{Ut	·d,àpsz8u=™qiDÍucye(r‡|bÿG7Hù1<w;'st_ÊÕChµR0ùÊR<Ää,°"""xÿvn_ƒHÅ0p.fct,¶‚8`- ¢ f¨ °yÔş ·@iìã-&a-õ!}»p1ädª!àt(  3}1o ! àif>`§Ö?õc Mæ%5`Ôtur¬Á,"¦ckş'E!³æe+&e|PvBm{#57vh" B"BDrihÈTå#€i5¥¥ ´>!c"g;`neóëø±-ˆ¡À js·ÚSòs5rôì¬(( ßZ¹m46  qgœ`Cvu\I4e-q¬ruuuc×è‰j‚ˆ   a1
 `š3uøÈ	íÌwY+%,4 ¥ ¦5d°h°``b (iY(£ B}|.q³ÙÄ±"`kUñM|×t;Ä„£aÆ%-`R@€** ¬9%5(`è1!-;<‰¸!E Äel¥C{R}ntB= Vÿ|lDœ£¢2"tj8 yQ+-,¢b,&"AbuOuîg¬4Ûä0!òB%,"2¶2b$2  éG'{v¾ô#5‘.sæVLu/ 5qRgtS3gÌ%j u#|x42îUø$:¢204ä   +_‹Mn 2€â72a-ôã 0bíwx`ğ+ *¦‰>),"€"6 7awp( 	L(¤¡$¢ €À{Íáò5ngHÖÅ¡	/³aL”Â  «ãui”AÕ&"Çgàuw XC¥i4yH¿©Zc*¡4”í“ ³I	;šè­hZa$f,¼b#/òŠ¬`ª0€­Xpi:,ˆ(éM
”Mhb(ÌO#©!t* `e±¡9rõmfwu=`õám÷;lm/&o\2n8h%12Y²d¤Œ8+Ëğ/èe|E>!'ãcÌd(**  õ#àà5i(p!6U÷chg{,ï*#± p`0"¥  ÊYxv4öYx	#$( 	4!eBn}nU 8  pˆ ¥%DJà°` ° Óí
o@"‚$($õÌ‘r—‹Ú
"a"1E$ äº*4àà—Ñê,")×Œé#´)êâ“åjÀá» $9/e£‘g9aºbjúÊ½8n /¸™TZcÅMäéb ª „vb'°%ch?":L$â0 j rÕ=eT6³_A `(}ŒX!‹( Hökkns46cieaébY =Ã…h(q"" w5VtÿáHåBÊyğOgr¹xrUw`qZ9;…Œ0¡ »/î€°!s÷ïyceSe{(µ•J @ )p!¡ã`üEÙf y§¹¦2ñ*bp".e(ß
!P`‚F (3€¢@$z|ìíev\dG¬éT(JDo^ëgğÉõr<n9"!(z dõ$ z%8áEdáj÷eFTN<ãõBvF_eg(%Z(?	
É%2 hKÆÂãs3gpù£;å<¡&C`*vJÁnO¨% IO€ &!e(4eÌ(ÀlAvCèjhèin§S_u@%F29±mwiuó:¨`%¢x"mXg%89O, „¨ €1`sDfçut `aro4uCudw$¹ä‚;$~¦w"H%Q9m" @a;¬ "¼pz™€q CÀ@`¢"0` m§£Áj'|oqgC±.'pì”t¸Lj%($á4 ¨ 1!0ôoğPbeJki$ ’ 15$d))ÊRLJneôr`ç_Fi<VëQAzOr¹É@($(0  $‰
‡H % äˆ`(E-kcB/òcçd>`eMë2åŒüBe*>K/(¶Iq!!¾ +°ËëohdavÃˆv‡1PhÁú.ª8#¥,"b.m+
>" $ |âæq\)~ 9wprs(ëIØ( p !à "U%grñ 5"¡ª° $>   "r_Dßœ.Ê txà»ƒ$ÃÁe T0oW`V×£cH6ÇÁLL"f¬9|q»toÁ¢¸¶!2 ,I#)"m#$¤ñ )Œ,¢:Uôğ0»ßŠ@  $iÚ4h€$q·wÅìiu#k#´j”ù}( ûoÎ
p`,vîG× sNa#•KÂh,0{$^ åSL/õcxQL®ft)©> 8$¨4² toÀqe ` qb!(!@ÔLË+´À¯0aàƒ›¨lEB
JNï}j)U2Co^á}ğ‰l v»‚=zo©z\ç¦)O*"`eeôqT+½@´Gp(s¡xEUv99*!Æ5<¨*	f¥: ğq|umNp
9	•0 ù	a|0KlÇb)$jK†@c£:”b qwL1#¼eÂ7XibÑ	B§Æoåaruz |á){¬L­&
Iğ   D ¤)HnGñlB:fvee$oÍ_|aÑvá-&	$ä( ¡"$ a± õ5LP{²ElV(mtji\cso¶6i3¡ ec¬L8"è+heÚ` $D}åB.z`-­H8`00(5$gÓen`ÓTâxĞt}ås^BGÕf)a} nLL_
MÄcë 02J`(ïcCnKsA×Ô¯ò%m-Öî%w¤ı,ê„¨$69¨ ¡   37§äuköP$PbndcV½unDe  ËÔ¶ )%9%dd0€À”9­©MJ$$h(Lî`çìpï[ñw·-Â¡Kã4§	æf 8 5p¨Ia'W5ùD½ îD¿$îiıó$^ "$¨i C¡±³ìÎV
` É;Jo´ƒğ$oágF
M e`è¨((aQwñÛOU	p=;½&vj)8Ôing'_a<A6&i q´8.$b„¸…Ë0Ë£ê1~oµclwR !aª¤ïD7lU¸Ó"l¤", " `µ  {Á6ÅÆ³èbåİ*wo]yağp»;£n£Ğh­şÉ}ê*±p )Ö=Mª
-=2Llñyt‰‚2"jque;W,|ìgr#rBDÈÈ£jCpynNpÿGÏs*©… i2).a-saClŒ
$ à°0*(­ámmm-nV=v·@(€i2` ! "gmeLDn¢œ‡p|bN_üEvw€TÃà&tBKnmr¨{dd¸0)+-
‹pnÆ!s	9k