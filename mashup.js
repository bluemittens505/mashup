// Leave this in so, I can cut and past the URL to the browse
// http://content.guardianapis.com/search?q=Mammal&order-by=relevance&page-size=50&show-fields=thumbnail%2Cbyline&show-blocks=body&api-key=2700505f-b667-4f0a-adc0-b024f02abe57

var Url = function(title) {
    this.endpoint = 'http://content.guardianapis.com/search';
    this.query = 'q=' + title;
    this.orderBy = 'order-by=relevance';
    this.pageSize = 'page-size=50';
    this.showFields = 'show-fields=' + escape('thumbnail,byline');
    this.showBlocks = 'show-blocks=body';
    this.apiKey = 'api-key=2700505f-b667-4f0a-adc0-b024f02abe57';
};

Url.prototype.fullUrl = function() {
    var url = this.endpoint + '?' + this.query + '&' + this.orderBy + '&' + this.pageSize;
    url += '&' + this.showFields + '&' + this.showBlocks + '&' + this.apiKey;
    return url;
};

var Category = function(title) {
    this.title = title;
    this.elementId = title.toLowerCase();
    this.selectorId = '#' + this.elementId;
    this.newsElementId = this.elementId + 'news';
    this.newsSelectorId = '#' + this.newsElementId;
    this.closeElementId = this.elementId + 'close';
    this.closeSelectorId = '#' + this.closeElementId;
    var url = new Url(title);
    this.url = url.fullUrl();
};

Category.prototype.genHtml = function() {
    var htmlString = '<div class="category" id="' + this.elementId + '">';
    htmlString += '<span>' + this.title + '</span>';
    htmlString += '<span class="close" id="' + this.closeElementId + '">X</span></div>';
    htmlString +='<div id="' + this.newsElementId + '"></div>';
    return htmlString;
};

var displayErrMsg = function() {
    $('#msg').remove();
    $('body').append('<p id="msg">*** Issue with response ***</p>');
};

var validArticle = function(article) {
    return (article.fields !== undefined && article.fields.thumbnail !== undefined);
};

var displayArticle = function(event,article) {
    var newsSelectorId = event.data.newsSelectorId;
    var thumbnail = article.fields.thumbnail;
    $(newsSelectorId).append('<img src="' + thumbnail + '"/>');
    var articleTitle = article.webTitle;
    $(newsSelectorId).append('<h2>' + articleTitle + '</h2>');
    var byLine = article.fields.byline;
    $(newsSelectorId).append('<h3>' + byLine + '</h3>');
    var summary = article.blocks.body[0].bodyTextSummary.substring(0,400);
    $(newsSelectorId).append('<p>' + summary + ' ...</p>');
    var articleUrl = article.webUrl;
    $(newsSelectorId).append('<a href="' + articleUrl + '">Full Article</a>');
};

var displayNews = function(event,data) {
    var count = 0;
    for (var i = 0; i < data.response.results.length && count < 10; i++ ) {
        switch (data.response.results[i].type) {
            case 'article':
                if ( validArticle(data.response.results[i]) ) {
                    count++;
                    displayArticle(event,data.response.results[i]);
                }
                break;
            // add cases for other types
        }
    }
    $(event.data.newsSelectorId).css('display','block');
    $(event.data.closeSelectorId).css('visibility','visible');
};

var openHandler = function(event) {
    if ( $(event.data.newsSelectorId).css('display') === 'none' ) {
        $.ajax({
            url: event.data.url,
            success: function(data) {
                if (data.response.status !== "ok") {
                    displayErrMsg();
                } else {
                    displayNews(event,data);
                }
            }
        });
    }
};

var closeHandler = function(event) {
    $(this).css('visibility','hidden');
    $(event.data.newsSelectorId).slideUp('slow').empty();
};

var setUp = function() {
    var categories = ['Mammal','Bird','Reptile','Fish','Amphibian','Insect'];
    for (var i = 0; i < categories.length; i++) {
        var category = new Category(categories[i]);
        $('body').append(category.genHtml());
        $(category.selectorId).click(category,openHandler);
        $(category.closeSelectorId).click(category,closeHandler);
    }
};

$(document).ready(function() {
    setUp();
    // $('.category').click(function() {
    //     var display = $('#mammalnews').css('display');
    //     if ( display === 'none' ) {
    //         $.ajax({
    //             url: "http://content.guardianapis.com/search?q=mammal&order-by=relevance&page-size=50&show-fields=thumbnail%2Cbyline&show-blocks=body&api-key=2700505f-b667-4f0a-adc0-b024f02abe57",
    //             success: function(data) {
    //                 if (data.response.status !== "ok") {
    //                     $('body').append('<p id="msg">*** Issue with response from Guardian ***</p>');
    //                 } else {
    //                     for (var i = 0; i < data.response.results.length && i < 10; i++ ) {
    //                         var result = data.response.results[i];
    //                         if ( result.type === 'article') {
    //                             var thumbnail = result.fields.thumbnail;
    //                             $('#mammalnews').append('<img src="' + thumbnail + '"/>');
    //                             var title = result.webTitle;
    //                             $('#mammalnews').append('<h2>' + title + '</h2>');
    //                             var byLine = result.fields.byline;
    //                             $('#mammalnews').append('<h3>' + byLine + '</h3>');
    //                             var summary = result.blocks.body[0].bodyTextSummary.substring(0,400);
    //                             $('#mammalnews').append('<p>' + summary + ' ...</p>');
    //                             var articleUrl = result.webUrl;
    //                             $('#mammalnews').append('<a href="' + articleUrl + '">Full Article</a>');
    //                         }
    //                     }
    //                     $('#mammalnews').css('display','block');
    //                     $('#mammalclose').css('visibility','visible');
    //                 }
    //             }
    //         });
    //     }
    // });
});