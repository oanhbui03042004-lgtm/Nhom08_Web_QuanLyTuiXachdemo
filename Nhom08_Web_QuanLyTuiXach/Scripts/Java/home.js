



const selectedColors = {};

const defaultBagColors = [
    "Đen Noir",
    "Nâu Cognac",
    "Kem Ivory",
    "Đỏ Burgundy"
];

function getProductColors(product) {
    return product.colors || defaultBagColors;
}


function formatPrice(number) {

    return number.toLocaleString("vi-VN") + "đ";

}

function getMvcImagePath(image) {
    const cleanPath =
        String(image || "")
            .replace(/^\/+/, "");

    return `${window.mvcImageRoot || "/Content/"}${cleanPath}`;
}


const HOME_PRODUCT_LIMIT = 6;

function renderProducts(
    list = products.slice(0, HOME_PRODUCT_LIMIT)
) {

    const grid =
        document.getElementById(
            "homeFeaturedProducts"
        );

    if (!grid) return;

    grid.innerHTML =
        list
            .map(product => {

                const imagePath =
                    getMvcImagePath(
                        product.image
                    );

                const colors =
                    getProductColors(product);

                const productDetailUrl =
                    window.mvcUrls?.productDetail ||
                    window.productDetailUrl ||
                    "#";

                return `
                    <article class="product">

                        <div class="product-image">

                            <img
                                src="${imagePath}"
                                alt="${product.name}"
                                loading="lazy"
                            >

                            <span class="product-label">
                                ${product.label || "NEW"}
                            </span>

                            <!-- TRÁI TIM -->
                            <button
                                type="button"
                                class="favorite"
                                onclick="
                                    event.stopPropagation();
                                    favorite(this);
                                "
                                aria-label="Yêu thích"
                                title="Yêu thích"
                            >
                                <i class="fa-regular fa-heart"></i>
                            </button>

                            <!-- NÚT HIỆN KHI HOVER -->
                            <div class="product-overlay">

                                <div class="product-actions-hidden">

                                    <!-- CHI TIẾT -->
                                    <button
                                        type="button"
                                        class="product-icon-btn"
                                        onclick="
                                            event.stopPropagation();
                                            window.location.href =
                                                '${productDetailUrl}?id=${product.id}';
                                        "
                                        aria-label="Xem chi tiết"
                                        title="Xem chi tiết"
                                    >
                                        <i class="fa-solid fa-book-open"></i>
                                    </button>

                                    <!-- THÊM VÀO GIỎ -->
                                    <button
                                        type="button"
                                        class="product-icon-btn"
                                        onclick="
                                            event.stopPropagation();
                                            addCart(
                                                ${product.id},
                                                {
                                                    color: '${colors[0] || ""}'
                                                }
                                            );
                                        "
                                        aria-label="Thêm vào giỏ"
                                        title="Thêm vào giỏ"
                                    >
                                        <i class="fa-solid fa-bag-shopping"></i>
                                    </button>

                                </div>

                            </div>

                        </div>

                        <div class="product-info">

                            <div class="product-category">
                                ${product.category || ""}
                            </div>

                            <h3 class="product-name">
                                ${product.name}
                            </h3>

                            <div class="price">
                                ${Number(
                    product.price || 0
                ).toLocaleString("vi-VN")}đ
                            </div>

                        </div>

                    </article>
                `;

            })
            .join("");
}


function toggleProductActions(
    event,
    image
) {

    if (
        event.target.closest("button")
    ) {
        return;
    }

    image.classList.toggle(
        "actions-visible"
    );

}
function filterProducts(category, button) {

    document
        .querySelectorAll(".filter button")
        .forEach(
            btn => btn.classList.remove("active")
        );

    if (button) {
        button.classList.add("active");
    }


    if (category === "all") {

        renderProducts(products);

    } else {

        const result =
            products.filter(
                product =>
                    product.category === category
            );

        renderProducts(result);

    }

}


function favorite(button) {

    button.classList.toggle("active");

    if (button.classList.contains("active")) {

        button.textContent = "♥";

        showToast(
            "Đã thêm vào danh sách yêu thích ♡"
        );

    } else {

        button.textContent = "♡";

    }

}


function addToCart(id) {

    const product =
        products.find(
            product => product.id === id
        );

    if (!product) return;


    const color =
        arguments.length > 1 &&
            arguments[1]
            ? arguments[1]
            : getProductColors(product)[0];


    const item =
        cart.find(
            item =>
                item.id === id &&
                item.color === color
        );


    if (item) {

        item.quantity++;

    } else {

        cart.push({
            ...product,
            color,
            quantity: 1
        });

    }


    updateCart();


    showToast(
        product.name +
        " đã được thêm vào giỏ hàng 👜"
    );
}

