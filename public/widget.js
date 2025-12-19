(function () {
    // Find the script tag that loaded this script to get attributes
    // Find the script tag by its required attribute
    const scriptScript = document.querySelector('script[data-slug]');

    if (!scriptScript) {
        console.error('GeminiChat Widget: script with data-slug attribute not found.');
        return;
    }

    const slug = scriptScript.getAttribute('data-slug');
    // Determine domain from script src to know where the iframe is coming from
    const src = scriptScript.getAttribute('src');
    // If src is relative or missing, we assume it's same origin as host, 
    // but if it's a full URL (common for widgets), we parse it.
    const widgetUrl = src ? new URL(src, window.location.href) : new URL(window.location.href);
    const targetOrigin = widgetUrl.origin;

    if (!slug) {
        console.error('GeminiChat Widget: data-slug attribute is required.');
        return;
    }


    // Check if widget already exists
    if (document.getElementById('gemini-chat-widget-iframe')) {
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'gemini-chat-widget-iframe';
    iframe.src = `${targetOrigin}/embed/${slug}`;
    iframe.title = 'Gemini Chat Widget';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '150px'; // Increased to prevent hover clip
    iframe.style.height = '150px'; // Increased to prevent hover clip
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.style.backgroundColor = 'transparent';
    iframe.style.transition = 'width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease, border-radius 0.3s ease';
    iframe.style.borderRadius = '0'; // No radius initially to avoid corner clipping

    document.body.appendChild(iframe);

    window.addEventListener('message', function (event) {
        // Security check: ensure message comes from the widget's origin
        if (event.origin !== targetOrigin) return;

        if (event.data.type === 'CHAT_RESIZE') {
            if (event.data.isOpen) {
                // Open state dimensions
                iframe.style.width = '400px';
                iframe.style.height = '600px';
                iframe.style.maxHeight = '90vh';
                iframe.style.maxWidth = '90vw';
                iframe.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                iframe.style.borderRadius = '1rem'; // Add radius when open
            } else {
                // Closed state dimensions (button only)
                iframe.style.width = '150px'; // Keep larger size
                iframe.style.height = '150px';
                iframe.style.boxShadow = 'none';
                iframe.style.borderRadius = '0'; // Remove radius when closed
            }
        }
    });
})();
