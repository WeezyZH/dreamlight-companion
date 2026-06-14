document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.innerWidth <= 700;

    if (!isMobile) return;

    const main = document.querySelector("main");

    if (!main) return;

    setTimeout(() => {
        main.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 350);
});