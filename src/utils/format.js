export const formatItemName = (name) => {
  if (!name) return '';
  const mapping = {
    pav_bhaji: 'Pav Bhaji',
    pesto: 'Pesto Pizza',
    cheese_pizza: 'Cheese Pizza',
    veg_pizza: 'Veg Pizza',
    khichadi: 'Khichadi',
    lot: 'Papdi Lot',
    papadi_no_lot: 'Papdi Lot',
    chat: 'Samosa Chat',
    lemonade: 'Lemonade',
    tea: 'Tea',
    coffee: 'Coffee',
    extra_pav: 'Extra Pav',
    thali: 'Special Thali',
    samosa: 'Samosa',
    puff: 'Puff',
    dabeli: 'Dabeli',
    lilwa: 'Lilwa',
    patties: 'Patties',
  };

  // If there's an explicit mapping, use it
  if (mapping[name]) {
    return mapping[name];
  }

  // Otherwise, format it nicely: replace underscores/dashes with spaces and capitalize each word
  return name
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
