var Category = function(data) {
    this.title = data.title;
    this.elementId = data.elementId;
    this.selectorId = '#' + data.elementId;
    this.closeElementId = data.closeElementId;
    this.closeSelectorId = data.closeSelectorId;
    this.newsElementId = data.newsElementId;
    this.newsSelectorId = data.newsSelectorId;
};

Category.prototype.genHtml = function() {
    var htmlString = '<div class="category" id="' + this.elementId + '">';
    htmlString += '<span>' + this.title + '</span>';
    htmlString += '<span class="close" id="' + this.closeElementId + '">X</span></div>';
    htmlString +='<div id="' + this.newsElementId + '"></div>';
    return htmlString;
};

var genCategories = function() {
    var categories = [];
    var mammal = new Category({
        title: 'Mammal',
        elementId: 'mammal',
        closeElementId: 'mammalclose',
        closeSelectorId: '#mammalclose',
        newsElementId: 'mammalnews',
        newsSelectorId: '#mammalnews'
    });
    categories.push(mammal);
    var bird = new Category({
        title: 'Bird',
        elementId: 'bird',
        closeElementId: 'birdclose',
        closeSelectorId: '#birdclose',
        newsElementId: 'birdnews',
        newsSelectorId: '#birdnews'
    });
    categories.push(bird);
    var reptile = new Category({
        title: 'Reptile',
        elementId: 'reptile',
        closeElementId: 'reptileclose',
        closeSelectorId: '#reptileclose',
        newsElementId: 'reptilenews',
        newsSelectorId: '#reptilenews'
    });
    categories.push(reptile);
    var fish = new Category({
        title: 'Fish',
        elementId: 'fish',
        closeElementId: 'fishclose',
        closeSelectorId: '#fishclose',
        newsElementId: 'fishnews',
        newsSelectorId: '#fishnews'
    });
    categories.push(fish);
    var amphibian = new Category({
        title: 'Amphibian',
        elementId: 'amphibian',
        closeElementId: 'amphibianclose',
        closeSelectorId: '#amphibianclose',
        newsElementId: 'amphibiannews',
        newsSelectorId: '#amphibiannews'
    });
    categories.push(amphibian);
    var insect = new Category({
        title: 'Insect',
        elementId: 'insect',
        closeElementId: 'insectclose',
        closeSelectorId: '#insectclose',
        newsElementId: 'insectnews',
        newsSelectorId: '#insectnews'
    });
    categories.push(insect);
    return categories;
};

var setUp = function() {
    var categories = genCategories();
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        $('body').append(category.genHtml());
        $(category.closeSelectorId).click({newsSelectorId: category.newsSelectorId}, function(event) {
            var newsSelectorId = event.data.newsSelectorId;
            $(this).css('visibility','hidden');
            $(newsSelectorId).slideUp('slow');
            $(newsSelectorId).empty();
        });
        $(category.selectorId).click({
            title: category.title,
            closeSelectorId: category.closeSelectorId,
            newsSelectorId: category.newsSelectorId
        }, function(event) {
            var title = event.data.title;
            var closeSelectorId = event.data.closeSelectorId;
            var newsSelectorId = event.data.newsSelectorId;            
            if ( $(newsSelectorId).css('display') === 'none' ) {
                $.ajax({
                    url: "http://content.guardianapis.com/search?q=" + title + "&order-by=relevance&page-size=50&show-fields=thumbnail%2Cbyline&show-blocks=body&api-key=2700505f-b667-4f0a-adc0-b024f02abe57",
                    success: function(data) {
                        if (data.response.status !== "ok") {
                            $('body').append('<p id="msg">*** Issue with response from Guardian ***</p>');
                        } else {
                            for (var i = 0; i < data.response.results.length && i < 10; i++ ) {
                                var result = data.response.results[i];
                                if ( result.type === 'article') {
                                    var thumbnail = result.fields.thumbnail;
                                    $(newsSelectorId).append('<img src="' + thumbnail + '"/>');
                                    var title = result.webTitle;
                                    $(newsSelectorId).append('<h2>' + title + '</h2>');
                                    var byLine = result.fields.byline;
                                    $(newsSelectorId).append('<h3>' + byLine + '</h3>');
                                    var summary = result.blocks.body[0].bodyTextSummary.substring(0,400);
                                    $(newsSelectorId).append('<p>' + summary + ' ...</p>');
                                    var articleUrl = result.webUrl;
                                    $(newsSelectorId).append('<a href="' + articleUrl + '">Full Article</a>');
                                }
                            }
                            $(newsSelectorId).css('display','block');
                            $(closeSelectorId).css('visibility','visible');
                        }
                    }
                });
            }
        });        
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