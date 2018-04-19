var userFeed = new Instafeed({
    
    
    
    /****************************************** 해당 부분만 수정 ******************************************/
    
	userId: '7383387152',
    accessToken: '7383387152.351f038.aa1ec98a91fc4b198c8e9a4dfe73e154',
    
    /****************************************** 해당 부분만 수정 ******************************************/
    

    
    get: 'user',
    sortBy: "most-recent",
    limit: 10,
    template: '<div class="post"><div class="thumb"><a class="animation" href="{{link}}" target="_blank"><img src="{{image}}" /></div><div class="tit">{{caption}}</div></div>',
});
userFeed.run();