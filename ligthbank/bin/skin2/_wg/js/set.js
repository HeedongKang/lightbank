!(function(){
    var v={};
    var a={};
    var p={};

    

/*****************************************************************************************************************************************************

    ### 쇼핑몰 기본정보 설정 ###

    ? 수정전 반드시 백업 또는 스킨 복사를 해두시기 바랍니다.
    ? 아래의 내용만 수정하시기 바랍니다.

*****************************************************************************************************************************************************/
    
    
    // 운영시간
    v.time1 = "오전 10:00 ~ 오후 06:00 (토요일 오후03:00)"; //평일
    v.time2 = "오후 12:00 ~ 오후 01:00"; //점심
    v.time3 = "일 / 공휴일은 휴무"; //휴무
    
    
    
    // 은행정보 ( 사용안하실 경우 29번째줄처럼 처리해주세요 )
    v.bank11 = "농협은행"; v.bank12 = "352-0838-9306-13";
    v.bank21 = ""; v.bank22 = "";
    v.bank31 = ""; v.bank32 = "";
    v.bank41 = ""; v.bank42 = "";
    v.bankName = "조명뱅크(김남성)"; //예금주
    
    
 
    // 배송조회
    v.tracking1 = "CJ택배 (TEL:1588-1255)";
    a.tracking2 = "https://www.doortodoor.co.kr/";
    v.tracking3 = "배송정보는 해당 택배사를 통해 조회가 가능하십니다.";
    
    
    
    // 반품배송지
    v.returnAdd1 = "경기 고양시 일산동구 장항동 (멱절길 366-112)";
    v.returnAdd2 = "공지사항 및 이용안내를 참고하셔서 지정택배사로 반품요청해주세요.";
    
    
    
    // 에스크로
    v.escrow1 = "NHN KCP";
    p.escrow2 = "http://www.kcp.co.kr/"; //해당 카드사에서 제공하는 링크를 넣어주세요.
    
    
    
    // 멤버쉽가이드
    v.member1 = "70/150/300만원 이상시 적용";
    v.member2 = "10만원 이상 구매시 5~10%할인";
    
    
    
    // 카드이벤트
    v.card1 = "5만원이상 결제시 2 ~ 3개월 무이자할부";
    v.card2 = "부문 무이자할부, 사전ARS할부 등";
    
    

    // 네이버톡톡
    // https://partner.talk.naver.com/ 에서 가입해주시고, 가입후 계정관리에 들어가보시면 [ talk.naver.com/코드 ] 확인이 가능하십니다.
    // 아래의 http://... 라고 기재된 곳의 코드를 교체해주시면 되겠습니다. */
    p.naverTalk = "http://talk.naver.com/WC5PIH";


    
    // 옐로우아이디
    // https://yellowid.kakao.com/ 에서 가입해주시고, 가입하신 [ @샵아이디 ] 를 아래의 2곳의 @디자인웹굿 -> @고객님아이디 로 교체해주시면 되겠습니다. */
    v.YellowID = "@고객님아이디";
    p.YellowID = "http://plus.kakao.com/home/@고객님아이디";

    
    
    
    
    
    
    
    
    
    
    







    
    
    
    
    
    
    

    
    /*****************************************************************************************************************************************************/

    //수정금지
    function DB_winOpen(_url,_win,_width,_height){
        window.open(_url,_win,'width='+_width+',height='+_height+',scrollbars=auto');
    };
    for(key in v){$('.v_'+key).text(eval('v.'+key));};
    for(key in a){$('.a_'+key).attr('href',eval('a.'+key));};
    for(key in p){       
        try{
	    	$('.p_'+key).attr('data-popup',$('.p_'+key).attr('data-popup').replace('link',eval('p.'+key)));
	        
	        $('.p_'+key).bind('click',function(){
	            var attr=$(this).attr('data-popup').split(',');
	            DB_winOpen(attr[0],attr[1],attr[2],attr[3]);
	        });  
        }catch(e){}
    };
})();