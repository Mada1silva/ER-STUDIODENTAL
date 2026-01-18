$(document).ready(function(){
    
    // 1. Inicializa o Menu Lateral (Mobile)
    $('.sidenav').sidenav();

    // 2. Inicializa o Slider do Topo (Banner principal)
    $('.slider').slider({
        indicators: true,
        height: 500,
        interval: 5000 
    });

    // 3. Inicializa o Carrossel de Trabalhos (Portfólio)
    // Voltamos para o seu seletor de ID que estava dando certo!
    $('#carousel-trabalhos').carousel({
        dist: -100,    // Efeito de profundidade
        shift: 0,      // Espaço entre as fotos
        padding: 20,   // Distância
        numVisible: 5  // Quantas fotos aparecem ao mesmo tempo
    });

    // 4. Inicializa o Scroll Suave (Links do menu)
    $('.scrollspy').scrollSpy();

    // 5. Autoplay para o Carrossel de baixo
    setInterval(function() {
        $('#carousel-trabalhos').carousel('next');
    }, 4000);

});