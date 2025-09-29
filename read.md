
src/
├── config/
│   ├── database.ts
│   ├── redis.ts
│   ├── environment.ts
│   └── index.ts
├── core/
│   ├── database/
│   │   ├── migrations/
│   │   ├── repositories/
│   │   │   ├── UserRepository.ts
│   │   │   ├── ServiceProviderRepository.ts
│   │   │   ├── ServiceRequestRepository.ts
│   │   │   ├── QuoteRepository.ts
│   │   │   ├── BookingRepository.ts
│   │   │   └── CallRepository.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   ├── logger.ts
│   │   └── index.ts
│   └── types/
│       ├── database.ts   # Interfaces for database tables
│       └── index.ts
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── users/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── services/          # Service requests module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── providers/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   �w── index.ts
│   ├── quotes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── bookings/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── communications/    # Calls, WhatsApp, notifications
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── payments/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── types.ts
│   │   └── index.ts
│   └── products/          # E-commerce for service-related products
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── types.ts
│       └── index.ts
├── app.ts
└── server.ts