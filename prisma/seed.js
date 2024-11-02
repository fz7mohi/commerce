// File: prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a test user if not exists
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      image: '/api/placeholder/64/64'
    }
  });

  console.log('Created test user:', user.id);

  // Create some sample posts
  const posts = await Promise.all([
    prisma.socialPost.create({
      data: {
        content: 'This is a test post with a mock product! 🚀',
        images: ['/api/placeholder/400/300'],
        products: ['mock-product-1'],
        visibility: 'PUBLIC',
        tags: ['test', 'mock'],
        user: {
          connect: {
            id: user.id
          }
        }
      }
    }),
    prisma.socialPost.create({
      data: {
        content: 'Another test post with multiple images! 📸',
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        visibility: 'PUBLIC',
        tags: ['test', 'images'],
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })
  ]);

  console.log(
    'Created posts:',
    posts.map((p) => p.id)
  );

  // Add some likes and comments
  await Promise.all([
    prisma.like.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        post: {
          connect: {
            id: posts[0].id
          }
        }
      }
    }),
    prisma.comment.create({
      data: {
        content: 'This is a test comment!',
        user: {
          connect: {
            id: user.id
          }
        },
        post: {
          connect: {
            id: posts[0].id
          }
        }
      }
    })
  ]);

  console.log('Added likes and comments');
  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
