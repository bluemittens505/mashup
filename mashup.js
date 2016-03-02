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
    var htmlString = '<div class="category">';
    htmlString += '<span class="open" id="' + this.elementId + '">' + this.title + '</span>';
    htmlString += '<span class="close" id="' + this.closeElementId + '">X</span></div>';
    htmlString +='<section id="' + this.newsElementId + '"></section>';
    return htmlString;
};

var ArticleDate = function(dateString) {
    this.date = new Date(dateString)
};

ArticleDate.prototype.toArticleDateString = function() {
    return((this.date.getMonth() + 1) + '/' + this.date.getDate() + '/' + this.date.getFullYear());
};

var Article = function(article) {
    this.article = article;
};

Article.prototype.valid = function() {
    return (this.article.fields !== undefined && this.article.fields.thumbnail !== undefined);
};

Article.prototype.byLine = function() {
    var byLine = this.article.fields.byline;
    if ( byLine === undefined ) {
        byLine = 'theguardian.com';
    }
    return byLine;
};

Article.prototype.articleDate = function() {
    var articleDate = new ArticleDate(this.article.webPublicationDate);
    return articleDate.toArticleDateString();
};

Article.prototype.summary = function() {
    var summary = this.article.blocks.body[0].bodyTextSummary.substring(0,415);
    // assumes there is a blank
    return summary.substring(0,summary.lastIndexOf(' '));
};

Article.prototype.genHtml = function() {
    var htmlString = '<article>';
    htmlString += '<h2>' + this.article.webTitle + '</h2>';
    htmlString += '<h3>' + this.byLine() + '</h3><div class="separator"></div>';
    htmlString += '<h3>' + this.articleDate() + '</h3>';
    htmlString += '<div class="clear"><img src="' + this.article.fields.thumbnail + '"/>';
    htmlString += '<p>' + this.summary() + ' ...';
    htmlString += '<a href="' + this.article.webUrl + '">Read the full article</a></p></div>';
    htmlString += '</article>';
    return htmlString;
};

var displayNews = function(event,data) {
    var count = 0;
    for (var i = 0; i < data.response.results.length && count < 10; i++ ) {
        switch (data.response.results[i].type) {
            case 'article':
                var article = new Article(data.response.results[i]);
                if ( article.valid() ) {
                    count++;
                    $(event.data.newsSelectorId).append(article.genHtml());
                }
                break;
            // add cases for other types
        }
    }
    $(event.data.newsSelectorId).css('display','block');
    $(event.data.closeSelectorId).css('visibility','visible');
};

var displayErrMsg = function() {
    $('#msg').remove();
    $('body').append('<p id="msg">*** Issue with response ***</p>');
};

var openHandler = function(event) {
    if ( $(event.data.newsSelectorId).css('display') === 'none' ) {
        $.ajax({
            url: event.data.url,
            success: function(data) {
                if (data.response.status === "ok") {
                    displayNews(event,data);
                } else {
                    displayErrMsg();
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
    var categories = [
        'Mammal','Bird','Reptile','Fish','Amphibian','Insect','Worm','Crustacean','Coral','Protozoan','Dinosaur'
    ];
    for (var i = 0; i < categories.length; i++) {
        var category = new Category(categories[i]);
        $('main').append(category.genHtml());
        $(category.selectorId).click(category,openHandler);
        $(category.closeSelectorId).click(category,closeHandler);
    }
};

$(document).ready(function() {
    setUp();
});