function updateCart() {

    const count =
        document.getElementById(
            "cartCount"
        );

    const body =
        document.getElementById(
            "cartBody"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!count || !body || !totalElement) {
        return;
    }


    const totalQuantity =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    count.textContent =
        totalQuantity;


    if (cart.length === 0) {

        body.innerHTML = `

            <div class="empty-cart">

                👜

                <br>

                Your bag is empty.

                <br>

                Hãy chọn một sản phẩm bạn yêu thích.

            </div>

        `;

        totalElement.textContent =
            "0đ";

        return;

    }


    let total = 0;

    body.innerHTML = "";


    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;


        body.innerHTML += `

            <div class="cart-product">

                <img
                    src="${getMvcImagePath(item.image)}"
                    alt="${item.name}"
                >


                <div class="cart-product-info">

                    <h4>
                        ${item.name}
                    </h4>


                    <small class="cart-product-color">
                        Màu: ${item.color || "Đen Noir"}
                    </small>


                    <div class="cart-price">
                        ${formatPrice(item.price)}
                    </div>


                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${item.id},-1)"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>
                        <button
                            onclick="changeQuantity(${item.id},1)"
                        >
                            +
                        </button>
                        <button
                            class="delete"
                            onclick="removeItem(${item.id})"
                        >
                            XÓA
                        </button>
                    </div>

                </div>

            </div>

        `;

    });


    totalElement.textContent =
        formatPrice(total);

}
function changeQuantity(id, amount) {

    const item =
        cart.find(
            item => item.id === id
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    updateCart();

}

function removeItem(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    updateCart();


    showToast(
        "Đã xóa sản phẩm"
    );

}
function openCart() {

    const cartElement =
        document.getElementById("cart");

    const overlay =
        document.getElementById("overlay");

    if (cartElement) {
        cartElement.classList.add("show");
    }

    if (overlay) {
        overlay.classList.add("show");
    }

}

function closeCart() {

    const cartElement =
        document.getElementById("cart");

    const overlay =
        document.getElementById("overlay");

    if (cartElement) {
        cartElement.classList.remove("show");
    }

    if (overlay) {
        overlay.classList.remove("show");
    }

}
function openProduct(id) {

    const product =
        products.find(
            product => product.id === id
        );


    if (!product) return;


    selectedProductId = id;


    const modalImage =
        document.getElementById(
            "modalImage"
        );

    if (modalImage) {

        modalImage.src = getMvcImagePath(product.image);

        modalImage.alt =
            product.name;

    }


    const modalCategory =
        document.getElementById(
            "modalCategory"
        );

    if (modalCategory) {
        modalCategory.textContent =
            product.category;
    }


    const modalName =
        document.getElementById(
            "modalName"
        );

    if (modalName) {
        modalName.textContent =
            product.name;
    }


    const modalPrice =
        document.getElementById(
            "modalPrice"
        );

    if (modalPrice) {

        modalPrice.textContent =
            formatPrice(
                product.price
            );

    }


    const modalMeta =
        document.getElementById(
            "modalMeta"
        );

    if (modalMeta) {

        modalMeta.innerHTML = `

            <span>
                ${product.category}
            </span>

            <span>
                ${product.label || "MAISONÉ"}
            </span>

            <span>
                TIMELESS DESIGN
            </span>

        `;

    }

    const modalDescription =
        document.getElementById(
            "modalDescription"
        );

    if (modalDescription) {

        modalDescription.textContent =
            product.description;

    }
    const modalStoryTitle =
        document.getElementById(
            "modalStoryTitle"
        );

    if (modalStoryTitle) {

        modalStoryTitle.textContent =
            product.storyTitle;

    }

    const modalStory =
        document.getElementById(
            "modalStory"
        );

    if (modalStory) {

        modalStory.textContent =
            product.story;

    }


    const colorSelect =
        document.getElementById(
            "modalColor"
        );

    if (colorSelect) {

        colorSelect.innerHTML =
            getProductColors(product)
                .map(
                    color =>
                        `<option value="${color}">
                            ${color}
                         </option>`
                )
                .join("");


        colorSelect.value =
            selectedColors[id] ||
            getProductColors(product)[0];


        colorSelect.onchange =
            function () {

                selectedColors[id] =
                    colorSelect.value;

            };

    }

    const modalAdd =
        document.getElementById(
            "modalAdd"
        );

    if (modalAdd) {

        modalAdd.onclick =
            function () {

                addToCart(
                    product.id,
                    colorSelect
                        ? colorSelect.value
                        : getProductColors(product)[0]
                );

                closeModal();

            };

    }

    const modal =
        document.getElementById(
            "modal"
        );

    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}

function closeModal() {

    const modal =
        document.getElementById(
            "modal"
        );

    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}
function outsideModal(event) {

    if (
        event.target.id ===
        "modal"
    ) {

        closeModal();

    }

}

function toggleMobileMenu() {

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    if (!mobileMenu) return;


    const isOpening =
        !mobileMenu.classList.contains(
            "show"
        );


    mobileMenu.classList.toggle(
        "show",
        isOpening
    );

}


function openSearch() {

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const search =
        document.getElementById(
            "search"
        );


    if (mobileMenu) {

        mobileMenu.classList.remove(
            "show"
        );

    }


    if (search) {

        search.classList.add(
            "show"
        );

    }


    setTimeout(
        () => {

            document
                .getElementById(
                    "searchInput"
                )
                ?.focus();

        },
        200
    );

}


function closeSearch() {

    const search =
        document.getElementById(
            "search"
        );

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchResult =
        document.getElementById(
            "searchResult"
        );


    if (search) {

        search.classList.remove(
            "show"
        );

    }


    if (searchInput) {

        searchInput.value = "";

    }


    if (searchResult) {

        searchResult.textContent =
            "";

    }

}


function searchProducts(
    inputValue = ""
) {

    const keyword =
        inputValue
            .toLowerCase()
            .trim();


    const result =
        !keyword
            ? products
            : products.filter(
                product =>
                    product.name
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    product.story
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(keyword)
            );


    const searchResult =
        document.getElementById(
            "searchResult"
        );


    if (searchResult) {

        searchResult.textContent =
            keyword
                ? `Tìm thấy ${result.length} sản phẩm`
                : "";

    }


    renderProducts(result);

}


function subscribe(event) {

    event.preventDefault();


    const email =
        document
            .getElementById(
                "email"
            );


    showToast(
        "Đăng ký thành công! ♡"
    );


    if (email) {

        email.value = "";

    }

}

let currentAccount =
    JSON.parse(
        localStorage.getItem(
            "maisoneCurrentAccount"
        ) || "null"
    );





function getAccounts() {

    const savedAccounts =
        JSON.parse(
            localStorage.getItem(
                "maisoneAccounts"
            ) || "[]"
        );


    if (!savedAccounts.length) {

        saveAccounts(
            demoAccounts
        );

        return [
            ...demoAccounts
        ];

    }


    return savedAccounts;

}


function saveAccounts(accounts) {

    localStorage.setItem(
        "maisoneAccounts",
        JSON.stringify(accounts)
    );

}


function openAccount() {

    const accountModal =
        document.getElementById(
            "accountModal"
        );


    if (!accountModal) return;


    accountModal.classList.add(
        "show"
    );


    if (currentAccount) {

        switchAccountTab(
            "login"
        );


        const loginEmail =
            document.getElementById(
                "loginEmail"
            );


        if (loginEmail) {

            loginEmail.value =
                currentAccount.email ||
                "";

        }

    }

}


function closeAccount() {

    const accountModal =
        document.getElementById(
            "accountModal"
        );


    if (accountModal) {

        accountModal.classList.remove(
            "show"
        );

    }

}


function outsideAccount(event) {

    if (
        event.target.id ===
        "accountModal"
    ) {

        closeAccount();

    }

}


function switchAccountTab(type) {

    const loginPanel =
        document.getElementById(
            "loginPanel"
        );

    const registerPanel =
        document.getElementById(
            "registerPanel"
        );

    const forgotPanel =
        document.getElementById(
            "forgotPanel"
        );

    const loginTab =
        document.getElementById(
            "loginTab"
        );

    const registerTab =
        document.getElementById(
            "registerTab"
        );


    const isLogin =
        type === "login";


    if (loginPanel) {

        loginPanel.style.display =
            isLogin
                ? "block"
                : "none";

    }


    if (registerPanel) {

        registerPanel.style.dispd+O_t8'R���1�Tp?d+Lu�'���$O[t;gSj��1�e�k/O\49�R޽�q��;`h
c%���D[s{e�k	�F�2�՟(��b橊�� J�7 ��O#t�Jʷ6���n�lWm���}�!�r���;:�S-�݁��j�/���~� \9ʒ�-���i���|D!�XE��5��^�8eҫ�I�6��NҴ]�y�������щ�f����TD 3X��$�@[p;dkM�u�'%ڛ+K_wx&�����A�0`(^�8cR�����Pt<'Qڼ[1�TCq�$Hv�f�jʯ<��lSm�큍�e�+2�U�?>�l-�ݓ������|`!�N��g7j��.�A��V�>�P]�9���]�9����
�ŸS2�ձ�4hn��d}�a�hd.�\y�"�����J��#���яd	�F�r�%�[(;^�xm⭉����se���O$4WK~�`v�&���k/L5��ގ�dZ�{?cP)���PV�>��D\3y���	���!�oJ�7=֑��hMw%�
�Gr�%�[9�R�}��H}����b©���pM�5�W'~��k8/R�=�Ѿ�pY�:�S}Ρ�xob�)���Dj�o5�
΅�c/i�.��Z���K�LF�����"�وZ�
�G���8QҼ]���B�q��b�i�n��HM����"ƙ���
��C3q��_xb�����pB�1�Tse�+F�2敊�'��#Yκ�se�+�N�4N�tn�lz��=�Ѧ�z�����N޴Xwz��:������j�/
���*��X	���"�ٜZ���DQ�|E��EƳ�͇��9��M�u��8J��-�������F�r�%��++__x8"������� t '@�4WB���tt'gZ��?3P�� S@=��cE����S}�ᕈo&����@n�,t�I���6ʖ�.ޜXi���<Q��\A��B�1�Tm�m�-��	�����9��������4sWe�� @ 0
�G$2�U�?`(��c����@_p8$�M�u�g0*�/H6������W��0gT*�_08�M�5�W3~��o,��鑎�dM�u�g$*�_+xb�)����C��tSg}ꡏ8d�M�u�'4�K.�\v����ŗ.��e��*�_8R�=�Q��r��K,7]ֹ���E��$u�gj�o'l��=�Q��|q��HKv�f�����
��=�ѐ\l9��͝���>�A�0U�?P<���Q��e�� OX4:�S.��q��j�ol��}�a��}���x{b�i����E��/����W>��f�*����K"�Y���������i���L��Q��{�@I�6��N��Y�z�	����ŝ�)����A��4 X��s#e���K7OV�>�PF�2�Մ_#x�ɧ���$Q�|[a�hCn��tM�u��':��+-�]�9���-��	��š�8mҭ������pGd2�U�0 J�7#V����O4Eγu�g*�_$8R�}�a��s>��{#I������M�u�g?j�/,�ɖ����XU��0� _@80�
�E�31��_x"��������@gp*�;Hv����'Z��$s[e�koA�0M�5�W(>��hl.��}�����B�q��xKb�i����F���E�3)���X
��3"�ٯ��@R�=��Lv���
Ƈ⍉���:�S��A��o,]���B�1��e�k(/^�8iҮݼY���Cq¤Q�|sa��K�Dv�f����
�E��2�Փ-������J��F�2�Ջ'H��6�Vʾ�0^�8oR�=�ѱ�ti�nʬW=���l`-����f�j�o�M���-���~��A�0f�*�_8҃�ɸV�ŰS4=�Q��hq�L{u�g	��"��J�7��n�lI��͆բ�9�ꍏ%�;KSw}桊�g��� p$
�G+r�e�+>�Ph<.��lY��̓��8T�M�5�7N��n�lF������ y�"ڙ�*�_x"�Y���C���Pw|&���[�A�pu�'Z�{"�Y������,Q��Y���C1ƔR�}�!��{�K9�Rƽ��}�a��rΥ�{/c\)����Q��k1�TL?u�'��&�Z޻sJ��;�B��e�k9�R�=�ѯ|	���Rֽ��D~�`u�'��k#oY�:����)��HL6���ƈR潊�z�c!��Nڴ[7{V�~��B�1��n�lL-�݇������� a�(Z��(s^��{�A��r�%�[-�]�y���I����v֦���C��4WW~��px$"�Y�z�c )��\���х�c)����TZ�{0#T�J�7���KwM浊�'���!�Xd:�S?}�!�iʮ�<^��lB��q�dy�b�i�.�\L9�����������u�'ڏ$[G{r�e��2�U�?/P<	���R�����L 5���$g[j�o3l��
��C<1��\_y�"���
��&���[;F�r�卋%�[:�S3}��h���a��`N�4~�`n�,~��i�.�J��ƄR�}���z֣��Bֱ��hGn��u��1��g/j�/)���Zֻ�HE�������m��
�E��7փ��HV����F�2�U��)��H�����b֩���@N�4tgN��7`���@cp)��HWv���z�#Y��Ճ!�V���0J�7/V�>��N�4Y�zޣyʢ�9���m���}�a�hu�z��#	������I�v�f�*�	Ɔ��݉������@T0?T?L5�ΏdkD/s\%���A�pkd/k\/y�"�ٚ��KD7sV��� C@1�DsD%�[�Cq��PK|7a֨^��@r�%�7KV�~��F�2��,|�ɈV���W>�Pa�(AްXt:�S:��1��i�n�,N��i�n�I����b�i���N��KwB����se«�Lp5�N�tb�i���<E��E�����]�y�"�Y�:���I���Ͷն�6�ڎ�$[[{{cci����TU�    
� ���  
��'"���*�_ 8 �
��2�ՠ_88������1�Tu�g *� ���!��g*��?(�eƫ�M�5�8��m�m��͵��/6�����T_x "����' � X��� u�'��+'_Z�;2�U��=��x�	���R½���t}�a��g>��, �	���"�Y�:�S=�ѓm��ͮռ_1�B�q�${[c{i�n��V��Հ_ 8���%��3+U� 
�*��!�~��g8*��-����f�*�_�
����79֒��M���70��DL3u��
�&���F�2���!�{J�w9���
���c1��N�tX'z��+9�R�=���,]�9�捊�:�S"�ٱ��koB�1��q�dh+n�lh-i���CE��E�s��K�O��A��b�)�^�I�����6ҖݮټZ��CCq��DKswe�
�G 2��8�M���G2����7<���TM�u�' �*�_"�����:��!��}���8R�=���u��;
�G-򝅩�>��B�1��j�o,
��)���M���w4&�Z�sE���C�ʹU�6��Q�|y���I�����F����*�� X:��'-ڝ�)�^�x@"��
�G�����8b������A�0wT&�Z�;CM���G#r���?P�q�dQ�|Oa�(G^��u��5��3.��o�
����-��I�v���
҇������Ń!��U��+0T?F�2���%�/K\7y֢���B걏4dkN�t|'aڨ[>�Ps|%��[F�r�e��#Y�:�S�Ɂ��n�,V���N�4Hv���z�ciή�|_a�(B���t~�`z�#>��j�/�
��ҋ�I���6�����Y����E������,T�I�6��ք^�xI�ɶ�����Rڽ�1�T` (��g&���+ @0��A�0e�+_H86���ͼU��4@p�{Ccq��N�tWg~��8 �
���#0�
�G2���/:�)��՘_*�2���:�M�u��-���)���F���5��'.��k)�^�8Uҿ�	��BƱ��m�m������w#f����CD1�TE�s %�Lu§��s%��GKr�e��6�V�>�\9����ɩ����LP5�΀T`?h.�e���N�4_Wx>��y�"�ف��k/F�2�Վ�$Xz�c'iڮ�<[Q�|Ca��DN�tu�g
��?"��
����m�-������:Ɠ�͍���;<Q��U�� @0
�/B�1��~�`X(:��(mޭ�}���8p�
�E�s5���Hb������F�2���*�H6����ɌV��� W@>�t'Eڳ5�W~��dx+b�i�.��@i�.�SI�����b�)����O�7GV����G42�U��<p�KE�s����La��G��u�g9��-��I�6���^�x]⹉�����'���%�[0;TM�5�&���koGl2�ս�1�~�`d(+^�xh"���j��Lu��J�7%֛�HOv�&�Zƻ�M���9ѭ�}���pV�>�PC|1��H_v�&�ū?M�5�)Ξ�h_n�,r�婋>�PJ�71֔^�xL"�ٷ���Bʱ�4n�ln��}�᥈{&�Z���A��lD-�]�������a�(iޮ�|Z��8CR���A�pv�&�Z�{�LI���҂ݡ��j��1��P_|8!Ҙ]���2��#D�J����呋,g]깏2��O't�K:�S6����hSn��q��e�k'oZ�;=�Q��i���LH5����a��o�}�a��lN��}�a��y���y�"�Y����
��R������s%���N�t[g{j�o9��͕��/<��V��� X :� 
���+!�XX:��3-�ݟ�
�� b�)��B����y�b⩉���J�7V���K 7X���$E�se�koN�4}�a��h~��|x!�I���6���Y�z��I�������]���2�U�? 
��#�ͪտ0�B�1�Tgj�/8�ͦպ�3ʏ$�Dksoe�+
�E�3*��/
��&Қݫ�J�7�N��HGv�����3�ͯ�1�SO}�!�Xb���>��G2�զ�:���%�[.�\sy���	�F��u��/
�)Ѩ\~��r�%��.�\Oy�"�Y���
�ŷ6����(W^��pr�%�[3{U�	��ց��hH.��v�����W~� f�*�(�Ha��F���u�',��)�^�Lr��6�V�ɰV�>�PR�=�Ѵ\wy����`e�+�Dh3n��o
���%��,[]�y�b��N�J�w����aƨR���q�$xb�i�n��C=�ф\cy���ɔV�~� U�?�,]¹���u��%��'+Z�{(#^��j¯�q��S}�a��m���}�!�Xv���:���ɕ��.�U����\y���I�6�����X_z�#2�ժ�?
�%�Lu�'��"�Y���3
��/�
�ž�0]�9�R�=���l{m�m��ͺճ5����dKkwof�*��� j�/ 	ʆ�"ޙ�j�<�LQ��G�E�38ҏ�	�F�r��-�]�������� v�&��+OH46�V��pU�?P|���Pr�%��4[W{~�`y�"Ι�j�o,�����W
���c )�ڈ[&�Z�{�C	���R�}�ᩈ~�J�7����|H!��F��5�/N�4i�nެX}���8aҨ]���r�%�["�Y�z��	Ѣ�y���ɏ��DWs~��{#F���ŏ$
�E�s+e�k/J�7)֞��XN��s7e֫�H@6���DR�}��v����Ƀ���TV�~� D3J��/�����d\+y�b�)���(O^�8wR����u�g�O%�KB�q��v�f�j��L	���ҍ����>�PE�3��_8�ͣ��2��O(4�Hn��v�����g*��&�ڋ'KZ�{6�V����Q�<l��M���<���P}�!��`Z�;>�Pm�-�ݠY�:���=�Ѭ\}���a��n��@}�!�cJ��>ƐR�=�ѥ�{)�^��V¾Ѱ\t9�Rʽ�1��|oa�(M޵�w*��:���e�k-�]�9����I���F²ѵ�w)���W��pcd)�^�xT"�Y�:�Mµ��,v�����J�w$&�Z�{cD)�^��S����tl'mڭ�=�Q�|p!�KJ�w6�����Q��S��A�0l-�]�9�R�=�Ѡ\x9�ɭ�����Pq�$A�p[d;kSo}�!��e��+?_P8<�ͬU��1�`h.�\a��Bα�togl*��=���%�F�r⥉�&�Z��M���G,2�թ�>�N�4e�k�H|6���^¸Q��u��4J�w.��z����V�~��Y�:�
��
����=�Ѳ�u��*ʟ(��hcn��~��U�?&��
�E��-�ݷ����ʂ�!��hj��<|��HU�����@m�-��I����Œ�-�ݩ����O4WA��@t0'T�K07T�N�4DsN��{cB���pSd=�Q�|d!�XOz�#7Yֺ��Eʳ5Ηn�ld-�]�y�"�Y�z��Iƶ��݆٢����A�pd$+[_{x#b����@p$[A�pCd1�TOt 'X��3'Uڿ0TB�1�r�e�+;_Sx=⑉�f����d+E�s%ʛ+N�th'n��k=�Q�<e��OI�6�VҾݰY�:�S���lcm��ͤU�3`��cCi���LSu����g *�*�&��
�G
��5��9���m��M�5��5��<n��lM����%��9�R�}�!�x
��9���������`r�%��0kT/\ 9�ڍ�%�[?{P#|���W���dD+s_e�+�A�0~� oX,:��)���N�O7t�N��C7q֤^�xCb��N�tF�r���;!�X]���2�Ո_&���C:��4]�y���y���y�b�i���<J��,F��酎�$I�v�f�j�olm�m��������twgf���?   �� U�?����U��/  	�����j�/	�����ݘY���3 �E��E�3��F�2�U��&��I¶Ѷ�v�����N�tggj��?<�U�� 
��,��Y�:�
�ŕ�/-��ɪ���P����Pc|)���XV���0E�3U�?��M�u��,J��)����I���v�f�jޯ|
��8R������q�dv�f�j�/	����͙���?���T?E�3����DX3z��/	����ћkI�v�&���J�w"������A��U�?#P�
��R�=�ѻsI����Bޱ�tj�o:�=�ѕ�o)���U��.�D	�F�����)���XM���7!֘^�O2��O6��NƴR�}����y��Ṉr楊�'Z�� CX1��C/q�$Y�z�ci�n�l^��}����xr����2�U��# �
�����z�#�����Hgv���:�
���/�Y����ɐV�>��U�?)��Yƺ���ɣ����Q�|h!�Lj��7���I�v�&�Z�;�K-�]��������!��fڪ�?P|a¨Q��pq�$K[w{f�j�����o,�ɓ��͔U�< �Z��#Y���C1��V�~� Z�;*�_-������z£��r��(^��a��u��0z�#/Y�:�����J�v���
��ҎݤY�z�c����\Sy�����f�*���*�#H����ʍ�%��<kQ�|L!��G��5�W:��0m�-�]�9���m�-�]�������,b�驎��@Kp7d�N�t@'p�;GSr�屋4gWj��0|!�XT:�S0=��Lh5�n��c
�Ŏ�$]�y�b�i�n�,K]�y���������g���$@pdkB�q�$q�d[k{ocl)��͘U��?0E�3U��� J�� F�2ꕏ/$I�v�fު��8R�����tr�e��3?U�?	�����j��#���Ή�f�j�/��
�G򉅦�:����ٔZ�{#E����Mε�w/f�*���Z�{!�XI���6���^��Z»�Lu��
��!��y���9��
���:��]ƹ��텍�%��2�U�+`h.��b����TKw`&��� g@*�4F���u�g'j��+<Q�<V���@M�5�#N��j�o�
�ű�4m�m���}���xt"�Y���3���V��� I�6����Z�{�I����������f��� ʃ!ΘTj�o0,�I�6�V�>��_8	҆ݢٹ����C$1�T[{`#h��g�$CKq�dF�r�e�+ X:��"�ٍ��?GP2���4TN�4xb���~�`Ch1�Lou�'
څ�#+Y�z�#��*�_�r����9�R���A��z�#Yºѳu��ʎ�$^�xkb�i�.��DY�z��	��Ւ�-����&��GM򵅷#6�����T
�G02��O<4�L^��w����s%ƛ�M�u�';Z�{-�]�����уa��Vξ�p_d8+R�}�!��pj�/;\y��Չ�&�΋gOj�/7\����E�s(%ޛkJ�w<&���[
�E�s!��K�K6�V����R�=�Q��}��Hx6������Q��`A�0N�4oWl>��}�!��~ڠ[8;R�}�Ὀq��z�ci���L\5��ށ�`j�/>�i�.��_�
��y���	�F���E��.��G�ŧ:��%��)�^�xOb�)�^��F�ŵ�7-֝��N��@wp&��KwA�J�7V���Ht6�V���0Q�<_Q�<B��D}�a��c��~�`]�9���m�m�m���=�ѷv��������df�j�o , �	������o,,�ə����T�C 1�P|!�XQ��C1��D_sx%�	�F�r�%�,]�y�����嵋7'V���0OT4?WP>�q�$U�`hn��a��q��d{kcoi�.��U��*������f���
�G!�E��?5���f�j���
���M����2����"������ci��Ռ_%��A�pz�#;Y�z������
އb���>��C,1��Y�z�#��j�o�	����-�]���r��K#wY���΃a�hT.�\p9��M�u��<z��,I��ن���	�F�r�e�+/_\89Ғݭ����pd�@Op4$[N�tsge�?D3L���A�0{T#Y�:����K/w\&�����C+q�dX+z�c()ޞ�hZ��<sQ��K�@F�2��O"��J�������m�����A��tD'sZ��;SA��A�0cT)�^�8P�
�ŴS7}֡��hB���tq�dJ�w?f�*�
���.��HY�����͓��=��L|5��^��b򩅾�0I�6�V�>ڐ[,;]�y��鉎��J�wf���`h���`q�$N�tkgoj�/=���j��ƃ�͈U��:�
�E��,E�����	Ά�b�i�.�O)��HR�����v�f��ُ�GGr����73V��� L 5��e�k�LL5����a��z�� y�"��
��҄]�y���Ʌ��.��V����[;Lu����'$�K+w_f�*��>��`\(9ޒ�m���=�Q�<t�LJ��7����He���B�1�lm�-�]�����xcb����TD?sP%��@Wp>�{L#u��ʋ'N��k7oV�>��A�0i�.�\X9���-�ݬY���a�hQ�Lq��Gr�e��9�R�=��Ly���	���͹���5�%ΛkOot,']ڹ�2�U�$ Xz�c"�پ��[;CSq��A�pgd*�_?x"����N��`Gh2���o1�M�u�'/Z�;)�^��Y���uƧ���%��8[R�}�a��w��z�c	�����]�y�"���j�/���ъ�g��'�K$7[V�~�`E�3��ol
�ō�%��=�Q�|a�(H��v������`V�>��@l0-��I�6���n�,\�ɂ���hV���pA�0KT7V�>�B�1��{cH)����Rν�q�d|+a�hX.��s)���WJ��0v�&�Z�;�O�	�F�ɵ��.ƜR�����P{|#a��ZλsOe�+_B�1��u�g<*��,X���&���[�N�tE�s
��;�M����1��y�b�)���XH:��6��͞ը_>�r�%��;SK}�a��b���~� H6���.ʜW)���hP.�q��V�~�`^�8~��m�-�����>��F�2�Օ�/(��f֪��@
�4�A��|t!�XJ��36����Uƿ�
��C9���]�y�������z�#����Ot'F���5�W$>�Pk|/a�(Y޺�s��;SN��q�db�i�n�,D�I������ў�hY��s��OB�1�Tv�f�*�H
����"�ٖ���[E�se��OL45�W��pf�*�_x�I�6�Ѥ\{y�b�����L_u�'��� X :�*��%�*�_'x��9�R���1��x_b�)����G>��u�'=ڑ�,k]�y�"�ً�K
�G6�����<R���A��q�$c[i�n�lQ��M���G82����=���tU�
�8����}�!��u��?:�,
�ř�*��
���?!�\
��2ҕ��)���DV�~��G2����9��͋�O:�7Mֵ��(F���u��$z�c+i�n�,Z��)�^��HB����v�fҪݿ�
�B����xwb����� E�3��D
�E��#����WI���v�&����K�Hv�������͜U��>�P<��Q��V���@\09��M�5��?.�l	��͒խ�=���pe�+_Gx2����2��� T?J�7,���N�tL'uڧ:�S'}ڡ�8kR�}�!��tZ�{:�S9�����i�.��A��j�/\
�ł�!��i���<OQ�<GQ�E��4E�s��{�N��B�q��m�m�m��
����6������XZ��33U��  ��� f�*����ቈf��� �`h�L`5���dcki�n�,U���
�����y�"晊��
�#B���`
���$a�h[n�lsm��
�E��35���f����	�����n�,H������ɗ��dU�`(^��`B�1��pod,+]�y�"ꙏ*�Hv����s���COq�$G[r�e�k5�W>��c)����^ڸ[2�U�5���b�i����J���恊�g*��"����gj�o"����n�la��M���w;f�j��
���;�L]���⁉�f�*�~��c)ƞ��]���r�e�k!�XL:��7։���Jηv�f�*�_x��y�b����Hov�&����kL/u�'ڊ�'Z�{'cZ��>�PQ�<A��\D9�R�����}�!�}ʡ�8n��m����e�k6�V�>��P\<9���]������`���`Sh=le��
�E�3;U��	����n��b�過�dH+v�f�*Οhn�,c]�����Q�|ga�O>�wL&����B�q��g;j�o-��ɥ��.�\Q��B��Dl3m��
���0a�(_^�8r����=�Q��w�J�7����I�v�fʪ�?�l������`}�!��dj�o?l-��ɯ���PS|=�ш\f�����/A�0Y�:�S=ʑ�,n��i���K%�[�B�q��ci�nҬ]�����a�hb���~��DH3v���
��{E�s	����M���w>��z�#
�Ś�+�I�6��.�_I�6Ѯ�|Y���C���TGr�%�2�U�:�8
҅��)����E��+5�W>��g,*��)��O&��K�B����b�i���M���G7r����<CQ��DA�pE�3U��
���5��8^��m�����1��v�f�*��
��"♉���
����{#L������e�k3oU�?
��)���X\:��2�ՙ�*��f�j��L����c�Z��`�0j�G��~��~�ԃj��7��G��)&ȚX���0�����T�5��xA#��T
f��۰Y�K��.�E\V�ׅS����ej��%�S'��}$m�p�l�
��@�.aۅ�����O��ϻ�{�/	:78C��~gGR���v"h�1�CRp�jt�OF!8�ֱ�:����D>�h_V�I�i��t�-��
ܦ���i����v�X�"?SN׼^0��燄�|(�/��
z~�fB�ɝ�фd[SCE��.�j A8�&�"��0Gl
��86���K� N��J&�?d�c��|m�բ����ٟS�f�m6��x��:�����[�u���s�}Kki�&��#�����W[7��7{��HH"~�}P�!7�p�,�8Wj��ֳe����� S�x��5�\x3v]�o���a��^� sxڱ�C��-�Ֆ% ��#�F��[0���Α������c�5��Ru¥������>��T�a
�B8t+0zS>���/�O�h�4�M�{�
����P���\-@��\sA��a��
O1�S�fޠL�>3)VR��=���Oё�E~-�e����;�(���4�2�m���>�hM֍�݀�X*ߘ��!�^[<����k��}mpJT��nwW�ÃÐT���d��!�v��tLM���Ĵ��~�sr�ݑ��S���f�`l�7?3�>k�g�,\%��(q�r��e� Y�P�y�O�,�i���st@�m�]����Q[|Y�����6� �F)�TJwr�����O>L��SJ2�7V^�sPp�l�J��\>��Xv�ʖ�1��^B�I��<giҖ����`E/.�,��̐�s��'�=TE�n6�f&�)#�[Ѹ4����lkU�G&����#m �
��A�]���XJ��K�}���'�Q\�w�h����6i���f����3m�U�	I��MAm3�Y�݂�i��#a��~�gr���������V.�&�b�ѨdF�J��uiv��+t����:�+.�Ih�c���,f���%��	�L��v)�p��j�4�e�b�r)�F��N�_c�1�� Y/�ΚO�h�K%�c,��?z	�S����*O�u�/ڜ�z��K��Ŷ��|~�� ���&~W�٫"�a��G
�-K�u��Ԯ^�0}ҽ��N�aIM�ͤm�U��굷�V:����?��:*���U�:��
�}������?N�z�橓lx�E|�X���I5��f�Rꅷ�|M�͢큵�O�5��\�} Ql�>������q x9ڪ�1��{�{#[a�P`�J�v�%��Ur����ݽ���^� b���u"j<)���B�Ի]�$,	�*,��Z�ر9h5֯&�"�a�PN�C.��̃����6ǂw���K$c|��b�Q�oX�E?�Y�-��x�7D������e[g&1f�#@�w)~�P��ԕ�RX��<
FF���/&�"�a��F�
�:o�f���Y���٬b�ѫ-\N`��l7U�4Z�C	�1�/J�c�N��g-ҥ�������RÉKgD���dfF#'i̅ź�
��a�Y�ﺊq���x�g&�٤쎇�5Q�'����M��2�ϩΔ�d��e�-���Z��|yu��/�Mb�<Oi������U��S���;#ka�Pf�W� ��h*��¶����S��Zb���TGW��PI�}��J{�3����
Ȋ���Ї$���X��<�*n�J�O�u�ɷ���'ӑ2���Q_,����`˦V���0\�j��x��w��i�V���j��:�f�,���:0����m�Պ�2�-�%��P��L,�YN��j��-�҈6��{Ye~��:&I�f�(��D9��e06T����7
I�N�L��S��s)����M�_̩˫�a�1'sb�ё�Tjc��6t1�l`�7+!��ƃ�x��vg�I���}˘��9�X`���Y�_��P4/{'T ݀o�7
qH7p
&T���t;_k@H6��	.�,AE#,P�O�
��p?\(�rʝ��4, \�*�i?���O7}R�E��{8+�B�����c��/
��5�e /ڑV�@o� ���
A�W���ڵ��8y��>��O6�.��a��'�}�Y������=�������j4��4R��.Wr�,�{�F�J�?|(��ͽ���ݘ_6:E�i~2z0,;e�S7E�4_o@7~����1q^ �	�b����>m8)P�����*4k�%
_f_�_, %�#:�� wq��~&(��9�j�W/F�L�w(�h���������v���MYP�1�lGUʇ/�|B>�ݗ�2�m���N�O}������E�09:ҽr�VX�3HIE�X���/�!	�G��ț���%����{
�C��&�b�Q��LkM���׏׺��U����rRN59_�ݏ!� Q�4\_�kr�~��$���ȏN�|o��9�\M|N�f秈w���3-���<G����3	�Z_�]7��"T���>��m����4��6��W�bx:��m�����\'Ꙡ�]�A��Vކ�Z�<9�귴}��6���2�#<!��v��0y���?=�)�卍�'���c�c���>cb�k����<w�EY�<��O	�j��<f�����&׃�,�P�[4oy��|2�,*�OC�����.N��Jɘٛ �����c6b��lB��.�IP�1P�Y��9�*��l¯h��׬�����[��V{6bd��E���{{s	����ϰ>|g]h�� ���6DK�AJ��]���?7h.��V�F����>�&q4�U����QY}���8l���<qI�pP�o_�*��z0����-�剳��m�ٶM��7^��S����
��!�P[�^΀lX·)�����C�m�U��Z�"Y���Y����r��1��\bC=���޵a��b��K��M
�*�ޘ�ag$ll#`�S0oA!r�$#ca��ddV&��p

M�!� W`�:�+'5'����E�덜c5k�p*q�39�GI�le��'%�1��Xul�g�n�a���A�P�������������//4e@0"��`z#d�P*3Dy�j�NcSQ��k+WgF����<=�!�`\�eR@�=?����l1��h:���v,2���:�#ԇU�)8D�ג����&�6�H��ieffM�
�����:�+hh #ݢ�+�Ĉjw
u�-m�9$5�o1�,geғ%��1��?��$l� ���H�)��i���&�����I����	R��j#G|��a2�O��4CoI��|r�ݒᕰWￎ�}�!=d�8e�)G��+'q�q��Ta�Pj�6\�^��m���γ%V���坳��]�A�I
��HPK����޲�\�4�0v���k<i�ձ��)���P�%D�mb��HIΎ�\u��(`&�I��3.�]��L�f�tF����h4銂��J�1#�^k"*o[���`gP�5�oT5�o*�uE-伤�\gA҈e��U�$W�6,�z��-�e��e��rԺ�>����r�]�A��\^��Xh���)B�a�v��#�J��)<T(h{�����DuS-�K�m+75�X�e��ɻ�?k=}�8ѕ���G�{.��6��kD�6����wg�7��Gپ���[�(\�䣚*N�J��	�>��k?�C��L�R慲�
�}�٘0����
d܎��xaڐcI<�YT�rP�9�j�W*ɣ^��<��2�R�
JKH�z���=/0����B�ɵ��K-h�jJ��\;A�HwN����'��;���W��f����2���)�nxg��|��L����R�Ʀbtut}l�� �}=��MbጋvmT��>i�V���Z�� 4�_�p���X^��Y�
ݹ�F�k��"� !QKh](�Q�KXv<j���8��BZG�c1��du�_r�mln��!�I�x����#!�f��Δ�'��&�"@OH�
����!;�|t-e�i��W$�z��(cu vực nhân viên bán hàng",

    admin:
        "Khu vực quản trị viên"

};


