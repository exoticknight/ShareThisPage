(function( window, document, undefined ) {

var $ = function( id ) {return document.querySelector( id );},
    $$ = function( id ) {return document.querySelectorAll( id );},
    urlTemplate = {
        'qzone': 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?showcount=1&url={url}&desc={desc}&summary={summary}&title={title}&site={title}&pics={pics}&style=201&width=113&height=39',
        'tencent': 'http://v.t.qq.com/share/share.php?title={title}&url={url}&site={url}',
        'sina': 'http://v.t.sina.com.cn/share/share.php?title={title}&url={url}',
        'netease': 'http://t.163.com/article/user/checkLogin.do?link={url}&source={source}&info={title}%20{url}&images=&togImg=true',
        'sohu': 'http://t.sohu.com/third/post.jsp?url={url}&title={title}&content={desc}',
        'twitter': 'https://twitter.com/intent/tweet?text={title} {url}&source=webclient',
        'facebook': 'https://www.facebook.com/share.php?u={url}',
        'plurk': 'http://www.plurk.com/?qualifier=shares&status={title} {url}'
    },
    SITE_INFORMATION = {};

'url title desc summary pics source'.split( ' ' ).forEach(function ( e, i ) {
    SITE_INFORMATION[e] = '';
});


var shareThisPage = function( name ) {
    // var url = templateString, url, re, field;
    var template = simpleTemplate( urlTemplate[name] ),
        url;

    // update SITE_INFORMATION from custom field
    Array.prototype.forEach.call(
        $$( 'input' ),
        function( e, i ) {
            SITE_INFORMATION[e.getAttribute( 'name' ).toString()] = encodeURIComponent( e.value ) || '';
        }
    );
    // special treat for textarea
    SITE_INFORMATION['summary'] = encodeURIComponent( $( '[name="summary"]' ).value );
    SITE_INFORMATION['desc'] = encodeURIComponent( $( '[name="desc"]' ).value );

    // // format url
    // for ( field in  SITE_INFORMATION ) {
    //     re = new RegExp( '\{' + field + '\}', 'g' );
    //     url = url.replace( re, encodeURIComponent( SITE_INFORMATION[field] ) || '' );
    // }

    // // clear undefined field
    // url = url.replace( /\{[^\}]*\}/g, '');

    url = template.fill( SITE_INFORMATION ).render();

    console.log(url);

    //chrome.windows.create( {'url': url, 'type': 'newwindow' };
    window.open( url, "newwindow", "height=600, width=630, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no" );
    return false;
}

// initialize global data
chrome.tabs.query( { 'active': true, 'highlighted': true }, function( tabs ) {
    if ( tabs.length > 0 ) {
        SITE_INFORMATION['url'] = tabs[0].url;
        SITE_INFORMATION['title'] = tabs[0].title;
    }

    // fill form with global data
    Array.prototype.forEach.call(
        $$( 'input' ),
        function( e, i ) {
            e.value = SITE_INFORMATION[e.getAttribute( 'name' )] || '';
        }
    );
    // special treat for textarea
    $( '[name="summary"]' ).value = SITE_INFORMATION['summary'] || '';
    $( '[name="desc"]' ).value = SITE_INFORMATION['desc'] || '';
});

// bind event listener for every button
Array.prototype.forEach.call(
    $$( '.share-btn' ),
    function( e, i ) {
        e.addEventListener( 'click', function(){ shareThisPage( e.dataset['name'] ) } , false);
    }
);

// export
window.shareThisPage = shareThisPage;
})( window, document )