let minimum_blocks_number = 4000;
let storage_url = "https://admin.tofaliafrica.com/storage/";
let material_body = document.getElementById('material_body');
let pdf_body = document.getElementById('pdf_body');
let material_form = document.getElementById('material_form');
let get_total_button = document.getElementById('get_total_button');
let get_catalogue_button = document.getElementById('get_catalogue_button');
let html_data = document.getElementById('html_data');
let generate_pdf_button = document.getElementById('generate_pdf_button');
let error_message = document.getElementById('error-message');
let success_message = document.getElementById('message');
generate_pdf_button.style.display = 'none';

function getCatalogue(){
    generate_pdf_button.style.display = 'none';
    material_loader_gif.style.display = 'flex';
    material_form.style.display = 'none';
    get_total_button.style.display = "block";
    get_catalogue_button.style.display = 'none';
    let order_list = `
    <table class="table table-hover materials">
    <thead>
        <tr>
            <th>Description</th>
            <th>QUANTITY</th>
            <th>MEASUREMENTS</th>
        </tr>
    </thead>
    `;
    fetch('https://admin.tofaliafrica.com/api/blockCatalog')
    .then((res) => res.json())
    .then(data => {
        data.forEach(element => {
            order_list += `
            <tr>
            <td class="td-center">
                <img class="cell-img" src="${storage_url}${element.imageUrl}">
                <br />
                <strong>${element.description}</strong>
                <br />${element.name}
            </td>
            <td class="td-center">
            <input min="1" max="${minimum_blocks_number}" type="number" class="form-control td-input" id="${element.id}" name="material_item" value="0">
            </td>
            <td>
            <strong>Cement Bag: </strong> ${parseFloat(element.units_per_bag_of_cement).toFixed(1)}
            <br />
            <strong>Stone dust: </strong> ${parseFloat(element.units_per_stone_dust_ton).toFixed(1)}
            </td>
            </tr>`
        });
        material_body.innerHTML = order_list + "</table>";
        material_loader_gif.style.display = 'none';
        material_form.style.display = 'block';
        material_loader_gif.style.display = 'none';
    })
    .catch(err => {
        console.log(err);
        alert("Error Procesding Request, Try Again");
    })
}

