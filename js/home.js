document.addEventListener("DOMContentLoaded", function(){

    const startBtn = document.getElementById("startBtn");
    const howBtn = document.getElementById("howBtn");

    if(startBtn){
        startBtn.addEventListener("click", function(){
            window.location.href = "hesapla.html";
        });
    }

    if(howBtn){
        howBtn.addEventListener("click", function(){
            alert("Yakıt, sigorta, MTV ve diğer giderleri girerek aracın yıllık ve aylık maliyetini öğrenebilirsin.");
        });
    }

});
