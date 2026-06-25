const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.updateMany({ where: {}, data: { isEmailVerified: true } })
  .then(r => console.log('Updated', r.count, 'users to isEmailVerified=true'))
  .catch(e => console.error(e))
  .finally(() => p.$disconnect());