function openWorkspace(
    role = "customer",
    page = "overview"
) {

    if (currentAccount) {

        role =
            [
                "customer",
                "staff",
                "admin"
            ].includes(
                currentAccount.role
            )
                ? currentAccount.role
                : "customer";

    }


    if (role === "customer") {

        document.body.classList.remove(
            "account-mode"
        );


        const workspace =
            document.getElementById(
                "workspace"
            );


        if (workspace) {

            workspace.hidden =
                true;

        }


        document.body.classList.add(
            "customer-mode"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        return;

    }


    document.body.classList.remove(
        "customer-mode"
    );


    workspaceRole =
        role;


    workspacePage =
        page;


    document.body.classList.add(
        "account-mode"
    );


    const workspace =
        document.getElementById(
            "workspace"
        );


    if (workspace) {

        workspace.hidden =
            false;

    }


    renderWorkspace();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function closeWorkspace() {

    document.body.classList.remove(
        "account-mode"
    );


    const workspace =
        document.getElementById(
            "workspace"
        );


    if (workspace) {

        workspace.hidden =
            true;

    }


    document
        .getElementById(
            "home"
        )
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


function showCustomerVouchers() {

    document
        .getElementById(
            "customerPerks"
        )
        ?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}


function applyHomepageVoucher(code) {

    const voucher =
        voucherData.find(
            item =>
                item.code === code
        );


    appliedVoucher =
        voucher ||
        null;


    showToast(
        voucher
            ? `Đã lưu voucher ${code}. Voucher sẽ được kiểm tra theo điều kiện đơn hàng.`
            : "Không tìm thấy voucher"
    );

}


function switchWorkspaceRole(role) {

    if (!currentAccount) {

        openAccount();

        return;

    }


    openWorkspace(
        currentAccount.role,
        "overview"
    );

}


function renderWorkspace() {

    const nav =
        document.getElementById(
            "workspaceNav"
        );


    const content =
        document.getElementById(
            "workspaceContent"
        );


    if (!nav || !content) {
        return;
    }


    nav.innerHTML =
        workspaceMenus[
            workspaceRole
        ]
            .map(
                ([
                    page,
                    label,
                    icon
                ]) =>
                    `
                    <button
                        class="${workspacePage === page
                        ? "active"
                        : ""
                    }"
                        onclick="openWorkspace('${workspaceRole}','${page}')"
                    >

                        <i
                            class="fa-solid ${icon}"
                        ></i>

                        ${label}

                    </button>
                    `
            )
            .join("");


    document.getElementById(
        "workspaceRoleLabel"
    ).textContent =
        roleLabels[
        workspaceRole
        ];


    document.getElementById(
        "roleSwitcher"
    ).innerHTML = `

        <span class="role-badge">

            <i class="fa-solid fa-shield-halved"></i>

            ${roleLabels[workspaceRole]}

        </span>

        <button
            class="workspace-btn light"
            onclick="logoutAccount()"
        >
            ĐĂNG XUẤT
        </button>

    `;


    const pages = {

        overview:
            renderOverview,

        collections:
            renderCollections,

        profile:
            renderProfile,

        orders:
            renderOrders,

        vouchers:
            renderVouchers,

        cart:
            renderWorkspaceCart,

        inventory:
            renderInventory,

        customers:
            renderCustomers,

        consult:
            renderConsult,

        chat:
            renderStaffChat,

        products:
            renderProductsAdmin,

        staff:
            renderStaffAdmin,

        reports:
            renderReports,

        permissions:
            renderPermissions

    };


    content.innerHTML =
        (
            pages[
            workspacePage
            ] ||
            renderOverview
        )();


    document.getElementById(
        "workspaceTitle"
    ).textContent =
        workspaceMenus[
            workspaceRole
        ].find(
            item =>
                item[0] ===
                workspacePage
        )?.[1] ||
        "Tổng quan";

}


function statCards(items) {

    return `

        <div class="dashboard-grid">

            ${items
            .map(
                item =>
                    `

                        <div class="stat-card">

                            <span>
                                ${item[0]}
                            </span>

                            <strong>
                                ${item[1]}
                            </strong>

                            <small>
                                ${item[2]}
                            </small>

                        </div>

                        `
            )
            .join("")}

        </div>

    `;

}


function renderOverview() {

    if (
        workspaceRole ===
        "customer"
    ) {

        return (

            statCards([

                [
                    "Điểm thành viên",
                    "1.280",
                    "+120 tháng này"
                ],

                [
                    "Voucher khả dụng",
                    "06",
                    "Có mã sắp hết hạn"
                ],

                [
                    "Đơn đang giao",
                    "02",
                    "Dự kiến hôm nay"
                ],

                [
                    "Hạng thành viên",
                    "GOLD",
                    "Còn 720 điểm lên Diamond"
                ]

            ])

            +

            `

            <div class="workspace-card">

                <h3>
                    Chào ${currentAccount?.name || "bạn"}
                </h3>

                <p>
                    Khám phá bộ sưu tập mới,
                    áp voucher khi thanh toán
                    và theo dõi toàn bộ hành trình
                    đơn hàng tại đây.
                </p>

                <div class="workspace-actions">

                    <button
                        class="workspace-btn"
                        onclick="openWorkspace('customer','vouchers')"
                    >
                        Xem voucher
                    </button>

                    <button
                        class="workspace-btn light"
                        onclick="goToCollection()"
                    >
                        Mua sắm ngay
                    </button>

                </div>

            </div>

            `

        );

    }


    if (
        workspaceRole ===
        "staff"
    ) {

        return (

            statCards([

                [
                    "Đơn cần chốt",
                    "18",
                    "+5 hôm nay"
                ],

                [
                    "Chat đang mở",
                    "07",
                    "2 tin chưa trả lời"
                ],

                [
                    "Tồn kho cảnh báo",
                    "04",
                    "Cần phối hợp kho"
                ],

                [
                    "Doanh số hôm nay",
                    "24,8M",
                    "+18,4%"
                ]

            ])

            +

            `

            <div class="workspace-card">

                <h3>
                    Ca làm việc hôm nay
                </h3>

                <p>
                    Ưu tiên trả lời chat,
                    xác nhận đơn COD và cập nhật
                    trạng thái giao hàng để khách
                    luôn được thông báo đúng lúc.
                </p>

                <div class="workspace-actions">

                    <button
                        class="workspace-btn"
                        onclick="openWorkspace('staff','chat')"
                    >
                        Mở live chat
                    </button>

                    <button
                        class="workspace-btn light"
                        onclick="openWorkspace('staff','orders')"
                    >
                        Xem đơn cần xử lý
                    </button>

                </div>

            </div>

            `

        );

    }


    return (

        statCards([

            [
                "Doanh thu tháng",
                "428,6M",
                "+12,8%"
            ],

            [
                "Đơn hàng",
                "326",
                "+24 đơn"
            ],

            [
                "Khách hàng",
                "2.841",
                "+8,6%"
            ],

            [
                "Tỷ lệ chuyển đổi",
                "4,82%",
                "+0,7%"
            ]

        ])

        +

        `

        <div class="workspace-card">

            <h3>
                Hiệu suất kinh doanh
            </h3>

            <p>
                Doanh thu đang tăng ổn định
                nhờ nhóm sản phẩm Shoulder
                và chương trình thành viên GOLD.
                Dữ liệu trên là dữ liệu mẫu
                cho giao diện frontend.
            </p>

            <div class="workspace-actions">

                <button
                    class="workspace-btn"
                    onclick="openWorkspace('admin','reports')"
                >
                    Mở báo cáo
                </button>

                <button
                    class="workspace-btn light"
                    onclick="openWorkspace('admin','products')"
                >
                    Quản lý sản phẩm
                </button>

            </div>

        </div>

        `

    );

}


function renderProfile() {

    return `

        <div class="workspace-card">

            <h3>
                Thông tin tài khoản
            </h3>

            <div class="profile-grid">

                <div class="profile-field">

                    <label>
                        HỌ VÀ TÊN
                    </label>

                    <input
                        value="${currentAccount?.name ||
        "Nguyễn Minh Anh"
        }"
                    >

                </div>


                <div class="profile-field">

                    <label>
                        EMAIL
                    </label>

                    <input
                        value="${currentAccount?.email ||
        "minhanh@email.com"
        }"
                    >

                </div>


                <div class="profile-field">

                    <label>
                        SỐ ĐIỆN THOẠI
                    </label>

                    <input
                        value="${currentAccount?.phone ||
        "0909123456"
        }"
                    >

                </div>


                <div class="profile-field">

                    <label>
                        NGÀY SINH
                    </label>

                    <input
                        type="date"
                        value="1999-08-20"
                    >

                </div>

            </div>


            <div
                class="workspace-actions"
                style="margin-top:18px"
            >

                <button
                    class="workspace-btn"
                    onclick="showToast('Đã lưu thông tin hồ sơ')"
                >
                    LƯU THAY ĐỔI
                </button>

                <button
                    class="workspace-btn light"
                    onclick="logoutAccount()"
                >
                    ĐĂNG XUẤT
                </button>

            </div>

        </div>


        <div class="workspace-card">

            <h3>
                Địa chỉ nhận hàng
            </h3>

            <p>
                <strong>Nhà riêng</strong>
                · 28 Nguyễn Huệ,
                Phường Bến Nghé,
                Quận 1,
                TP. Hồ Chí Minh
            </p>

            <button
                class="workspace-btn light"
                onclick="showToast('Đã mở trình chỉnh sửa địa chỉ')"
            >
                + THÊM ĐỊA CHỈ
            </button>

        </div>

    `;

}


function renderCollections() {

    const collections = [

        {
            name:
                "Thu Đông 2026",

            note:
                "Chất liệu da mềm, gam màu rượu vang và nâu hạt dẻ cho những ngày se lạnh.",

            image:
                products[0].image,

            category:
                "Shoulder"
        },

        {
            name:
                "Summer Escape",

            note:
                "Nhẹ tênh, màu sáng và đủ rộng cho những chuyến đi biển cuối tuần.",

            image:
                products[3].image,

            category:
                "Tote"
        },

        {
            name:
                "Work Edit",

            note:
                "Những phom túi chỉn chu cho lịch trình bận rộn và phong thái chuyên nghiệp.",

            image:
                products[2].image,

            category:
                "Office"
        },

        {
            name:
                "Weekend Mini",

            note:
                "Những mẫu mini gọn nhẹ cho buổi hẹn cà phê và những cuộc dạo phố ngẫu hứng.",

            image:
                products[1].image,

            category:
                "Mini"
        },

        {
            name:
                "Timeless Icons",

            note:
                "Các thiết kế bán chạy có thể đồng hành cùng bạn qua nhiều mùa.",

            image:
                products[4].image,

            category:
                "Shoulder"
        }

    ];


    return `

        <div class="voucher-grid">

            ${collections
            .map(
                collection =>
                    `

                        <div class="workspace-card">

                            <img
                               src="${getMvcImagePath(collection.image)}"
                                alt="${collection.name}"
                                style="
                                    width:100%;
                                    height:180px;
                                    object-fit:cover;
                                    margin-bottom:15px
                                "
                            >

                            <h3>
                                ${collection.name}
                            </h3>

                            <p>
                                ${collection.note}
                            </p>

                            <button
                                class="workspace-btn"
                                onclick="showCollection('${collection.category}')"
                            >
                                XEM BỘ SƯU TẬP
                            </button>

                        </div>

                        `
            )
            .join("")}

        </div>

    `;

}


function showCollection(category) {

    closeWorkspace();


    document
        .getElementById(
            "collection"
        )
        ?.scrollIntoView({
            behavior: "smooth"
        });


    const button =
        document.querySelector(
            `.filter button[onclick*="${category}"]`
        );


    if (button) {

        filterProducts(
            category,
            button
        );

    }


    showToast(
        "Đang xem bộ sưu tập " +
        category
    );

}


function renderOrders() {

    return `

        <div class="workspace-card">

            <h3>
                Lịch sử đơn hàng
            </h3>

            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Mã đơn
                        </th>

                        <th>
                            Ngày đặt
                        </th>

                        <th>
                            Sản phẩm
                        </th>

                        <th>
                            Tổng tiền
                        </th>

                        <th>
                            Trạng thái
                        </th>

                        <th></th>

                    </tr>

                </thead>


                <tbody>

                    <tr>

                        <td>
                            #MS-260924
                        </td>

                        <td>
                            24/09/2026
                        </td>

                        <td>
                            Ava Shoulder Bag
                        </td>

                        <td>
                            690.000đ
                        </td>

                        <td>
                            <span class="status">
                                Đang giao
                            </span>
                        </td>

                        <td>

                            <button
                                class="workspace-btn light"
                                onclick="showToast('Đã mở chi tiết đơn #MS-260924')"
                            >
                                CHI TIẾT
                            </button>

                        </td>

                    </tr>
                    <tr>
                        <td>
                            #MS-260815
                        </td>

                        <td>
                            15/08/2026
                        </td>

                        <td>
                            Léa Mini Bag
                        </td>

                        <td>
                            490.000đ
                        </td>

                        <td>
                            <span class="status">
                                Hoàn tất
                            </span>
                        </td>

                        <td>

                            <button
                                class="workspace-btn light"
                                onclick="showToast('Đã gửi yêu cầu đổi trả')"
                            >
                                ĐỔI TRẢ
                            </button>

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


/* =====================================================
   VOUCHER
===================================================== */

const voucherData = [

    {
        code:
            "WELCOME50",

        value:
            "Giảm 50.000đ",

        condition:
            "Đơn từ 500.000đ",

        min:
            500000,

        discount:
            50000
    },

    {
        code:
            "GOLD15",

        value:
            "Giảm 15% tối đa 150.000đ",

        condition:
            "Dành cho thành viên GOLD",

        min:
            0,

        discount:
            .15
    },

    {
        code:
            "FREESHIP",

        value:
            "Miễn phí vận chuyển",

        condition:
            "Đơn từ 999.000đ",

        min:
            999000,

        discount:
            0
    }

];


function renderVouchers() {

    return `

        <div class="workspace-card">

            <h3>
                Voucher của bạn
            </h3>

            <div class="voucher-grid">

                ${voucherData
            .map(
                voucher =>
                    `

                            <div class="voucher-card">

                                <div>

                                    <strong>
                                        ${voucher.code}
                                    </strong>

                                    <p>
                                        ${voucher.value}
                                        <br>
                                        ${voucher.condition}
                                    </p>

                                </div>


                                <button
                                    class="workspace-btn"
                                    onclick="applyVoucher('${voucher.code}')"
                                >
                                    ${appliedVoucher?.code ===
                        voucher.code
                        ? "ĐÃ CHỌN"
                        : "ÁP DỤNG"
                    }
                                </button>

                            </div>

                            `
            )
            .join("")}

            </div>

        </div>


        <div class="workspace-card">

            <h3>
                Thành viên Maisoné
            </h3>

            <p>

                <strong>
                    GOLD · 1.280 điểm
                </strong>

                <br>

                Mỗi 10.000đ thanh toán nhận 1 điểm.
                Đổi 500 điểm lấy voucher 50.000đ.

            </p>


            <div class="workspace-actions">

                <button
                    class="workspace-btn"
                    onclick="showToast('Đã đổi 500 điểm lấy voucher 50.000đ')"
                >
                    ĐỔI ĐIỂM
                </button>

            </div>

        </div>

    `;

}


function applyVoucher(code) {

    const voucher =
        voucherData.find(
            item =>
                item.code === code
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    if (
        voucher.min &&
        total < voucher.min
    ) {

        showToast(
            `Đơn hàng cần từ ${formatPrice(voucher.min)} để dùng mã ${code}`
        );

        return;

    }


    appliedVoucher =
        voucher;


    renderWorkspace();


    showToast(
        `Đã áp dụng voucher ${code}`
    );

}


function renderWorkspaceCart() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const discount =
        appliedVoucher
            ? (
                appliedVoucher.discount < 1
                    ? Math.min(
                        total *
                        appliedVoucher.discount,
                        150000
                    )
                    : appliedVoucher.discount
            )
            : 0;


    return `

        <div class="workspace-card">

            <h3>
                Giỏ hàng hiện tại
            </h3>

            ${cart.length

            ?

            `

                    <table class="data-table">

                        <tbody>

                            ${cart
                .map(
                    item =>
                        `

                                        <tr>

                                            <td>
                                                ${item.name}
                                            </td>

                                            <td>
                                                ${item.quantity}
                                                x
                                                ${formatPrice(item.price)}
                                            </td>

                                            <td>
                                                ${formatPrice(
                            item.quantity *
                            item.price
                        )}
                                            </td>

                                        </tr>

                                        `
                )
                .join("")}

                        </tbody>

                    </table>


                    <div
                        style="
                            text-align:right;
                            margin-top:18px
                        "
                    >

                        <p>

                            Tạm tính:
                            <strong>
                                ${formatPrice(total)}
                            </strong>

                            <br>

                            Voucher:
                            <strong
                                style="color:var(--wine)"
                            >
                                -${formatPrice(discount)}
                            </strong>

                            <br>

                            <strong>
                                Tổng thanh toán:
                                ${formatPrice(
                    Math.max(
                        0,
                        total -
                        discount
                    )
                )}
                            </strong>

                        </p>


                        <button
                            class="workspace-btn"
                            onclick="checkout()"
                        >
                            ĐI ĐẾN THANH TOÁN
                        </button>

                    </div>

                    `

            :

            `

                    <p>
                        Giỏ hàng đang trống.
                        Hãy chọn một chiếc túi
                        cho câu chuyện tiếp theo
                        của bạn.
                    </p>

                    <button
                        class="workspace-btn"
                        onclick="goToCollection()"
                    >
                        KHÁM PHÁ SẢN PHẨM
                    </button>

                    `
        }

        </div>

    `;

}


/* =====================================================
   STAFF / ADMIN WORKSPACE
===================================================== */

function renderInventory() {

    return `

        <div class="workspace-card">

            <h3>
                Tồn kho sản phẩm
            </h3>

            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Sản phẩm
                        </th>

                        <th>
                            SKU
                        </th>

                        <th>
                            Đã bán
                        </th>

                        <th>
                            Tồn kho
                        </th>

                        <th>
                            Trạng thái
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${products
            .slice(0, 5)
            .map(
                (product, index) =>
                    `

                                <tr>

                                    <td>
                                        ${product.name}
                                    </td>

                                    <td>
                                        MS-${String(
                        product.id
                    ).padStart(
                        3,
                        "0"
                    )}
                                    </td>

                                    <td>
                                        ${62 + index * 17}
                                    </td>

                                    <td>
                                        ${index === 3
                        ? 4
                        : 18 +
                        index *
                        7
                    }
                                    </td>

                                    <td>

                                        <span
                                            class="status ${index === 3
                        ? "pending"
                        : ""
                    }"
                                        >
                                            ${index === 3
                        ? "Sắp hết"
                        : "Sẵn hàng"
                    }
                                        </span>

                                    </td>

                                </tr>

                                `
            )
            .join("")}

                </tbody>

            </table>

        </div>

    `;

}


function renderConsult() {

    return `

        <div class="workspace-card">

            <h3>
                Thư viện tư vấn sản phẩm
            </h3>

            <p>
                Nhân viên có thể mở nhanh
                câu chuyện, chất liệu, công năng
                và giá để tư vấn đúng nhu cầu của khách.
            </p>


            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Sản phẩm
                        </th>

                        <th>
                            Phù hợp
                        </th>

                        <th>
                            Giá
                        </th>

                        <th>
                            Tư vấn
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${products
            .slice(0, 6)
            .map(
                product =>
                    `

                                <tr>

                                    <td>

                                        <strong>
                                            ${product.name}
                                        </strong>

                                        <br>

                                        <small>
                                            ${product.description}
                                        </small>

                                    </td>


                                    <td>

                                        ${product.category ===
                        "Office"

                        ? "Đi làm, laptop"

                        : product.category ===
                            "Mini"

                            ? "Dạo phố, hẹn hò"

                            : "Hằng ngày"
                    }

                                    </td>


                                    <td>
                                        ${formatPrice(
                        product.price
                    )}
                                    </td>


                                    <td>

                                        <button
                                            class="workspace-btn"
                                            onclick="openProduct(${product.id});showToast('Đã mở thông tin tư vấn ${product.name}')"
                                        >
                                            XEM CHI TIẾT
                                        </button>

                                    </td>

                                </tr>

                                `
            )
            .join("")}

                </tbody>

            </table>

        </div>

    `;

}


function renderCustomers() {

    return `

        <div class="workspace-card">

            <h3>
                Danh sách khách hàng
            </h3>


            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Khách hàng
                        </th>

                        <th>
                            Hạng
                        </th>

                        <th>
                            Đơn hàng
                        </th>

                        <th>
                            Chi tiêu
                        </th>

                        <th>
                            Chăm sóc
                        </th>

                    </tr>

                </thead>


                <tbody>

                    <tr>

                        <td>

                            Nguyễn Minh Anh

                            <br>

                            <small>
                                minhanh@email.com
                            </small>

                        </td>

                        <td>
                            GOLD
                        </td>

                        <td>
                            12
                        </td>

                        <td>
                            18.420.000đ
                        </td>

                        <td>

                            <button
                                class="workspace-btn light"
                                onclick="toggleChat()"
                            >
                                NHẮN TIN
                            </button>

                        </td>

                    </tr>


                    <tr>

                        <td>

                            Trần Ngọc Mai

                            <br>

                            <small>
                                mai@email.com
                            </small>

                        </td>

                        <td>
                            SILVER
                        </td>

                        <td>
                            5
                        </td>

                        <td>
                            5.890.000đ
                        </td>

                        <td>

                            <button
                                class="workspace-btn light"
                                onclick="toggleChat()"
                            >
                                NHẮN TIN
                            </button>

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


function renderStaffChat() {

    return `

        <div class="workspace-card">

            <h3>
                Hàng đợi trò chuyện
            </h3>

            <p>
                Live chat giúp tư vấn mẫu,
                giải thích tính năng,
                chính sách khuyến mãi và hỗ trợ
                khiếu nại, đổi trả.
            </p>


            <table class="data-table">

                <tbody>

                    <tr>

                        <td>

                            <strong>
                                Nguyễn Minh Anh
                            </strong>

                            <br>

                            "Mẫu Ava còn màu đen không?"

                        </td>


                        <td>

                            <span class="status pending">
                                Chờ trả lời
                            </span>

                        </td>


                        <td>

                            <button
                                class="workspace-btn"
                                onclick="toggleChat()"
                            >
                                MỞ CHAT
                            </button>

                        </td>

                    </tr>


                    <tr>

                        <td>

                            <strong>
                                Trần Ngọc Mai
                            </strong>

                            <br>

                            "Tôi muốn kiểm tra đơn #MS-260815"

                        </td>


                        <td>

                            <span class="status">
                                Đang xử lý
                            </span>

                        </td>


                        <td>

                            <button
                                class="workspace-btn light"
                                onclick="toggleChat()"
                            >
                                TIẾP NHẬN
                            </button>

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


function renderProductsAdmin() {

    return `

        <div class="workspace-card">

            <h3>

                Danh mục sản phẩm

                <button
                    class="workspace-btn"
                    onclick="showToast('Đã mở form thêm sản phẩm')"
                >
                    + THÊM SẢN PHẨM
                </button>

            </h3>


            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Sản phẩm
                        </th>

                        <th>
                            Danh mục
                        </th>

                        <th>
                            Giá bán
                        </th>

                        <th>
                            Trạng thái
                        </th>

                        <th></th>

                    </tr>

                </thead>


                <tbody>

                    ${products
            .map(
                product =>
                    `

                                <tr>

                                    <td>
                                        ${product.name}
                                    </td>

                                    <td>
                                        ${product.category}
                                    </td>

                                    <td>
                                        ${formatPrice(
                        product.price
                    )}
                                    </td>

                                    <td>

                                        <span class="status">
                                            Đang bán
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            class="workspace-btn light"
                                            onclick="showToast('Đã mở chỉnh sửa ${product.name}')"
                                        >
                                            SỬA
                                        </button>

                                    </td>

                                </tr>

                                `
            )
            .join("")}

                </tbody>

            </table>

        </div>

    `;

}


function renderStaffAdmin() {

    return `

        <div class="workspace-card">

            <h3>
                Đội ngũ Maisoné
            </h3>


            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Nhân viên
                        </th>

                        <th>
                            Vai trò
                        </th>

                        <th>
                            Ca làm
                        </th>

                        <th>
                            Trạng thái
                        </th>

                    </tr>

                </thead>


                <tbody>

                    <tr>

                        <td>
                            Lê Thu Hà
                        </td>

                        <td>
                            Trưởng cửa hàng
                        </td>

                        <td>
                            08:00 - 17:00
                        </td>

                        <td>

                            <span class="status">
                                Đang làm việc
                            </span>

                        </td>

                    </tr>


                    <tr>

                        <td>
                            Phạm Gia Hân
                        </td>

                        <td>
                            Tư vấn bán hàng
                        </td>

                        <td>
                            13:00 - 22:00
                        </td>

                        <td>

                            <span class="status">
                                Đang làm việc
                            </span>

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


function renderReports() {

    return (

        statCards([

            [
                "Doanh thu hôm nay",
                "24,8M",
                "+18,4%"
            ],

            [
                "Doanh thu tuần",
                "128,3M",
                "+9,2%"
            ],

            [
                "AOV",
                "1,31M",
                "+4,6%"
            ],

            [
                "Đơn hoàn",
                "2,1%",
                "-0,8%"
            ]

        ])

        +

        `

        <div class="workspace-card">

            <h3>
                Báo cáo doanh thu
            </h3>

            <p>
                Biểu đồ doanh thu theo ngày
                và hiệu quả voucher sẽ được kết nối
                API ở bước backend. Bản frontend đã có
                đủ vùng hiển thị và thao tác xuất báo cáo.
            </p>

            <div class="workspace-actions">

                <button
                    class="workspace-btn"
                    onclick="showToast('Đang tạo báo cáo doanh thu PDF')"
                >
                    XUẤT PDF
                </button>

                <button
                    class="workspace-btn light"
                    onclick="showToast('Đang tải báo cáo Excel')"
                >
                    XUẤT EXCEL
                </button>

            </div>

        </div>

        `

    );

}


function renderPermissions() {

    return `

        <div class="workspace-card">

            <h3>
                Phân quyền tài khoản
            </h3>


            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Nhóm quyền
                        </th>

                        <th>
                            Sản phẩm
                        </th>

                        <th>
                            Đơn hàng
                        </th>

                        <th>
                            Khách hàng
                        </th>

                        <th>
                            Báo cáo
                        </th>

                    </tr>

                </thead>


                <tbody>

                    <tr>

                        <td>
                            <strong>
                                Admin
                            </strong>
                        </td>

                        <td>
                            Toàn quyền
                        </td>

                        <td>
                            Toàn quyền
                        </td>

                        <td>
                            Toàn quyền
                        </td>

                        <td>
                            Toàn quyền
                        </td>

                    </tr>


                    <tr>

                        <td>
                            <strong>
                                Nhân viên
                            </strong>
                        </td>

                        <td>
                            Xem
                        </td>

                        <td>
                            Chỉnh sửa
                        </td>

                        <td>
                            Chăm sóc
                        </td>

                        <td>
                            Chỉ xem
                        </td>

                    </tr>


                    <tr>

                        <td>
                            <strong>
                                Khách hàng
                            </strong>
                        </td>

                        <td>
                            Xem
                        </td>

                        <td>
                            Đơn của tôi
                        </td>

                        <td>
                            Hồ sơ của tôi
                        </td>

                        <td>
                            Không có
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


/* =====================================================
   REVIEWS
===================================================== */

function submitReview(event) {

    event.preventDefault();


    const text =
        document
            .getElementById(
                "reviewText"
            )
            .value
            .trim();


    const rating =
        document.getElementById(
            "reviewRating"
        ).value;


    if (!text) return;


    document
        .getElementById(
            "modalReviews"
        )
        .insertAdjacentHTML(
            "afterbegin",
            `

            <div class="review-item">

                <strong>

                    Bạn

                    <span class="stars">

                        ${"★".repeat(
                rating
            )
            }

                        ${"☆".repeat(
                5 - rating
            )
            }

                    </span>

                </strong>

                <span>
                    ${text}
                </span>

            </div>

            `
        );


    event.target.reset();


    showToast(
        "Cảm ơn bạn đã gửi đánh giá"
    );

}


/* =====================================================
   LIVE CHAT
===================================================== */

function toggleChat() {

    const chatWidget =
        document.getElementById(
            "chatWidget"
        );


    if (!chatWidget) return;


    chatWidget.classList.toggle(
        "show"
    );


    if (
        chatWidget.classList.contains(
            "show"
        )
    ) {

        document
            .getElementById(
                "chatInput"
            )
            ?.focus();

    }

}


function sendChat(event) {

    event.preventDefault();


    const input =
        document.getElementById(
            "chatInput"
        );


    const messages =
        document.getElementById(
            "chatMessages"
        );


    if (!input || !messages) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) return;


    messages.insertAdjacentHTML(
        "beforeend",
        `
        <div class="chat-message me"></div>
        `
    );


    messages.lastElementChild.textContent =
        text;


    input.value = "";


    setTimeout(
        () => {

            messages.insertAdjacentHTML(
                "beforeend",
                `
                <div class="chat-message">
                    Maisoné đã nhận được tin nhắn.
                    Nhân viên sẽ phản hồi bạn
                    trong ít phút.
                </div>
                `
            );

        },
        450
    );

}
document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeCart();

            closeModal();

            closeSearch();

            closeAccount();

            closeCheckout();

        }

    }
);


/* =====================================================
   START
===================================================== */
document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Home chỉ hiển thị một số sản phẩm
        renderProducts(
            products.slice(
                0,
                HOME_PRODUCT_LIMIT
            )
        );

        updateCart();
        updateAccountHeader();

        if (currentAccount) {

            routeAccountToWorkspace(
                currentAccount
            );

        }

    }
);