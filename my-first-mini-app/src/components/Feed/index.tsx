'use client';

import { Button, TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import { Search, QrCode, Menu } from 'iconoir-react';

const items = new Array(4).fill(0).map((_, i) => ({
  id: i + 1,
  title: 'Rolled Sushi',
  rating: '4.8',
  price: '$ 7.99',
  description:
    'Rolled sushi, or maki, is sushi where ingredients like fish, vegetables, and rice are wrapped in a sheet of seaweed (nori) and then sliced into bite-sized pieces.',
  image: '/globe.svg',
}));

export const Feed = () => {
  return (
    <div className="flex flex-col gap-4">
      <TopBar title="Hello, Mikaele!" endAdornment={<QrCode />} />

      <div className="flex items-center gap-2 px-2">
        <div className="p-3 rounded-full bg-rose-500/90 text-white"><Menu /></div>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-full shadow px-4 py-2">
          <Search className="text-gray-500" />
          <input
            placeholder="Search your favorite food..."
            className="outline-none text-sm w-full bg-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-xl bg-white shadow p-3">
            <img src={item.image} alt="food" className="w-28 h-28 object-cover rounded-xl" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{item.title}</p>
                <span className="text-xs bg-gray-200 rounded px-2 py-0.5">★ {item.rating}</span>
              </div>
              <p className="text-xs text-gray-600 leading-snug">{item.description}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-rose-600 font-bold">{item.price}</span>
                <Button size="sm" variant="primary">Join</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};