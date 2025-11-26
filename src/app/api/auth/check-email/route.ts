import { prisma } from "@/src/lib/prisma/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    return Response.json({
      exists: !!existingUser,
    });
  } catch (error) {
    console.error('Error checking email:', error);
    return Response.json(
      { error: 'Failed to check email' },
      { status: 500 }
    );
  }
}
