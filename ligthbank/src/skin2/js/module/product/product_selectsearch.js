/**
 * 조건별 검색 기능 스크립트
 */
$(document).ready(function()
{
    //배너 변경
	if($(".banner").html() == "" && $("#loc_1depth").text().indexOf("135") < 0){
		$("#subMainBanner").show();
		  //우측슬라이드배너
	    $('.JS_23165_01').DB_tabArrowSlideMove({
	        motionType:'x',          //모션타입('none','x','y','fade')
	        motionSpeed:800,         //모션속도
	        autoRollingTime:3000,    //자동롤링속도(밀리초)
	        arrowVisible:true,       //메뉴보이기(true,false)
	        overRolling:false        //마우스오버시작동(true,false)
	    });
	    		
		//거실, 안방 
		if($("#loc_1depth").text().indexOf("123") > 0 || $("#loc_1depth").text().indexOf("124") > 0){
			$("#banner1").html("<a href='/product/list.html?cate_no=100'><img id='bannerType1' src='/_wg/img/sub_banner/sbt_03_01.jpg' /></a>");
			$("#banner2").hide();
			$("#bannerTab").show();
		}else{
			//공부방/아이방
			if($("#loc_1depth").text().indexOf("125") > 0 || $("#loc_1depth").text().indexOf("126") > 0){
				$("#banner1").html("<img src='/_wg/img/sub_banner/sb_03.jpg' />");	
			//주방			
			}else if($("#loc_1depth").text().indexOf("130") > 0){ 
				$("#banner1").html("<img src='/_wg/img/sub_banner/sb_04.jpg' />");	
			//알파/드레스룸			
			}else if($("#loc_1depth").text().indexOf("127") > 0){ 
				$("#banner1").html("<img src='/_wg/img/sub_banner/sb_05.jpg' />");	
			//욕실		
			}else if($("#loc_1depth").text().indexOf("132") > 0){ 
				$("#banner1").html("<img src='/_wg/img/sub_banner/sb_06.jpg' />");
			//식탁/카페		
			}else if($("#loc_1depth").text().indexOf("131") > 0){ 
				$("#banner1").html("<img src='/_wg/img/sub_banner/sb_07.jpg' />");
			//식탁/카페		
			}else if($("#loc_1depth").text().indexOf("131") > 0){ 
				$("#banner1").html("<img src='/_wg/img/sub_banner/sb_07.jpg' />");
			//LED모듈		
			}else if($("#loc_1depth").text().indexOf("134") > 0){ 
				$("#banner1").html("<img src='/_wg/img/sub_banner/sb_08.jpg' />");
			//현관/베란다/벽		
			}else if($("#loc_1depth").text().indexOf("133") > 0){ 
				$("#banner1").html("<img src='/_wg/img/sub_banner/sb_09.jpg' />");
			}
			
			$("#banner2").hide();
			$("#bannerTab").hide();
		}
	}else{
		$("#subMainBanner").hide();
	}
	
    var sParentElement = 'select.SecondSelect';
    $('select.FirstSelect').change(function()
    {
        var iGroupNo = $(this).find('option:selected').val();
        if (iGroupNo > 0) {
            $.ajax({
                url : '/product/provider/selectsearch.xml?GroupNo=' + iGroupNo,
                dataType : 'text',
                success : function(data){
                    if ( window.DOMParser ) {
                        tmp = new DOMParser();
                        xml = tmp.parseFromString( data , "text/xml" );
                    } else {
                        xml = new ActiveXObject( "Microsoft.XMLDOM" );
                        xml.async = "false";
                        xml.loadXML( data );
                    }

                    $(sParentElement).html('');
                    getOptionElement('','-세부항목선택-').appendTo(sParentElement);
                    var nodes = $(xml).find('searchkey');
                    for ( var x = 0 ; x < nodes.length ; x++) {
                        getOptionElement($(nodes[x]).find('search_value').text(),$(nodes[x]).find('search_value').text()).appendTo(sParentElement);
                    }
                }
            });
        }
    });
    $('a.SelectSearch').click(function()
    {
        var sGroup = $('select.FirstSelect').val();
        var sItem = $('select.SecondSelect').val();
        if (!sGroup) {
            alert('조건을 선택해 주세요.');
            return false;
        }
        if (!sItem) {
            alert('세부 항목을 선택해 주세요.');
            return false;
        }
        location.href = document.location.href.split('?')[0].split(document.domain)[1] + '?' + sSSUrl + '&sGroup=' + sGroup + '&sItem=' + sItem;
    });

    function getOptionElement(sVal, sTitle)
    {
        return $("<option value='" + sVal + "'>" + sTitle + "</option>");
    }
});

function chgBanner(type){
	if(type == 1){
		$("#samsungBtn").attr("src","/_wg/img/sub_banner/sb_tab01_on.jpg");
		$("#setBtn").attr("src","/_wg/img/sub_banner/sb_tab02_off.jpg");
		$("#banner1").show();
		$("#banner2").hide();
	}else{
		$("#samsungBtn").attr("src","/_wg/img/sub_banner/sb_tab01_off.jpg");
		$("#setBtn").attr("src","/_wg/img/sub_banner/sb_tab02_on.jpg");
		$("#banner1").hide();
		$("#banner2").show();
	}
}