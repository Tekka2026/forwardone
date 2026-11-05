import type { BrandPage } from './types';
import { P } from './palette';

export const foundations: BrandPage = {
  slug: 'foundations',
  title: 'Foundations',
  lead: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, outlining our purpose, positioning and personality. Sed do eiusmod tempor incididunt ut labore.',
  tile: { color: P.periwinkle, icon: 'compass', cover: { art: 'dots', tone: 'dark' } },
  sections: [
    {
      label: 'Our story',
      blocks: [
        {
          type: 'prose',
          size: 'lead',
          paragraphs: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla, vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.',
            'Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod, and that is the short version of how it began.',
          ],
        },
      ],
    },
    {
      label: 'Mission',
      notes: ['A short statement of what we do every day and for whom. Lorem ipsum dolor sit amet.'],
      blocks: [{ type: 'statement', text: 'To lorem ipsum dolor sit amet for every consectetur, everywhere.' }],
    },
    {
      label: 'Vision',
      notes: ['A long-term aspiration for where we are going. Sed posuere consectetur est at lobortis.'],
      blocks: [
        {
          type: 'statement',
          text: 'Make the lorem world — the largest ipsum that touches every dolor on this planet — more amet for everyone it serves.',
        },
      ],
    },
    {
      label: 'Brand archetype',
      notes: ['The character our brand plays. It helps us act consistently and connect with people on a deeper level.'],
      blocks: [
        {
          type: 'feature',
          title: 'Lorem Archetype',
          body: 'A steady guide who lorem ipsum dolor sit amet, acting decisively while staying warm, curious and generous with what they know.',
          media: { tone: 'photo', ratio: 'video', seed: 3, tag: 'Archetype image' },
        },
      ],
    },
    {
      label: 'Principles',
      notes: ['How we design and how we serve. Each principle names brands that do it well.'],
      blocks: [
        {
          type: 'items',
          cols: 2,
          items: [
            { icon: 'spark', title: 'Lorem simplicity', body: 'Design experiences that are simple, functional and refined. Deliver only what is essential and solve a few problems very well.', meta: 'Brands to emulate: Lorem / Ipsum / Dolor' },
            { icon: 'chat', title: 'Ipsum hospitality', body: 'Respect people’s time with knowledgeable, friendly answers. Keep it streamlined and thoughtful.', meta: 'Brands to emulate: Amet / Sit / Elit' },
            { icon: 'shield', title: 'Dolor guardian', body: 'Advocate for the customer’s interests with care and courage, so their needs are met and protected.', meta: 'Brands to emulate: Tempor / Magna' },
          ],
        },
      ],
    },
    {
      label: 'Values',
      notes: ['Core beliefs that shape our culture and how we show up. They guide decisions today and tomorrow.'],
      blocks: [
        {
          type: 'items',
          cols: 2,
          items: [
            { icon: 'users', title: 'Lorem teams win', body: 'High-performing teams thrive on trust, empathy and deep respect. Sed posuere consectetur est.' },
            { icon: 'target', title: 'Double the ipsum', body: 'Aim high and work smart. Vestibulum id ligula porta felis euismod semper.' },
            { icon: 'heart', title: 'Make it your dolor', body: 'Own your work end to end: self-directed, accountable and proud of the outcome.' },
            { icon: 'leaf', title: 'Humility unlocks amet', body: 'Let go of ego. Stay open, seek feedback and choose candour over conflict.' },
            { icon: 'eye', title: 'Be curious, consectetur', body: 'Never stop learning. Question everything; mastery comes from first principles.' },
          ],
        },
      ],
    },
  ],
};
