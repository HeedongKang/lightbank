/**
 * 상품상세 사용후기
 */
$(document).ready(function(){
    $('.xans-product-review a').click(function(e) {
        e.preventDefault();

        var no = $(this).attr('href').replace(/(\S*)[?&]no=(\d+)(\S*)/g, '$2');
        var $obj = $('#product-review-read_'+no);

        //로드된 엘리먼트 존재 체크
        if ($obj.length > 0) {
            if ($obj.css('display') =='none') {
                $obj.show();
            } else {
                $obj.hide();
            }
            return;
        }

        REVIEW.getReadData($(this));
    });
    
    //상품 인트로 이미지 상품명을 체크해서 변경 처리
    /*if($("#chkPrdNm").html().indexOf("삼성") > -1){
        $("#info_img_id").attr("src","/ex/common_prd_detail_info.gif");
    }else{
        $("#info_img_id").attr("src","/ex/common_prd_detail_info_etc.gif");
    }*/
    //상품명이 아닌 브랜드명으로 intro 페이지 분기로 변경
    /*
	$(".brandChk").each(function(idx){
		 if($(this).html().indexOf("삼성") > -1){
	        $("#info_img_id").attr("src","/ex/common_prd_detail_info.gif");
	    }
	});
	*/
    
	//상품교체작업 진행 중 임시 상품상세 분기 작업(밀레 작업완료) 
	if($("#chkPrdNm").html().indexOf("밀레") > -1 ){
		$("#compareVideo").hide();
		$("#info_img_id").hide();
		$("#detail03").hide();
		$("#detail04").hide();
	}
	
	
    //상품명에 펜던트가 포함되면 전구구매가이드 노출
    if($("#chkPrdNm").html().indexOf("펜던트") > -1 || $("#chkPrdNm").html().indexOf("벽등") > -1 
    || $("#chkPrdNm").html().indexOf("레일기구") > -1 || $("#chkPrdNm").html().indexOf("직부등") > -1){
        $("#light_ord_guide").html("<img src='/_wg/img/prd_detail/light_ord_guide.gif' alt='전구 구매 가이드'/>");
    }
    
    //상품명에 LG, 엘지가 포함되면 플리커프리 영상 교체 
    if($("#chkPrdNm").html().indexOf("LG") > -1 || $("#chkPrdNm").html().indexOf("엘지") > -1){
        $("#compareVideo").html("<img src='/_wg/img/prd_detail/detail_02-1.jpg' width='1260px' alt='플리커프리'/><center style='width:1260px;height:550px;background: #cbcbcb;'><iframe width='980' height='500' src='https://www.youtube.com/embed/0aoLNxU4HQ0?rel=0' frameborder='0' allwfullscreen=''></iframe></center>");
    }
    //상품명에 거실이 들어갔을 경우 거실등 설치영상 노출
    if($("#chkPrdNm").html().indexOf("거실") > -1){
        $("#installGuideVideo").html("<iframe width='100%' height='600' src='https://www.youtube.com/embed/4Ol9EJMVG6g?rel=0' frameborder='0' allwfullscreen=''></iframe>");
    }
    //상품명에 방등이 들어갔을 경우 방ㄷ 설치영상 노출
    if($("#chkPrdNm").html().indexOf("방등") > -1){
        $("#installGuideVideo").html("<iframe width='100%' height='600' src='https://www.youtube.com/embed/RMGJBYllnX4?rel=0' frameborder='0' allwfullscreen=''></iframe>");
    }
    
});

function cart_custom(){
  alert(document.getElementsByName("option1").length);
  if(document.getElementsByName("option1").length ==0){
    category_add_basket('{$product_no}','1','{$display_group}','A0000', false, '1','{$product_code}', 'A', 'F', '0');
  }else{
    alert('{$action_basket}');
  }
}


var PARENT = '';

var OPEN_REVIEW = '';

