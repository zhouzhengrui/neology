// iOS
if (navigator.userAgent.match(/(iPhone|iPad|iPod|iOS)/i)) {
    document.querySelector('html').className = 'ios';

    // iOS 8+
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
        version = parseInt(v[1], 10);
    if (version >= 8) {
        document.querySelector('html').className += ' '+'ios-8';
    }
}

// Android
if (navigator.userAgent.match(/(android)/i)) {
    document.querySelector('html').className = 'android';
}
