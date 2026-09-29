// THEME PREVIEW (temporary) — remove after choosing a palette.
// Loaded in <head> so the theme is set before style/game colors are read.
(function () {
    const themes = {
        '': 'Current colors',
        a: 'A: Quiet swap',
        b: 'B: Poster-faithful',
        c: 'C: Soft & mint-led',
        d: 'D: Painted hero',
        e: 'E: Night (dark)',
        f: 'F: Poster (serif font)',
        f2: 'F2: Poster, sharp corners',
        g: 'G: Dusk (warm)'
    };
    const params = new URLSearchParams(window.location.search);
    const requested = (params.get('theme') || '').toLowerCase();
    const theme = requested in themes ? requested : '';

    if (theme) {
        document.documentElement.dataset.theme = theme;
    }

    if (theme === 'f' || theme === 'f2') {
        const font = document.createElement('link');
        font.rel = 'stylesheet';
        font.href = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..700&display=swap';
        document.head.appendChild(font);
    }

    function urlWithTheme(href, value) {
        const url = new URL(href, window.location.href);
        if (value) {
            url.searchParams.set('theme', value);
        } else {
            url.searchParams.delete('theme');
        }
        return url.href;
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Keep the chosen theme when switching language
        if (theme) {
            document.querySelectorAll('.lang-link').forEach(link => {
                link.href = urlWithTheme(link.getAttribute('href'), theme);
            });
        }

        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        switcher.innerHTML = '<span>Theme</span>';

        Object.entries(themes).forEach(([value, label]) => {
            if (value === 'e') {
                const divider = document.createElement('span');
                divider.textContent = '|';
                switcher.appendChild(divider);
            }
            const link = document.createElement('a');
            link.textContent = value ? value.toUpperCase() : 'Now';
            link.title = label;
            link.href = urlWithTheme(window.location.href, value);
            if (value === theme) {
                link.classList.add('active');
            }
            switcher.appendChild(link);
        });

        document.body.appendChild(switcher);
    });
})();