var REVIEW = {
    getReadData : function(obj, eType)
    {
        if (obj != undefined) {
            PARENT = obj;
            var sHref = obj.attr('href');
            var pNode = obj.parents('tr');
            var pass_check = '&pass_check=F';
        } else {
            var sHref = PARENT.attr('href');
            var pNode = PARENT.parents('tr');
            var pass_check = '&pass_check=T';
        }

        var sQuery = sHref.split('?');

        var sQueryNo = sQuery[1].split('=');
        if (OPEN_REVIEW == sQueryNo[1]) {
            $('#product-review-read').remove();
            OPEN_REVIEW = '';
            return false;
        } else {
            OPEN_REVIEW = sQueryNo[1];
        }

        $.ajax({
            url : '/exec/front/board/product/4?'+sQuery[1]+pass_check,
            dataType: 'json',
            success: function(data) {
                $('#product-review-read').remove();

                var sPath = document.location.pathname;
                var sPattern = /^\/product\/(.+)\/([0-9]+)(\/.*)/;
                var aMatchResult = sPath.match(sPattern);

                if (aMatchResult) {
                    var iProductNo = aMatchResult[2];
                } else {
                    var iProductNo = getQueryString('product_no');
                }

                var aHtml = [];

                //읽기 권한 체크
                if (false === data.read_auth && eType == undefined) {
                    alert(decodeURIComponent(data.alertMSG));

                    //로그인페이지 이동
                    if (data.returnUrl != undefined) {
                        location.replace("/member/login.html?returnUrl=" + data.returnUrl);
                    }
                    return false;
                }

                if (data.is_secret == true) {
                    // 비밀글 비밀번호 입력 폼
                    aHtml.push('<form name="SecretForm_4" id="SecretForm_4">');
                    aHtml.push('<input type="text" name="a" style="display:none;">');
                    aHtml.push('<div class="view"><p>비밀번호 <input type="password" id="secure_password" name="secure_password" onkeydown="if (event.keyCode == 13) '+data.action_pass_submit+'"> <input type="button" value="확인" onclick="'+data.action_pass_submit+'"></p></div>');
                    aHtml.push('</form>');
                } else {
                    // 글 내용
                    if (data.read['content_image'] != null) {
                        var sImg = data.read['content_image'];
                    } else {
                        var sImg = '';
                    }

                    aHtml.push('<div class="view">');
                    aHtml.push('<p>'+data.read['content']+'</p>');
                    aHtml.push('<p>'+sImg+'</p>');
                    aHtml.push('<p class="ec-base-button"><span class="gLeft">');
                    if (data.write_auth == true) {
                        aHtml.push('<a href="/board/product/modify.html?board_act=edit&no='+data.no+'&board_no=4&link_product_no='+iProductNo+'"><img src="http://img.echosting.cafe24.com/skin/base_ko_KR/product/btn_board_modify.gif" alt="게시글 수정하기" /></a>');
                    }
                    aHtml.push('</span></p>');
                    aHtml.push('</div>');

                    // 댓글리스트
                    if (data.comment != undefined && data.comment.length != undefined) {
                        aHtml.push('<ul class="boardComment">');
                        for (var i=0; data.comment.length > i; i++) {
                            //댓글리스트
                            if (data.comment[i]['comment_reply_css'] == undefined) {
                                aHtml.push('<li>');
                                aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                aHtml.push('<span class="grade '+data.use_point+'"><img src="http://img.echosting.cafe24.com/skin/base_ko_KR/board/ico_point'+data.comment[i]['comment_point_count']+'.gif" alt="'+data.comment[i]['comment_point_count']+'점" /></span>');
                                if (data.comment[i]['comment_reply_display'] == true) {
                                    aHtml.push('<span class="button">'+'<a href="#none" onclick="'+data.comment[i]['action_comment_reply']+'"><img src="http://img.echosting.cafe24.com/skin/base_ko_KR/board/btn_ico_reply.gif" alt="댓글" /></a>'+'</span>');
                                }
                                aHtml.push('<p class="comment">'+data.comment[i]['comment_icon_lock']+' '+data.comment[i]['comment_content']+'</p>');
                                aHtml.push('</li>');
                            } else {
                                //댓글의 댓글리스트
                                aHtml.push('<li class="replyArea">');
                                aHtml.push('<strong class="name">'+data.comment[i]['member_icon']+' '+data.comment[i]['comment_name']+'</strong>');
                                aHtml.push('<span class="date">'+data.comment[i]['comment_write_date']+'</span>');
                                aHtml.push('<p class="comment">'+data.comment[i]['comment_icon_lock']+' '+data.comment[i]['comment_content']+'</p>');
                                aHtml.push('</li>');
                            }
                        }
                        aHtml.push('</ul>');
                    }

                    // 댓글쓰기
                    if (data.comment_write != undefined) {
                        aHtml.push('<form name="commentWriteForm_4'+data.key+'" id="commentWriteForm_4'+data.key+'">');
                        aHtml.push('<div class="memoCont">');
                        aHtml.push('<div class="writer">');
                        aHtml.push('<p class="user"><span class="nameArea">이름 '+data.comment_write['comment_name']+' 비밀번호 '+data.comment_write['comment_password']);
                        if (data.comment_write['comment_secret_display'] == true) {
                            aHtml.push('<label class="secret">'+data.comment_write['secure']+' 비밀댓글</label>');
                        }
                        aHtml.push('</span>');
                        aHtml.push(''+data.comment_write['comment']+'<a href="#none" onclick="'+data.comment_write['action_comment_insert']+'"><img src="http://img.echosting.cafe24.com/skin/base_ko_KR/board/btn_comment_submit.gif" alt="확인" /></a></p>');
                        aHtml.push('<p class="rating '+data.comment_write['use_point']+'">'+data.comment_write['comment_point']+'</p>');
                        aHtml.push('<p class="text '+data.comment_write['use_comment_size']+'">'+data.comment_write['comment_byte']+' / '+data.comment_write['comment_size']+' byte</p>');
                        aHtml.push('<p class="captcha '+data.comment_write['use_captcha']+'">'+data.comment_write['captcha_image']+data.comment_write['captcha_refresh']+data.comment_write['captcha']+'<img src="http://img.echosting.cafe24.com/skin/base/common/ico_info.gif" alt="" /> 왼쪽의 문자를 공백없이 입력하세요.(대소문자구분)</p>');
                        aHtml.push('</div>');
                        aHtml.push('</div>');
                        aHtml.push('</form>');
                    }

                    // 댓글의 댓글쓰기
                    if (data.comment_reply != undefined) {
                        aHtml.push('<form name="commentReplyWriteForm_4'+data.key+'" id="commentReplyWriteForm_4'+data.key+'" style="display:none">');
                        aHtml.push('<div class="memoCont reply">');
                        aHtml.push('<div class="writer">');
                        aHtml.push('<p class="user"><span class="nameArea">이름 '+data.comment_reply['comment_name']+' 비밀번호 '+data.comment_reply['comment_password']);
                        if (data.comment_reply['comment_secret_display'] == true) {
                            aHtml.push('<label class="secret">'+data.comment_reply['secure']+' 비밀댓글</label>');
                        }
                        aHtml.push('</span>');
                        aHtml.push(''+data.comment_reply['comment']+'<a href="#none" onclick="'+data.comment_reply['action_comment_insert']+'"><img src="http://img.echosting.cafe24.com/skin/base_ko_KR/board/btn_comment_submit.gif" alt="확인" /></a></p>');
                        aHtml.push('<p class="text '+data.comment_reply['use_comment_size']+'">'+data.comment_reply['comment_byte']+' / '+data.comment_reply['comment_size']+' byte</p>');
                        aHtml.push('<p class="captcha '+data.comment_reply['use_captcha']+'">'+data.comment_reply['captcha_image']+data.comment_write['captcha_refresh']+data.comment_reply['captcha']+'<img src="http://img.echosting.cafe24.com/skin/base/common/ico_info.gif" alt="" /> 왼쪽의 문자를 공백없이 입력하세요.(대소문자구분)</p>');
                        aHtml.push('</div>');
                        aHtml.push('</div>');
                        aHtml.push('</form>');
                    }
                    // 비밀댓글 확인
                    if (data.comment_secret != undefined) {
                        aHtml.push('<form name="commentSecretForm_4'+data.key+'" id="commentSecretForm_4'+data.key+'" style="display:none">');
                        aHtml.push('<div class="commentSecret">');
                        aHtml.push('<p>비밀번호 : '+data.comment_secret['secure_password']);
                        aHtml.push(' <a href="#none" onclick="'+data.comment_secret['action_secret_submit']+'"><img src="http://img.echosting.cafe24.com/skin/base_ko_KR/board/btn_ico_submit.gif" alt="확인" /></a>');
                        aHtml.push(' <a href="#none" onclick="'+data.comment_secret['action_secret_cancel']+'"><img src="http://img.echosting.cafe24.com/skin/base_ko_KR/board/btn_ico_cancel.gif" alt="취소" /></a></p>');
                        aHtml.push('</div>');
                        aHtml.push('</form>');
                    }
                }

                $(pNode).after('<tr id="product-review-read'+data.key+'"><td colspan="6">'+aHtml.join('')+'</td></tr>');

                // 평점기능 사용안함일 경우 보여지는 td를 조절하기 위한 함수
                PRODUCT_COMMENT.comment_colspan(pNode);

                if (data.comment_write != undefined && data.comment_write['use_comment_size'] == '') PRODUCT_COMMENT.comment_byte(4, data.key);
                if (data.comment_reply != undefined && data.comment_write['use_comment_size'] == '') PRODUCT_COMMENT.comment_byte(4, data.key, 'commentReplyWriteForm');
            }
        });
    },

    END : function() {}
};