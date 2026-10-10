export const icons = {
    shop: '<path d="M3 10h18l-2-6H5zM5 10v10h14V10M9 20v-6h6v6M3 10c0 2 3 3 4 0 1 3 4 3 5 0 1 3 4 3 5 0 1 3 4 2 4 0"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    cart: '<path d="M3 3h2l3 12h10l3-9H6M8 15l-1 3h12"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    accessibility: '<circle cx="12" cy="4" r="2"/><path d="M4 9h16M12 7v8m0-3-5 9m5-9 5 9"/>',
    heart: '<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-3 3-1 7 8 14 9-7 11-11 8-14Z"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
    health: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/>',
    tech: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>',
    food: '<path d="M5 10h14l-2 10H7ZM3 10h18M8 10l4-7 4 7M10 14v3M14 14v3"/>',
    tools: '<path d="M14 4a5 5 0 0 0-6 6l-5 5a3 3 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-3-3 3-3Z"/>',
    home: '<path d="m3 11 9-8 9 8M5 9v12h14V9M9 21v-7h6v7"/>',
    all: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    institution: '<path d="m3 8 9-5 9 5ZM3 21h18M5 9v9M10 9v9M14 9v9M19 9v9"/>'
  };


export const svg = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (icons[name] || icons.shop) + '</svg>';
