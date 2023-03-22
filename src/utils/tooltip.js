

export default function tooltip() {
    let tooltipTriggerList = [];
    let tooltipList = [];
    const init = () => {
        tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
            return new window.bootstrap.Tooltip(tooltipTriggerEl, {
                container: tooltipTriggerEl.dataset.bsContainer || "#page-container",
                animation:
                    !!(tooltipTriggerEl.dataset.bsAnimation &&
                        tooltipTriggerEl.dataset.bsAnimation.toLowerCase() === "true"),
            });
        });
    }

    const dispose = () => {
        tooltipList.forEach((tooltip) => tooltip.dispose());
    }
    return {
        init,
        dispose
    }
}
