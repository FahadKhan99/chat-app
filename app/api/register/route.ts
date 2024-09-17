// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import prisma from "@/app/libs/prismaClient";

// export async function POST(req: Request) {
//   try {
//     const { name, email, password } = await req.json();

//     if (!email || !name || !password) {
//       return new NextResponse("Missing info", { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Await the prisma user creation
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         hashedPassword,
//       },
//     });

//     return NextResponse.json(user);
//   } catch (error: any) {
//     console.log(error, "REGISTERATION_ERROR");
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismaClient";

export async function POST(req: Request) {
  try {
    const { name, email, password, provider, providerAccountId } =
      await req.json();

    if (!email || !name || (!password && (!provider || !providerAccountId))) {
      return new NextResponse("Missing info", { status: 400 });
    }

    let user;

    if (provider && providerAccountId) {
      // If OAuth registration (no password), check if the account exists
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // If user doesn't exist, create the user first
        user = await prisma.user.create({
          data: {
            name,
            email,
          },
        });
      }

      // Ensure the account exists in the accounts table
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          provider,
          providerAccountId,
          type: "OAuth",
        },
      });
    } else {
      // Password-based registration
      const hashedPassword = await bcrypt.hash(password, 12);

      user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
