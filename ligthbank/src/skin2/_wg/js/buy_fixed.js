/*********************************************************************************

    라이센스 : 엄우식(디자인웹굿)

*********************************************************************************/

!(function(){var $this=$('.buy_wrap');var $toggle=$('.toggle_btn');var $dumy=$('.buy_dummy');var speed=300;var gap=500;var height=$this.outerHeight();var top=$this.offset().top+height+gap;setTimeout(function(){},1000);var $window=$(window);var $document=$(document);$window.scroll(function(){checkScroll()});function checkScroll(){if($document.scrollTop()>top){if(!$this.hasClass('fixed')){height=$this.outerHeight()}$dumy.css('height',height);$this.addClass('fixed')}else{$dumy.css('height',0);$this.removeClass('fixed')}}checkScroll();$toggle.bind('click',function(){$(this).toggleClass('on');height=$this.outerHeight();if($(this).hasClass('on')){$this.addClass('on')}else{$this.removeClass('on')}})})();