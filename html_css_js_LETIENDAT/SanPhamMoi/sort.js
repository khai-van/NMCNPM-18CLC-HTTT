

const list_product = document.querySelector('.list_product');

const sort_name_btn = document.querySelector('.sort-options .sort-name');
const sort_cost_btn = document.querySelector('.sort-options .sort-cost');

let list_items = [
    {
        name: 'Batman',
        cost: '100'
    },
    {
        name: 'Superman',
        cost: '100'
    },
    {
        name: 'Wonder Woman',
        cost: '100'
    },
    {
        name: 'The Flash',
        cost: '100'
    },
];


let desc = false;
sort_name_btn.addEventListener('click', () => {
    let array = sort_array_by(list_items, 'name', desc);
    displayList(array);
    desc = !desc;
    
})

function sort_array_by (array, sort, desc) {
    array.sort(function(a, b) {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
    });

    if (desc) array.reverse();

    return array;
}



function displayList (array = []) {
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


        a_hinhanh.href="";

        card.append(a_hinhanh);

        let hinhanh = document.createElement('img');
        hinhanh.src="./assets/img/item/item1.jpg";

        a_hinhanh.append(hinhanh);

        let noidung = document.createElement('div');
        noidung.classList.add('card-body');
        noidung.classList.add('py-2');


        card.append(noidung);

        let ten = document.createElement('h3');
        ten.classList.add('product-title');
        ten.classList.add('fs-sm');
        ten.classList.add('text-truncate');


        ten.innerText = item.name;

        noidung.append(ten);

        let gia_1 = document.createElement('div');
        gia_1.classList.add('d-flex');
        gia_1.classList.add('justify-content-between');

        
        noidung.append(gia_1);

        let gia_2 = document.createElement('div');
        gia_2.classList.add('product-price');

        gia_1.append(gia_2);

        
        let gia_3 = document.createElement('span');
        gia_3.classList.add('text-accent');
        gia_3.innerText = item.cost;

        gia_3.append(gia_2);


        list_product.append(khung);
    }   
} 

displayList(list_items);




