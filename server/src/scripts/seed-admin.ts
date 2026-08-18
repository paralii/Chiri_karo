import { UserRepository } from "../infrastructure/repositories/user.repository";
import { PasswordService } from "../infrastructure/services/bcrypt.password.service";
import { Role } from "../shared/enums/Role.enum";
import { mongoDatabase } from "../infrastructure/database/mongodb";
import { logger } from "../infrastructure/logger/logger";

interface SeedAdminEnv {
  name: string;
  email: string;
  password: string;
}

const readSeedEnv = (): SeedAdminEnv => {
  const name = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Missing SEED_ADMIN_NAME, SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD environment variables",
    );
  }

  if (password.length < 8) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 8 characters long");
  }

  return { name, email, password };
};

const run = async (): Promise<void> => {
  const { name, email, password } = readSeedEnv();

  const userRepository = new UserRepository();
  const passwordService = new PasswordService();

  await mongoDatabase.connect();

  try {
    const existing = await userRepository.findByEmail(email);

    if (existing) {
      logger.warn(
        `Seed skipped: a user with email "${email}" already exists (role: ${existing.role})`,
      );
      return;
    }

    const hashedPassword = await passwordService.hash(password);

    const admin = await userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
    });

    logger.info(
      `Seeded first admin: ${admin.email} (id: ${admin._id.toString()})`,
    );
  } finally {
    await mongoDatabase.disconnect();
  }
};

run()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    logger.error(`Admin seed failed: ${error.message}`);
    process.exit(1);
  });
