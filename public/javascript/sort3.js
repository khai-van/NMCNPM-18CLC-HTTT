const list_product = document.querySelector('.list_product');

var select = document.querySelector('.sort-options');

var hinh = document.getElementsByClassName("hinh_san_pham"); // lấy hình ảnh

var ten = document.getElementsByClassName("ten_san_pham"); // lấy id và lấy tên.
var id = ten[0].href.slice(ten[0].href.indexOf("=") + 1, ten[0].href.length);


var gia = document.getElementsByClassName("gia_san_pham"); // lấy giá


function get_content_HTML(ten, gia) {
    var list_items = new Array();
    var item = new Object();
    for (var i = 0; i < ten.length; i++) {
        item.name = ten[i].textContent; //ten

        item.price = gia[i].textContent.replace(/\s/g, ''); //gia
        item.files = new Array(); //hinh
        item.files.push(hinh[i].src);
        item.href = ten[i].href;
        item.id = ten[i].href.slice(ten[i].href.indexOf("=") + 1, ten[i].href.length);; //id
        list_items.push(item);
        item = {};

    }

    return list_items;


}
list_items = get_content_HTML(ten, gia)


select.addEventListener('change', function () {
    if (select.value == 1) {
        let array = sort_array_by(list_items, 'name', true);
        displayList(array);

    } else if (select.value == 2) {
        let array = sort_array_by(list_items, 'name', false);
        displayList(array);


    } else if (select.value == 3) {
        let array = sort_array_by(list_items, 'price', true);
        displayList(array);

    } else if (select.value == 4) {
        let array = sort_array_by(list_items, 'price', false);
        displayList(array);
    }
});


function sort_array_by(array, sort, type) {
    array.sort(function (a, b) {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
    });



    if (type == false) array.reverse();

    return array;
}



function displayList(array = []) {
    list_product.innerHTML = "";

    for (let i = 0; i < array.length; i++) {
        let item = array[i];


        let khung = document.createElement('div');
        khung.classList.add('col-lg-3');
        khung.classList.add('col-md-4');
        khung.classList.add('col-sm-6');
        khung.classList.add('px-2');
        khung.classList.add('mb-4');

        let card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('product-card');



        khung.appendChild(card);

        let a_hinhanh = document.createElement('a');
        a_hinhanh.classList.add('card-img-top');
        a_hinhanh.classList.add('d-block');
        a_hinhanh.classList.add('overflow-hidden');


        a_hinhanh.href = item.href;

        card.append(a_hinhanh);

        let hinhanh = document.createElement('img');
        hinhanh.classList.add("hinh_san_pham");
        hinhanh.src = item.files[0];

        a_hinhanh.append(hinhanh);

        let noidung = document.createElement('div');
        noidung.classList.add('card-body');
        noidung.classList.add('py-2');


        card.append(noidung);

        let ten = document.createElement('h3');
        ten.classList.add('product-title');
        ten.classList.add('fs-sm');
        ten.classList.add('text-truncate');

        noidung.append(ten);

        let ten_1 = document.createElement('a');
        ten_1.classList.add("ten_san_pham");
        ten_1.href = item.href;
        ten_1.innerText = item.name;

        ten.append(ten_1);

        let gia_1 = document.createElement('div');
        gia_1.classList.add('d-flex');
        gia_1.classList.add('justify-content-between');


        noidung.append(gia_1);

        let gia_2 = document.createElement('div');
        gia_2.classList.add('product-price');
        gia_2.classList.add('gia_san_pham');

        gia_1.append(gia_2);


        let gia_3 = document.createElement('span');
        gia_3.classList.add('text-accent');
        gia_3.innerText = item.price

        gia_2.append(gia_3);

        let button_1 = document.createElement('div');
        button_1.classList.add('card-body');
        button_1.classList.add('card-body-hidden');


        card.append(button_1);

        let button_2 = document.createElement('input');
        button_2.classList.add('btn')
        button_2.classList.add('btn-primary')
        button_2.classList.add('btn-sm')
        button_2.classList.add('d-block')
        button_2.classList.add('w-100')
        button_2.classList.add('mb-2')
        button_2.classList.add('nut_san_pham')
        button_2.setAttribute('type', 'button')
        button_2.setAttribute('value', 'Thêm vào giỏ hàng')
        console.log(item)
        button_2.setAttribute('onclick', "addToCart(" + "'" + String(item.id) + "'" + ", 1," + "'" + String(item
            .price) + "'" + ")");



        button_1.append(button_2);





        list_product.append(khung);
    }
}