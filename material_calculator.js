let material_body = document.getElementById('material_body');
let material_form = document.getElementById('material_form');
let get_total_button = document.getElementById('get_total_button');

function getCatalogue(){
    material_form.style.display = 'none';
    let order_list = `
    <table class="materials">
    <tr>
        <th>Name</th>
        <th>Desc</th>
        <th>Type</th>
        <th>IMG</th>
        <th>Group</th>
        <th>Cemment (Unit)</th>
        <th>Stone Dust (Unit)</th>
        <th>Quantity</th>
    </tr>
    `;
    fetch('https://admin.tofaliafrica.com/api/blockCatalog')
    .then((res) => res.json())
    .then(data => {
        data.forEach(element => {
            order_list += `<tr>
            <td>${element.name}</td>
            <td>${element.description}</td>
            <td>${element.type}</td>
            <td>${element.imageUrl}</td>
            <td>${element.group}</td>
            <td>${parseFloat(element.units_per_bag_of_cement).toFixed(1)}</td>
            <td>${parseFloat(element.units_per_stone_dust_ton).toFixed(1)}</td>
            <td><input id="${element.id}" name="material_item" value="0"></td>
            </tr>`
        });
        material_body.innerHTML = order_list + "</table>";
        material_loader_gif.style.display = 'none';
        material_form.style.display = 'block';
    })
    .catch(err => console.log(err))
}

function getTotalValue(){
    const items_list = getMaterialItems();
    material_loader_gif.style.display = 'flex';
    material_form.style.display = 'none';
    console.log(JSON.stringify(items_list))
    fetch('https://admin.tofaliafrica.com/api/materialsCalculator', {
        method: 'POST',
        headers : {
            "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2Q0MDVmOGY1NGYxNjY3ZGE0YjczM2ViMTJkMDJiNjM0MGIxNmNjMDVhYjExYzllOThkZWY3Zjk4YjBjZjA3YjYzMjZlOGU1YjBmNjU3ODAiLCJpYXQiOjE2MTM5Nzg1MzEsIm5iZiI6MTYxMzk3ODUzMSwiZXhwIjoxNjQ1NTE0NTMxLCJzdWIiOiIxMjIiLCJzY29wZXMiOlsibW8iXX0.F-L6EdSs1X3-kBHzWmz62lTQcIn0iTdovuFYVRx1l5trMeRXOq-ayz12RozdFYeruuvobbaXgp601A8XCaP20YEeQgGltzIQ94GgBPsGyFk1eVnQ1GlvN7F1q5ii6buHBXe9y6MaicOHSeEt0-yimUnmsKWRQguyiFP56-PCx1Xkpkr2xeaRuEmi29R4wvdDwA-Bk5N31O9kdRpT-VDXgWqtryN1oFZLh5kjb1ncLJf1tshYyL_H1-Qhdx6K5ipSS3U3Vm66fPs6Cg05_nAo1nQyot5fZPQFwFJrnW43-pYO2i4PGH9c4o2tFjhxUMQ3O1AYp0Op2I1VZXI-zvm4cEO6jzHgb82OSNlqjBUphL_V4Z55GaqAKz-4yHNV43DnfGp7QmeK1d6Rg6ui6oSaVStn9-flD2GkWi-GnY-vdxGJosqqjkOckKbW87yVWoK08l_9psmJH2_mvyPu1hhw_T46mMi6gw2n6_u5YKsZrwTiT8HVaU2TytJAeJJqDVAAN8L38bSXs3Ekcp6XWuIiuxkvAkykZOKgRfk1ePt3K848-oVTEHiHb5XfCMmsz0BT_JqzzDaJ4B_iPCscheKBOMVKyxaAA-6HkStbRFIQzdB3NKqt_u40RbdqTPy_KA8WA-VNjsz0PTrD6TpFhstbNDcEtSiUUqxuEYMuXg2sEXk",
            "Content-Type": "application/json"
        },
        body:JSON.stringify(items_list)
    }).then((res) => res.json())
    .then(data => {
        console.log(data);

        let cost_of_blocks = data.cost_of_blocks;
        let materials_break_down = data.materials_break_down;
        let production_break_down = data.production_break_down;
        let total = parseFloat(data.total).toFixed(1);

        let calculatedItemBody = `<h1>Calculated Material Value: <strong>UGX ${total}</strong></h1>`;

        //cost_of_blocks
        calculatedItemBody += '<h4>Cost of blocks</h4>'+
        '<table class="materials">'+
        '<tr><th>Name</th><th>Desc</th><th>Type</th><th>IMG</th><th>Group</th><th>Cemment (Unit)</th><th>Stone Dust (Unit)</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>';
        cost_of_blocks.forEach(element => {
            calculatedItemBody += `<tr>
            <td>${element.name}</td>
            <td>${element.description}</td>
            <td>${element.type}</td>
            <td>${element.imageUrl}</td>
            <td>${element.group}</td>
            <td>${parseFloat(element.units_per_bag_of_cement).toFixed(1)}</td>
            <td>${parseFloat(element.units_per_stone_dust_ton).toFixed(1)}</td>
            <td>${parseFloat(element.quantity).toFixed(1)}</td>
            <td>${parseFloat(element.unit_price).toFixed(1)}</td>
            <td>${parseFloat(element.total_price).toFixed(1)}</td>
            </tr>`
        });
        calculatedItemBody += '</table>';

        //materials_break_down
        calculatedItemBody += `<h4>Material Breakdown</h4>
        <table class="materials">
        <tr><th>Material</th><th>Unit</th><th>Quantity</th><th>Unit Price</th><th>Total Price</th></tr>`;
        materials_break_down.forEach(element => {
            calculatedItemBody += `<tr>
            <td>${element.material}</td>
            <td>${element.unit}</td>
            <td>${element.quantity}</td>
            <td>${element.unit_price}</td>
            <td>${element.total_price}</td>
            </tr>`
        });
        calculatedItemBody += '</table>';

        //production_break_down
        calculatedItemBody += `<h4>Production Breakdown</h4>
        <table class="materials">
        <tr><th>Production</th><th>Unit</th><th>Quantity</th><th>Unit Price</th><th>Total Price</th></tr>`;
        production_break_down.forEach(element => {
            calculatedItemBody += `<tr>
            <td>${element.production}</td>
            <td>${element.unit}</td>
            <td>${element.quantity}</td>
            <td>${element.unit_price}</td>
            <td>${element.total_price}</td>
            </tr>`
        });
        calculatedItemBody += '</table>';
        
        material_body.innerHTML = calculatedItemBody;
        material_loader_gif.style.display = 'none';
        get_total_button.style.display = 'none';
        material_form.style.display = 'block';
    })
    .catch(err => console.log(err));
}

function getMaterialItems(){
    let item_list = [];
    const elements = document.querySelectorAll("input[name='material_item']");
    for (const element of elements) {
        if(element.value != 0){
            let element_object = {};
            element_object.id = element.id;
            element_object.quantity = element.value;
            item_list.push(element_object);
        }
    }
    return item_list;
}

function filterInputs(element) {
    return element.value.trim() != '0' || element.value.trim() != '';
  }