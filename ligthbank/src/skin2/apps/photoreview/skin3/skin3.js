$(document).ready(function(){
    
    var reviewer = ($.CAFE24_SDK_REVIEWER_UP) ? $.CAFE24_SDK_REVIEWER_UP.skin.shift() : false;
    //console.log($.CAFE24_SDK_REVIEWER_UP, reviewer, 3);
    var rowData = {};
    var modeSet = ["img", "text", "all"];
    
    var gpage = 1;
    var gtotalpage;
    var gpno;
    var glimit;
    var gtype;
    var gdetail;
    var guse_point;
    var config;
    var sort;
    var moreBtn = $(".preview_table").next(".more");
    var readyFlag = true;
    
    init();
    
    function init()
    {
        if ( reviewer && reviewer.data.length > 0) {
            
            gtotalpage = reviewer.total_page;
            gpno = reviewer.pno;
            glimit = reviewer.cnt;
            gtype = reviewer.type;
            gdetail = reviewer.detail;
            guse_point = reviewer.config.use_point;
            config = reviewer.config;
            sort = reviewer.sort;
            if (moreBtn.length > 0 && gtotalpage > 1) {
                moreBtn.show();
            }
            
            $('.preview_table td img[src=""]').hide();
            initData();
            setEvt();
        } else {
            var cell = {no:'#', rsub:'리뷰가 없습니다.',rpoint:5, rwriter:'', rdate:'', rhit:''};
            var noData = makeCell(cell);
            $(".preview_table tbody").html(noData);

            gdetail = true;
            guse_point = false;
            
            hideElem();
        }

        $(".preview_table tbody").show();
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
        $(document).delegate(".preview_detail", 'click', function(e){
            e.preventDefault();
            var tr = $(this).parent().parent();
            if (tr.hasClass('selected')) {
                $(".preview_table").find("tr").removeClass("selected");
                $(".reviewDetail").hide().remove();
            } else {
                $(".preview_table").find("tr").removeClass("selected");
                $(".reviewDetail").hide().remove();
                
                var tr = $(this).parent().parent();
                var no = $(this).attr("href");
                var rel_no = $(this).attr("rel");
                if (rel_no) {
                    no = rel_no;
                }
                
                showDetail(tr, no);
                tr.addClass('selected');
                $(".reviewDetail").show();
            }
        });
        
        $(".photoreview-outputNumber").change(function(e){
            var val = $(this).val();
            val = parseInt(val, 10);
            if (typeof val == 'number' && val > 0) {
                glimit = val;
                gpage = 1;
                $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:gpage, cnt:glimit, mode:gtype, point:guse_point, config:config, sort:sort}, page_refresh);
            }
        });
        
        $(".photoreview-viewMode").change(function(e){
            var val = $(this).val();
            val = (val == 'txt') ? 'text' : val;
            if ($.inArray(val, modeSet) !== -1) {
                gtype = val;
                gpage = 1;
                $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:gpage, cnt:glimit, mode:gtype, point:guse_point, config:config, sort:sort}, page_refresh);
            }
        });
        
        $(document).delegate(".photoreview_skin3 .photoreview-paging a", "click", function(e){
            e.preventDefault();
            var page = $(this).attr("href");
            if (page) {
                page = parseInt(page, 10);
                if (!isNaN(page)) {
                    $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:page, cnt:glimit, mode:gtype, point:guse_point, config:config, sort:sort}, page_refresh);
                }
            }
        });
        
        //support old version
        moreBtn.find('a').click(function(e){
            e.preventDefault();
            if (gpage >= gtotalpage) {
                moreBtn.hide();
                return false;
            }
            
            if (readyFlag == true) {
                readyFlag = false;
                moreBtn.hide();
                $.CAFE24_SDK_REVIEWER_UP.call_more({act:'getMore',pno:gpno, next:gpage+1, cnt:glimit, mode:gtype, point:guse_point, config:config, sort:sort}, page_refresh_old);
            }
            
        });
    }
    
    function page_refresh(list)
    {
        reviewer = list;
        initData();
        
        var data = list.data;
        if (data && data.length > 0) {
            $(".preview_table tbody").hide().html('');
            for(var i=0; i<data.length; i++) {
                var cell = makeCell(data[i]);
                if (cell) {
                    $(".preview_table tbody").append(cell);
                }
            }
            
            if (typeof list.pagination == "string") {
                $(".photoreview_skin3 .photoreview-paging").html(list.pagination);
            }
            
            hideElem();
            $(".preview_table tbody").show();
            
            gpage = reviewer.page;

            if (gpage >= gtotalpage) {
                moreBtn.hide();
            } else {
                moreBtn.show();
            }
            readyFlag = true;
        }
    }
    
    function page_refresh_old(list)
    {
        reviewer = list;
        initData();
        
        var data = list.data;
        if (data && data.length > 0) {
            for(var i=0; i<data.length; i++) {
                var cell = makeCell(data[i]);
                if (cell) {
                    $(".preview_table tbody").append(cell);
                }
            }
            
            hideElem();
            $(".preview_table tbody").show();
            
            gpage = reviewer.page;
            
            if (gpage >= gtotalpage) {
                moreBtn.hide();
            } else {
                moreBtn.show();
            }
            readyFlag = true;
        }
    }
    
    function showDetail(tr, no)
    {
        if (rowData[no]) {
            var row = rowData[no];
            if (row) {
                var imgs = makeImgTags(row);
                if (typeof imgs == "object" && imgs.length > 0) {
                    var imgs_html = imgs.join('<br/>');
                    var detail = '<tr class="reviewArea reviewDetail"><td colspan="8">'+imgs_html+'<p>'+row.rcont+'</p></td></tr>';
                } else {
                    var detail = '<tr class="reviewArea reviewDetail"><td colspan="8"><p>'+row.rcont+'</p></td></tr>';
                }
                
                detail = $(detail);
                tr.after(detail);

                //조회수
                //$.ajax({type:"GET",url:"/apps/photoreview/photodetail.xml?no="+row.rno,success:function(data){}});
                
                _IE8_width_fix(detail);
            }
        }
    }
    
    function makeImgTags(row)
    {
        var imgs = [];
        if (row.rhimg && (/^.*\.(jpg|jpeg|png|gif|bmp)$/i).test(row.rhimg)) {
            imgs.push('<img src="'+row.rhimg+'" alt="" />');
        }
        
        if (row.attach && row.attach.length > 0) {
            for (var i=0; i<row.attach.length; i++) {
                var att_img = row.attach[i];
                if (typeof att_img.att_path == "string" && (/^.*\.(jpg|jpeg|png|gif|bmp)$/i).test(att_img.att_path)) {
                    imgs.push('<img src="'+att_img.att_path+'" alt="" />');
                }
            }
        }
        return imgs;
    }
    
    function _IE8_width_fix(tr)
    {
        if ($.browser.msie && $.browser.version == 8) {
            $(tr).find("img").each(function(){
                $tr = $(this).closest("tr");
                $(this).hide().load(function(){
                    if (500 <= $(this).width()) {
                        $(this).css({"max-width":"none", "width":"500px", "height":"auto"});
                    }
                    $(this).show();
                });
            });
        }
    }
    
    function hideElem()
    {
        if (gdetail === true) {
            $('.photoreview_skin3 .is_detail').remove();
        }

        if (guse_point !== true) {
            $('.photoreview_skin3 .is_rating').remove();
        }
    }
    
    function makeCell(c)
    {
        var tmpl = [];
        tmpl.push('<tr id="preview'+c.no+'}">');
        tmpl.push('<td >'+c.no+'</td>');
        if (c.pno && c.pimg_tiny && c.pname) {
            tmpl.push('<td class="is_detail"><a href="/surl/P/'+c.pno+'"><img src="'+c.pimg_tiny+'" alt="" class="product" /></a></td>');
            tmpl.push('<td class="product is_detail"><a href="/surl/P/'+c.pno+'">'+c.pname+'</a><br /><strong>'+c.pprice+'</strong></td>');
        } else {
            tmpl.push('<td class="is_detail"></td>');
            tmpl.push('<td class="product is_detail"></td>');
        }
        tmpl.push('<td class="subject"><a class="preview_detail" href="'+c.no+'" rel="'+c.no+'" >'+c.rsub+'</a></td>');
        tmpl.push('<td class="is_rating"><img src="//img.echosting.cafe24.com/apps/photo-review/skin1/ico_star'+c.rpoint+'.png" alt="'+c.rpoint+' Point" /></td>');
        tmpl.push('<td>'+c.rwriter+'</td>');
        tmpl.push('<td class="date">'+c.rdate+'</td>');
        tmpl.push('<td class="count">'+c.rhit+'</td>');
        tmpl.push('</tr>');
        return tmpl.join('');
    }
});