// jest.mock("mongoose", () => {
//     class MockSchema {
//       constructor(schemaDefinition) {
//         this.obj = schemaDefinition;
//         this.preHooks = [];
//       }

//       pre(hookName, callback) {
//         this.preHooks.push({ hookName, callback });
//       }
//     }

//     const mockModel = {
//       find: jest.fn(),
//       findOne: jest.fn(() => ({
//         select: mockSelect,
//       })),
//       create: jest.fn(),
//       deleteOne: jest.fn(),
//       findOneAndUpdate: jest.fn(),
//       save: jest.fn()
//     };

//     const mockMongoose = {
//       Schema: MockSchema,
//       model: jest.fn(() => mockModel),
//       connect: jest.fn().mockResolvedValue(true),
//       connection: {
//         close: jest.fn().mockResolvedValue(true),
//       },
//     };

//     return mockMongoose;
//   });

//   jest.mock("jsonwebtoken", () => ({
//     verify: jest.fn((token, secret, callback) => {
//       if (token === "valid-token") {
//         callback(null, { id: "123", email: "test@example.com" }); // Simulate valid token payload
//       } else {
//         callback(new Error("Invalid token"), null); // Simulate token verification failure
//       }
//     }),
//     sign: jest.fn(() => "mocked-token"),
//   }));

//   jest.mock("redis", () => {
//     const mockRedisClient = {
//       connect: jest.fn().mockResolvedValue(true),
//       set: jest.fn(),
//       get: jest.fn().mockResolvedValue(null), // Simulate no tokens being blacklisted
//       quit: jest.fn(),
//     };
//     return {
//       createClient: jest.fn(() => mockRedisClient),
//     };
//   });