function getTotalValue(){
    let errors = [];
    material_loader_gif.style.display = 'flex';
    let items_list = [];
    try{
        items_list = getMaterialItems();
    }catch(err){
        errors.push(JSON.stringify(err));
        get_total_button.style.display="none";
        generate_pdf_button.style.display="none";
        success_message.style.display = "none";
        material_loader_gif.style.display = "none";
        error_message.innerHTML = `<strong>Error:</strong> ${err}`;
        //return;
    }
    get_catalogue_button.style.display = 'block';
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
        let total = parseFloat(data.total).toFixed(0);

        let calculatedItemBody = `<h4>Total Estimated Cost: <strong style="border-bottom: 1px dotted #000;">UGX ${numberWithCommas(total)}/=</strong></h4>`;
        let pdfHtmlExport = `
        <style>
        .cell-img{
            width:80px;
            padding:20px 10px 10px 20px;
        }
        h3{
            font-weight: 800;
            font-family: sans-serif;
        }
        h4{
            font-weight: 800;
            font-family: sans-serif;
        }
        table {
          font-family: Arial, Helvetica, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        
        table td, table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
        
        table tr:nth-child(even){background-color: #f2f2f2;}
        
        table tr:hover {background-color: #ddd;}
        
        table th {
          padding-top: 12px;
          padding-bottom: 12px;
          background-color: grey;
          color: white;
          text-align: left; 
          width: 80px;
        }
        </style>
        <div id="totalCostElement">
        <img style="max-width:140px;padding-top:20px;padding-bottom:20px" class="img-responsive" src="https://tofaliafrica.com/images/Logo.png" alt="">`;
        //cost_of_blocks
        calculatedItemBody += '<div class="table-area table-responsive"><span class="table-heading">Cost of blocks</span>'+
        '<table class="table table-hover materials">'+
        '<tr><th>Description</th><th>Measurements</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>';
        pdfHtmlExport += `
        <h3>Total Cost: UGX ${numberWithCommas(total)}/=</h3>
        <h4>Cost Breakdown</h4>
        <table id="cost_table">
        <tr><th>Description</th><th>Measurements</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>`;
        cost_of_blocks.forEach(element => {
            
            calculatedItemBody += `<tr>
            <td class="td-center">
                <img class="cell-img" src="${storage_url}${element.imageUrl}">
                <br />
                <strong>${element.description}</strong>
                <br />${element.name}
            </td>
            <td>
            <strong>Cement Bag: </strong> ${parseFloat(element.units_per_bag_of_cement).toFixed(1)}
            <br />
            <strong>Stone dust: </strong> ${parseFloat(element.units_per_stone_dust_ton).toFixed(1)}
            </td>
            <td>${parseFloat(element.quantity).toFixed(0)}</td>
            <td>${numberWithCommas(parseFloat(element.unit_price).toFixed(0))}</td>
            <td>${numberWithCommas(parseFloat(element.total_price).toFixed(0))}</td>
            </tr>`;

            pdfHtmlExport += `<tr>
            <td>
            <img class="cell-img" src="${storage_url}${element.imageUrl}">
                <br />
            <strong>${element.description}</strong>
            <br />${element.name}
            </td>
            <td>
            <strong>Cement Bag: </strong> ${parseFloat(element.units_per_bag_of_cement).toFixed(1)}
            <br />
            <strong>Stone dust: </strong> ${parseFloat(element.units_per_stone_dust_ton).toFixed(1)}
            </td>
            <td>${parseFloat(element.quantity).toFixed(0)}</td>
            <td>${numberWithCommas(parseFloat(element.unit_price).toFixed(0))}</td>
            <td>${numberWithCommas(parseFloat(element.total_price).toFixed(0))}</td>
            </tr>
            `;
        });
        calculatedItemBody += '</table></div>';
        pdfHtmlExport += `</table>`;

        //materials_break_down
        calculatedItemBody += `<div class="table-area table-responsive"><span class="table-heading">Material Breakdown</span>
        <table class="table table-hover materials">
        <tr><th>Material</th><th>Unit</th><th>Quantity</th><th>Unit Price</th><th>Total Price</th></tr>`;

        pdfHtmlExport += `
        <h4>Material breakdown</h4>
        <table id="material_breakdown">
        <tr><th>Material</th><th>Unit</th><th>Quantity</th><th>Unit Price</th><th>Total Price</th></tr>`;
        materials_break_down.forEach(element => {
            calculatedItemBody += `<tr>
            <td>${element.material}</td>
            <td>${element.unit}</td>
            <td>${element.quantity}</td>
            <td>${numberWithCommas(element.unit_price)}</td>
            <td>${numberWithCommas(parseFloat(element.total_price).toFixed(0))}</td>
            </tr>`;

            pdfHtmlExport += `<tr>
            <td>${element.material}</td>
            <td>${element.unit}</td>
            <td>${element.quantity}</td>
            <td>${numberWithCommas(element.unit_price)}</td>
            <td>${numberWithCommas(parseFloat(element.total_price).toFixed(0))}</td>
            </tr>`;
        });
        calculatedItemBody += '</table></div>';
        pdfHtmlExport += '</table>';

        //production_break_down
        calculatedItemBody += `<div class="table-area table-responsive"><span class="table-heading">Production Breakdown</span>
        <table class="table table-hover materials">
        <tr><th>Production</th><th>Unit</th><th>Quantity</th><th>Unit Price</th><th>Total Price</th></tr>`;
        pdfHtmlExport += `
        <h4>Production Breakdown</h4>
        <table id="production_breakdown">
        <tr><th>Production</th><th>Unit</th><th>Quantity</th><th>Unit Price</th><th>Total Price</th></tr>`;
        production_break_down.forEach(element => {
            calculatedItemBody += `<tr>
            <td>${element.production}</td>
            <td>${element.unit}</td>
            <td>${element.quantity}</td>
            <td>${numberWithCommas(element.unit_price)}</td>
            <td>${numberWithCommas(element.total_price)}</td>
            </tr>`;

            pdfHtmlExport += `
            <tr>
            <td>${element.production}</td>
            <td>${element.unit}</td>
            <td>${element.quantity}</td>
            <td>${numberWithCommas(element.unit_price)}</td>
            <td>${numberWithCommas(element.total_price)}</td>
            </tr>
            `;
        });
        calculatedItemBody += '</table></div>';
        pdfHtmlExport += '</table>';
        pdfHtmlExport += '</div>';
        
        material_body.innerHTML = calculatedItemBody;
        html_data.value = btoa(pdfHtmlExport);
        
        generate_pdf_button.style.display = 'block';
        material_loader_gif.style.display = 'none';
        get_total_button.style.display = 'none';
        material_form.style.display = 'block';
    })
    .catch(err => {
        errors.push(JSON.stringify(err));
        console.log(err);
        if(errors.length == 1){
            success_message.style.display = "none";
            material_loader_gif.style.display = "none";
            error_message.innerHTML = `<strong>Error:</strong> ${err}`;
        }
    });
}

function getMaterialItems(){
    let item_list = [];
    const elements = document.querySelectorAll("input[name='material_item']");
    for (const element of elements) {
        if(element.value > minimum_blocks_number){
            let element_object = {};
            element_object.id = element.id;
            element_object.quantity = element.value;
            item_list.push(element_object);
        }
    }
    if(item_list.length == 0)
        throw "Block machines can only be deployed for orders not less than 4,000. For less numbers visit <a href=\"contact.html\">Contact Us</a> for further help.";
    return item_list;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}