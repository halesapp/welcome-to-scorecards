document.querySelectorAll('.fence, .house, .pool').forEach(element => {
  element.addEventListener('click', () => {
    // Remove any existing highlight first
    document.querySelectorAll('.highlight-box').forEach(e => e.remove());

    // Get the bounding box of the clicked element
    const rect = element.getBoundingClientRect();

    // Create the highlight element
    const highlight = document.createElement('div');
    highlight.classList.add('highlight-box');

    // Position it absolutely around the clicked element
    const padding = 10; // px
    highlight.style.top = `${window.scrollY + rect.top - padding}px`;
    highlight.style.left = `${window.scrollX + rect.left - padding}px`;
    highlight.style.width = `${rect.width + padding}px`;
    highlight.style.height = `${rect.height + padding}px`;

    document.body.appendChild(highlight);
  });
});

