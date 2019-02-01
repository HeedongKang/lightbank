$(document).ready(function(){

    var reviewer = ($.CAFE24_SDK_REVIEWER_UP) ? $.CAFE24_SDK_REVIEWER_UP.skin.shift() : false;
    //console.log($.CAFE24_SDK_REVIEWER_UP, reviewer, 1);
    var rowData = {};
    var modeSet = ["img", "text", "all"];
    
    var gpage = 1;
    var gtotalpage
    var gpno;
    var glimit;
    var gtype;
    var guse_point;
    var config;
    var gdetail;
    var detailImgs = {};
    var curruntGall;
    var curruntGallInx;
    var sort;
    init();
    
    function init()
    {
        if (reviewer && reviewer.data.length > 0) {
            
            gtotalpage = reviewer.total_page;
            gpno = reviewer.pno;
            glimit = reviewer.cnt;
            gtype = reviewer.type;
            gdetail = reviewer.detail;
            guse_point = reviewer.config.use_point;
            config = reviewer.config;
            sort = reviewer.sort;

            initData();
            setEvt();
            $(".photoreview-list li:first-child").addClass('selected');
            var firstShow = reviewer.data[0];
            if (firstShow) {
                showDetail(firstShow.no);
            }
        } else {
            var row = {no:'#', pname:'리뷰가 없습니다.', pprice:' ', pno:' ', rpoint:5, rwriter:'', rdate:'', rhit:''};
            var tmpl = makeCell(row);
            $(".photoreview-list").html(tmpl);
            $(".photoreview-list li img").hide();
            $(".photoreview-image img").hide();
            $(".xans-photoreview-display .is_rating").hide();
        }
        
        $(".xans-photoreview-display .inner").show();
        $(".xans-photoreview-display .photoreview-detail").show();
    }
    
    function initData()
    {
        hideElem();
        if (reviewer.data && reviewer.data.length > 0) {
            for (var i=0; i<reviewer.data.length; i++) {
                var row = reviewer.data[i];
                row.index = i;
                
                if (typeof row.rcont == 'string') {
                    row.rcont = row.rcont.replace(/<p[^>]*>/g,'').replace(/<\/p>/g,'<br/>');
                }
                rowData[row.no] = row; 
            }
        }
    }
    
    function setEvt()
    {
        $(document).delegate(".photoreview-list .image", 'click',function(e){
            e.preventDefault();
            var no = $(this).attr('rel');
            showDetail(no);
        });
        
        $(".photoreview-image .prev").click(function(e){
            e.preventDefault();
            if (curruntGall && curruntGall.length > 0 && curruntGallInx > 0) {
                curruntGallInx--;
                var img_src = curruntGall[curruntGallInx];
                $(".photoreview-image img").attr("src", img_src);
                setGalleryBtn();
            }
        });
        
        $(".photoreview-image .next").click(function(e){
            e.preventDefault();
            if (curruntGall && curruntGall.length > 0 && curruntGallInx < curruntGall.length-1) {
                curruntGallInx++;
                var img_src = curruntGall[curruntGallInx];
                $(".photoreview-image img").attr("src", img_src);
                setGalleryBtn();
            }
        });
        
        $(document).delegate(".photoreview_skin1 .photoreview-paging a", "click", function(e){
            e.preventDefault();
            var page = $(this).attr("href");
            if (page) {
                page = page.substr(page.lastIndexOf('/') + 1);
                if (!isNaN(page)) {
                    $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:page, cnt:glimit, type:gtype, point:guse_point, config: config, paging_cnt:5, sort:sort}, page_refresh);
                }
            }
        });
        
        $(".xans-photoreview-display .inner .photoreview-paging .next").click(function(e){
            e.preventDefault();
            var tpage = gpage + 1;
            if (tpage > 0 && tpage <= gtotalpage) {
                $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:tpage, cnt:glimit, type:gtype, config: config, paging_cnt:5, sort:sort}, page_refresh);
            } else {
                alert("마지막 페이지 입니다.");
            }
        });
        
        $(".xans-photoreview-display .inner .photoreview-paging .prev").click(function(e){
            e.preventDefault();
            var tpage = gpage - 1;
            if (tpage > 0 && tpage <= gtotalpage) {
                $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:tpage, cnt:glimit, type:gtype, config: config, paging_cnt:5, sort:sort}, page_refresh);
            } else {
                alert("첫 페이지 입니다.");
            }
        });
    }
    
    function page_refresh(list)
    {
        reviewer = list;
        initData();
        
        var data = list.data;
        if (data && data.length > 0) {
            $(".photoreview-list").html('');
            for(var i=0; i<data.length; i++) {
                var cell = makeCell(data[i]);
                if (cell) {
                    $(".photoreview-list").append(cell);
                }
            }
            
            if (typeof list.pagination == "string") {
                $(".photoreview_skin1 .photoreview-paging").html(list.pagination);
            }
            
            gpage = reviewer.page;
            $(".photoreview-list li:first-child a").trigger('click');
            hideElem();
        }
    }
   
    function showDetail(no)
    {
        if (rowData[no]) {
            $(".photoreview-list li").removeClass('selected');
            $(".photoreview-list li a[rel="+no+"]").parent().addClass('selected');
            
            var row = rowData[no];
            if (row) {
                curruntGall = makeImgTags(row);
                curruntGallInx = 0;
                if (curruntGall.length > 0) {
                    $(".photoreview-image img").attr("src", curruntGall[0]);
                } else {
                    $(".photoreview-image img").hide();
                }
                
                setGalleryBtn();

                $(".photoreview-detail .subject span").html(row.rsub);
                $(".photoreview-detail .content").html(row.rcont);
                
                
                //조회수
                //$.ajax({type:"GET",url:"/apps/photoreview/photodetail.xml?no="+row.rno,success:function(data){}});
            }
        }
    }
    
    function setGalleryBtn()
    {
        if (curruntGallInx < 1) {
            $(".photoreview-image .prev").addClass('disabled');
        } else {
            $(".photoreview-image .prev").removeClass('disabled');
        }
        
        if (curruntGallInx+1 >= curruntGall.length) {
            $(".photoreview-image .next").addClass('disabled');
        } else {
            $(".photoreview-image .next").removeClass('disabled');
        }
        
        if (curruntGall.length > 0) {
            $(".photoreview-image .current").html(curruntGallInx+1);
            $(".photoreview-image .total").html(curruntGall.length);
        } else {
            $(".photoreview-image .current").html('');
            $(".photoreview-image .total").html('');
        }
        
    }
    
    function makeImgTags(row)
    {
        if (detailImgs[row.rno]) {
            return detailImgs[row.rno];
        }
        
        var imgs = [];
        if (row.rhimg && (/^.*\.(jpg|jpeg|png|gif|bmp)$/i).test(row.rhimg)) {
            imgs.push(row.rhimg);
        }
        
        if (row.attach && row.attach.length > 0) {
            for (var i=0; i<row.attach.length; i++) {
                var att_img = row.attach[i];
                if (typeof att_img.att_path == "string" && (/^.*\.(jpg|jpeg|png|gif|bmp)$/i).test(att_img.att_path)) {
                    imgs.push(att_img.att_path);
                }
            }
        }
        detailImgs[row.rno] = imgs;
        return detailImgs[row.rno];
    }

    function makeCell(c)
    {
        var tmpl = [];
        tmpl.push('<li>');
        tmpl.push('<a href="" class="image" rel="'+c.no+'"><img src="'+c.rimg+'" alt="" /></a>');
        if (c.pno && c.pname && c.pprice) {
            var url = (c.pno == ' ') ? '#' : '/surl/P/'+c.pno;
            tmpl.push('<p class="subject is_detail"><a href="'+url+'">'+c.pname+'</a> '+c.pprice+'</p>');
        } else {
            tmpl.push('<p class="subject is_detail"></p>');
        }
        tmpl.push('<p class="star"><img src="//img.echosting.cafe24.com/apps/photo-review/skin2/ico_star'+c.rpoint+'.png" alt="'+c.rpoint+' Point" class="is_rating"/><strong>'+c.rwriter+'</strong></p>');
        tmpl.push('<em>'+c.rdate+'</em>');
        tmpl.push('</li>');
        return tmpl.join('');
    }
    
    function hideElem()
    {
        if (gdetail == true) {
            $(".xans-photoreview-display .is_detail").remove();
        }
        
        if (guse_point !== true) {
            $(".xans-photoreview-display .is_rating").remove();
        }
    }
});