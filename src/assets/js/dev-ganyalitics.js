(function($) {
    // "use strict";
    $.getScript("https://www.googletagmanager.com/gtag/js?id=G-5047QJL4E6") //dev
})(jQuery);
// $(window).angularFunction();

function gAnalytics(titl, appType, path, Datas) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {dataLayer.push(arguments);}
    gtag('js', new Date());
    let Obj =  { 'app_type ': appType, 'page_title': titl, 'page_path': path}
    let ObjFinal= Object.assign(Obj,Datas);
    gtag('config', 'G-5047QJL4E6',ObjFinal); 
}
