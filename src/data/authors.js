export const authors = {
  mezbaul: {
    id: 'mezbaul',
    name: 'Mezbaul',
    title: 'Writer, designer, and systems thinker',
    avatar: '/images/authors/mezbaul.webp',
    coverPhoto: '/images/authors/covers/mezbaul-cover.jpg',
    bio: 'I write about work systems, product clarity, and the quiet value of a thoughtful web presence.',
    website: 'https://mezbaul.bd',
    twitter: 'https://twitter.com/mezbaul',
  },
  aisha: {
    id: 'aisha',
    name: 'Aisha Rahman',
    title: 'Operations writer and process designer',
    avatar: '/images/authors/aisha.webp',
    coverPhoto: '/images/authors/covers/aisha-cover.jpg',
    bio: 'Aisha writes about internal systems, support, and the way strong operations make teams feel lighter.',
    website: null,
    twitter: 'https://twitter.com/aisharahman',
  },
  nova: {
    id: 'nova',
    name: 'Nova Chen',
    title: 'Product thinker and calm technology writer',
    avatar: '/images/authors/nova.webp',
    coverPhoto: '/images/authors/covers/nova-cover.jpg',
    bio: 'Nova explores product clarity, usability, and the slower side of technology that feels useful long-term.',
    website: null,
    twitter: 'https://twitter.com/novachen',
  },
  rio: {
    id: 'rio',
    name: 'Rio Santos',
    title: 'Travel writer and attention guide',
    avatar: '/images/authors/rio.webp',
    coverPhoto: '/images/authors/covers/rio-cover.jpg',
    bio: 'Rio writes about travel, presence, and how movement changes the way we notice ordinary routines.',
    website: null,
    twitter: 'https://twitter.com/riosantos',
  },
};

export const authorList = Object.values(authors);

export const getAuthorById = (id) => authors[id];
