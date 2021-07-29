let firstname = document.getElementById("firstname");
let lastname = document.getElementById("lastname");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let data = document.getElementById("html_data");

let send_estimate = document.getElementById("send_estimate");
let form_loader = document.getElementById("form_loader");
let success_msg = document.getElementById("success_msg");

form_loader.style.display = "none";

function sendToSelf(){
    send_estimate.style.display = "none";
    form_loader.style.display = "flex";
    success_msg.innerHTML = "Sending...";
    const contactData = getContactFormData();
    console.log("data: "+JSON.stringify(contactData));
    fetch('https://admin.tofaliafrica.com/api/sendToSelf', {
        method: 'POST',
        headers : {
            "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2Q0MDVmOGY1NGYxNjY3ZGE0YjczM2ViMTJkMDJiNjM0MGIxNmNjMDVhYjExYzllOThkZWY3Zjk4YjBjZjA3YjYzMjZlOGU1YjBmNjU3ODAiLCJpYXQiOjE2MTM5Nzg1MzEsIm5iZiI6MTYxMzk3ODUzMSwiZXhwIjoxNjQ1NTE0NTMxLCJzdWIiOiIxMjIiLCJzY29wZXMiOlsibW8iXX0.F-L6EdSs1X3-kBHzWmz62lTQcIn0iTdovuFYVRx1l5trMeRXOq-ayz12RozdFYeruuvobbaXgp601A8XCaP20YEeQgGltzIQ94GgBPsGyFk1eVnQ1GlvN7F1q5ii6buHBXe9y6MaicOHSeEt0-yimUnmsKWRQguyiFP56-PCx1Xkpkr2xeaRuEmi29R4wvdDwA-Bk5N31O9kdRpT-VDXgWqtryN1oFZLh5kjb1ncLJf1tshYyL_H1-Qhdx6K5ipSS3U3Vm66fPs6Cg05_nAo1nQyot5fZPQFwFJrnW43-pYO2i4PGH9c4o2tFjhxUMQ3O1AYp0Op2I1VZXI-zvm4cEO6jzHgb82OSNlqjBUphL_V4Z55GaqAKz-4yHNV43DnfGp7QmeK1d6Rg6ui6oSaVStn9-flD2GkWi-GnY-vdxGJosqqjkOckKbW87yVWoK08l_9psmJH2_mvyPu1hhw_T46mMi6gw2n6_u5YKsZrwTiT8HVaU2TytJAeJJqDVAAN8L38bSXs3Ekcp6XWuIiuxkvAkykZOKgRfk1ePt3K848-oVTEHiHb5XfCMmsz0BT_JqzzDaJ4B_iPCscheKBOMVKyxaAA-6HkStbRFIQzdB3NKqt_u40RbdqTPy_KA8WA-VNjsz0PTrD6TpFhstbNDcEtSiUUqxuEYMuXg2sEXk",
            "Content-Type": "application/json"
        },
        body:JSON.stringify(contactData)
    })
    .then((res) => res.json())
    .then(data => {
        console.log("sucess: "+JSON.stringify(data));
        send_estimate.style.display = "none";
        form_loader.style.display = "flex";
        success_msg.innerHTML = data.message;
        form_loader.style.display = "none";
    })
    .catch(exp => {
        console.log("error: "+JSON.stringify(exp));
        success_msg.innerHTML = "Error sending data";
        form_loader.style.display = "none";
    })
}

function getContactFormData(){
    let element_object = {};
    element_object.firstname = firstname.value;
    element_object.lastname = lastname.value;
    element_object.email = email.value;
    element_object.phone = phone.value;
    element_object.data = data.value;
    return element_object;
}