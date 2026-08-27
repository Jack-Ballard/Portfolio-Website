// Lightweight accessible gallery lightbox with prev/next controls
(() => {
    const gallerySelector = '.gallery-grid .gallery-item img';
    const images = Array.from(document.querySelectorAll(gallerySelector));
    if (!images.length) {
        return;
    }

    // Create lightbox DOM with prev/next buttons
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');
    lightbox.innerHTML = `
        <div class="lightbox-inner" role="document">
            <button class="lightbox-close" aria-label="Close preview">&times;</button>

            <button class="lightbox-nav lightbox-prev" aria-label="Previous image" title="Previous">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>

            <img alt="">

            <button class="lightbox-nav lightbox-next" aria-label="Next image" title="Next">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M8.59 16.59L10 18l6-6-6-6 1.41-1.41L13.17 12z"/>
                </svg>
            </button>

            <div class="lightbox-counter" aria-live="polite"></div>
        </div>
    `;

    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const counter = lightbox.querySelector('.lightbox-counter');

    let currentIndex = -1;

    function showIndex(index) {
        if (index < 0 || index >= images.length) {
            return;
        }

        const sourceEl = images[index];
        const full = sourceEl.dataset.full || sourceEl.src;

        imgEl.src = full;
        imgEl.alt = sourceEl.alt || '';

        counter.textContent = `${index + 1} / ${images.length}`;

        currentIndex = index;
    }


    function open(index) {
        showIndex(index);
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        // prevent scroll behind
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        // move focus to close button for keyboard users
        closeBtn.focus();
    }

    function close() {
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        imgEl.src = '';
        currentIndex = -1;
    }

    function prevImage() {
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex - 1 + images.length) % images.length;
        showIndex(nextIndex);
    }

    function nextImage() {
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % images.length;
        showIndex(nextIndex);
    }

    // Click on gallery images
    images.forEach((image, i) => {
        image.addEventListener('click', () => {
            open(i);
        });

        // support keyboard activation on the image itself
        image.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(i);
            }
        });

        // Make image containers focusable for keyboard users
        const parent = image.closest('.gallery-item');
        if (parent) {
            parent.setAttribute('tabindex', '0');
            parent.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(i);
                }
            });
        }
    });

    // Close via close button
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });

    // Prev/Next button handlers
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    // Click outside image closes lightbox
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            close();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const isOpen = lightbox.getAttribute('aria-hidden') === 'false';
        if (!isOpen) return;

        if (e.key === 'Escape') {
            close();
            return;
        }

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevImage();
            return;
        }

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextImage();
            return;
        }
    });

    // Prevent image drag causing undesired behavior
    imgEl.addEventListener('dragstart', (e) => e.preventDefault());
})();