import mongoose from "mongoose";

main().catch((err) => console.log(err));

async function main() {
  console.log(process.env.DB_URL as string);
  await mongoose.connect(process.env.DB_URL as string);
}
