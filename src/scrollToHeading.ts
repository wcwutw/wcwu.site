const NAVBAR_HEIGHT = 80;

export function scrollToHeading(id: string, behavior: ScrollBehavior = 'auto'): boolean {
    const element = document.getElementById(id);
    if (!element) return false;

    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
        top: Math.max(0, elementTop - NAVBAR_HEIGHT),
        behavior,
    });
    return true;
}

function waitForImage(img: HTMLImageElement): Promise<void> {
    if (img.complete) {
        return img.decode?.().catch(() => undefined) ?? Promise.resolve();
    }

    return new Promise((resolve) => {
        const done = () => {
            img.removeEventListener('load', done);
            img.removeEventListener('error', done);
            void (img.decode?.().catch(() => undefined) ?? Promise.resolve()).then(() => resolve());
        };
        img.addEventListener('load', done);
        img.addEventListener('error', done);
    });
}

function watchLayoutShifts(id: string, target: Element, idleMs: number, maxMs: number): Promise<void> {
    if (typeof ResizeObserver === 'undefined') {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        let idleTimer = 0;
        const maxTimer = window.setTimeout(stop, maxMs);

        const ro = new ResizeObserver(() => {
            scrollToHeading(id, 'auto');
            window.clearTimeout(idleTimer);
            idleTimer = window.setTimeout(stop, idleMs);
        });

        function stop() {
            window.clearTimeout(idleTimer);
            window.clearTimeout(maxTimer);
            ro.disconnect();
            resolve();
        }

        ro.observe(target);
        idleTimer = window.setTimeout(stop, idleMs);
    });
}

/**
 * Scroll to a heading after images above it have loaded and layout has settled.
 * Prevents ToC jumps when photos load after the initial scroll.
 */
export async function scrollToHeadingWhenReady(
    id: string,
    options: { finalBehavior?: ScrollBehavior; imageWaitMs?: number } = {}
): Promise<void> {
    const { finalBehavior = 'auto', imageWaitMs = 5000 } = options;
    const element = document.getElementById(id);
    if (!element) return;

    const postContent = document.querySelector('.post-content');
    const imgs = postContent ? Array.from(postContent.querySelectorAll('img')) : [];

    scrollToHeading(id, 'auto');

    await Promise.race([
        Promise.all(imgs.map(waitForImage)),
        new Promise<void>((resolve) => window.setTimeout(resolve, imageWaitMs)),
    ]);

    scrollToHeading(id, 'auto');

    const watchTarget = postContent ?? element.closest('.blog-post') ?? document.body;
    await watchLayoutShifts(id, watchTarget, 300, 3000);

    scrollToHeading(id, finalBehavior);
}
