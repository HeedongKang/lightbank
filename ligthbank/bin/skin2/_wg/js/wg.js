
// 할인율 아이콘
function calculate_discount_rate() {
    $('.discount_rate').each(function() {
        var el = $(this);

        var price = el.attr('data-price'); el.removeAttr('data-price');
        var sale = el.attr('data-sale'); el.removeAttr('data-sale');
    
        price = parseInt(price.replace(/,/g, ''));
        sale = parseInt(sale.replace(/,/g, ''));
    
        var rate = 0;
        if (!isNaN(price) && !isNaN(sale) && 0 < price) {
            rate = Math.round((price - sale) / price * 100);
            
        }
        el.html(rate+'<span>%</span>');
    
        rate = Math.ceil(rate / 10) * 10;
        
        el.addClass('rate' + rate);
        if(rate>0){
            el.show();
        }
    });
};

$(document).ready(function() {
    calculate_discount_rate();
});





/* 상품비교 체크박스를 분류페이지에서만 보이게 */
if(location.href.indexOf("list.html")!=-1){
    $('.chk').show();
}





/* 슬라이드 앵커 */
$(function() {
$.fn.tabScroll = function(){
    $(this).click(function(e){   
        e.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top-110}, 1000, "easeInOutExpo");
    });
}
});

$(document).ready(function(){
    $(".slide_anchor > ul > li > a").tabScroll();
});

