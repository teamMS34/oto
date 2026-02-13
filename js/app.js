let chart;

function formatTR(num, fraction = 0){
    return num.toLocaleString("tr-TR", {
        minimumFractionDigits: fraction,
        maximumFractionDigits: fraction
    });
}

document.querySelectorAll(".format").forEach(input => {
    input.addEventListener("input", function(){
        let value = this.value;
        value = value.replace(/\./g,'');
        value = value.replace(/[^0-9,]/g,'');

        let parts = value.split(",");
        if(parts.length > 2){
            value = parts[0] + "," + parts[1];
        }

        let split = value.split(",");
        let integerPart = split[0];
        let decimalPart = split[1];

        if(integerPart){
            integerPart = Number(integerPart).toLocaleString("tr-TR");
        }

        this.value = decimalPart !== undefined
            ? integerPart + "," + decimalPart
            : integerPart;
    });
});

function getNumber(id){
    let value = document.getElementById(id).value;
    value = value.replace(/\./g,'');
    value = value.replace(",", ".");
    return parseFloat(value) || 0;
}

function hesapla(){

    let rec = document.getElementById("recommendation");
    rec.classList.remove("rec-success","rec-warning","rec-danger");

    let fields = [
        {id:"km", name:"Yıllık KM"},
        {id:"tuketim", name:"Ortalama Tüketim"},
        {id:"yakit", name:"Yakıt Fiyatı"},
        {id:"sigorta", name:"Sigorta"},
        {id:"mtv", name:"MTV"},
        {id:"bakim", name:"Bakım"},
        {id:"gelir", name:"Aylık Gelir"}
    ];

    let eksikAlanlar = [];

    fields.forEach(f=>{
        document.getElementById(f.id).classList.remove("input-error");
        if(getNumber(f.id) <= 0){
            eksikAlanlar.push(f);
        }
    });

    if(eksikAlanlar.length > 0){

        eksikAlanlar.forEach(f=>{
            document.getElementById(f.id).classList.add("input-error");
        });

        rec.classList.add("rec-danger");
        rec.innerText =
            "Lütfen şu alanları doldurun: " +
            eksikAlanlar.map(f=>f.name).join(", ");

        document.getElementById("progressFill").style.width="0%";
        document.getElementById("progressFill").innerText="0%";
        document.getElementById("riskText").innerText="Risk Durumu: -";

        if(chart) chart.destroy();
        return;
    }

    let km = getNumber("km");
    let tuketim = getNumber("tuketim");
    let yakit = getNumber("yakit");
    let sigorta = getNumber("sigorta");
    let kasko = getNumber("kasko");
    let mtv = getNumber("mtv");
    let bakim = getNumber("bakim");
    let gelir = getNumber("gelir");

    let yillikYakit = (km/100)*tuketim*yakit;
    let toplam = yillikYakit + sigorta + kasko + mtv + bakim;
    let aylik = toplam/12;
    let kmBasi = toplam/km;

    document.getElementById("yillik").innerText =
        formatTR(toplam) + " TL";

    document.getElementById("aylik").innerText =
        "Aylık Ortalama Maliyet: " +
        formatTR(aylik) + " TL";

    document.getElementById("kmMaliyet").innerText =
        "KM Başına Maliyet: " +
        formatTR(kmBasi,2) + " TL";

    let yuzde = (aylik/gelir)*100;
    if(yuzde>100) yuzde=100;

    document.getElementById("progressFill").style.width = yuzde + "%";
    document.getElementById("progressFill").innerText =
        formatTR(yuzde,1) + "%";

    let risk;

    if(yuzde<=20){
        risk="✔ Güvenli";
        rec.classList.add("rec-success");
        rec.innerText="Bu araç bütçene uygun görünüyor.";
    }
    else if(yuzde<=35){
        risk="⚠ Orta Risk";
        rec.classList.add("rec-warning");
        rec.innerText="Bütçe planlamasını dikkatli yapmalısın.";
    }
    else{
        risk="❌ Yüksek Risk";
        rec.classList.add("rec-danger");
        rec.innerText="Bu araç gelirine göre riskli olabilir.";
    }

    document.getElementById("riskText").innerText =
        "Aylık Gelire Oranı: %" +
        formatTR(yuzde,1) +
        " → " + risk;

    let ctx = document.getElementById('costChart').getContext('2d');
    if(chart) chart.destroy();

    const toplam = yakit + bakim + sigorta + diger;

const ctx = document.getElementById('maliyetGrafik');

new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Yakıt', 'Bakım', 'Sigorta', 'Diğer'],
        datasets: [{
            data: [yakit, bakim, sigorta, diger],
            backgroundColor: [
                '#ef4444',
                '#3b82f6',
                '#facc15',
                '#10b981'
            ],
            hoverOffset: 15,
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let value = context.raw;
                        let percentage = ((value / toplam) * 100).toFixed(1);
                        return context.label + ': ₺' + value + ' (%' + percentage + ')';
                    }
                }
            }
        }
    }
});
