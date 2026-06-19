const formatItemName = (name) => {
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

  if (mapping[name]) {
    return mapping[name];
  }

  return name
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

console.log('mango_cake ->', formatItemName('mango_cake'));
console.log('extra_pav ->', formatItemName('extra_pav'));
console.log('thali ->', formatItemName('thali'));
