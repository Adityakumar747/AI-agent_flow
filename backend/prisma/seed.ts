import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@voiceagent.com' },
    update: {},
    create: {
      email: 'admin@voiceagent.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create demo agent user
  const agentPassword = await bcrypt.hash('agent123', 10);
  
  const agent = await prisma.user.upsert({
    where: { email: 'agent@voiceagent.com' },
    update: {},
    create: {
      email: 'agent@voiceagent.com',
      password: agentPassword,
      name: 'Demo Agent',
      role: 'AGENT',
    },
  });

  console.log('✅ Created agent user:', agent.email);

  // Create sample knowledge base entries
  const knowledgeEntries = [
    {
      question: 'What are your business hours?',
      answer: 'We are open Monday to Friday from 9 AM to 6 PM, and Saturday from 10 AM to 4 PM. We are closed on Sundays.',
      category: 'GENERAL',
      keywords: ['hours', 'timing', 'open', 'schedule'],
      priority: 10,
    },
    {
      question: 'What services do you offer?',
      answer: 'We offer comprehensive car servicing including oil changes, brake repairs, tire rotations, engine diagnostics, AC service, and general maintenance.',
      category: 'SERVICES',
      keywords: ['services', 'offer', 'provide', 'what do you do'],
      priority: 9,
    },
    {
      question: 'How much does a service cost?',
      answer: 'Our basic service package starts at $49. Full service is $99, and premium service is $149. Prices may vary based on your vehicle model.',
      category: 'PRICING',
      keywords: ['price', 'cost', 'how much', 'pricing', 'fee'],
      priority: 8,
    },
    {
      question: 'Where are you located?',
      answer: 'We are located at 123 Main Street, Downtown. We also offer pickup and drop service within 10 miles.',
      category: 'LOCATION',
      keywords: ['location', 'address', 'where', 'find you'],
      priority: 8,
    },
    {
      question: 'Do you offer warranties?',
      answer: 'Yes, all our services come with a 6-month or 6000-mile warranty, whichever comes first.',
      category: 'WARRANTY',
      keywords: ['warranty', 'guarantee', 'coverage'],
      priority: 6,
    },
    {
      question: 'Can I book an appointment online?',
      answer: 'Yes, you can book an appointment through our website or by calling us. I can also help you book one right now!',
      category: 'BOOKING',
      keywords: ['book', 'appointment', 'schedule', 'reserve'],
      priority: 10,
    },
    {
      question: 'Do you provide pickup service?',
      answer: 'Yes, we provide free pickup and drop service within 10 miles. For locations beyond that, we charge $20.',
      category: 'SERVICES',
      keywords: ['pickup', 'drop', 'collection', 'delivery'],
      priority: 7,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cash, credit cards (Visa, Mastercard, AmEx), debit cards, and digital payments like Google Pay and Apple Pay.',
      category: 'PAYMENT',
      keywords: ['payment', 'pay', 'credit card', 'cash'],
      priority: 6,
    },
  ];

  for (const entry of knowledgeEntries) {
    await prisma.knowledgeBase.upsert({
      where: { 
        id: entry.question.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30),
      },
      update: entry,
      create: entry,
    });
  }

  console.log(`✅ Created ${knowledgeEntries.length} knowledge base entries`);

  // Create sample customers
  const sampleCustomers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      tags: ['premium', 'returning'],
      notes: 'Prefers morning appointments',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      tags: ['new'],
      notes: 'First-time customer',
    },
    {
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '+1234567892',
      tags: ['regular'],
    },
  ];

  for (const customer of sampleCustomers) {
    await prisma.customer.upsert({
      where: { phone: customer.phone },
      update: {},
      create: customer,
    });
  }

  console.log(`✅ Created ${sampleCustomers.length} sample customers`);

  // Create system configuration
  await prisma.systemConfig.upsert({
    where: { key: 'ai_settings' },
    update: {},
    create: {
      key: 'ai_settings',
      value: {
        defaultVoice: 'alloy',
        defaultModel: 'gpt-4-turbo-preview',
        maxCallDuration: 300,
        enableRecording: true,
        enableTranscription: true,
      },
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'business_info' },
    update: {},
    create: {
      key: 'business_info',
      value: {
        name: 'Premium Auto Service',
        phone: '+1234567890',
        email: 'contact@premiumauto.com',
        address: '123 Main Street, Downtown',
        website: 'https://premiumauto.com',
      },
    },
  });

  console.log('✅ Created system configuration');

  console.log('\n🎉 Database seeding completed!\n');
  console.log('📧 Admin Login:');
  console.log('   Email: admin@voiceagent.com');
  console.log('   Password: admin123\n');
  console.log('📧 Agent Login:');
  console.log('   Email: agent@voiceagent.com');
  console.log('   Password: agent123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
