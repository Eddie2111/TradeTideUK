"use server";
import { prisma } from "@/lib/prisma"; // to use as client connection instance
import { IUser } from "@/types/user.types";
import { UserStatus, type UserProfile } from "@prisma/client";

export async function getOneUserWithProfile({
  id,
}: {
  id: string;
}): Promise<{ data: IUser | null; message: string }> {
  if (!id) return { data: null, message: "Error fetching user profiles" };
  try {
    const oneUserProfile = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        profiles: {
          where: {
            status: { not: UserStatus.BLOCKED },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            address: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            status: true,
            wishlists: {
              select: {
                id: true,
                userId: true,
                productId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            carts: {
              select: {
                id: true,
                userId: true,
                productId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            checkouts: {
              select: {
                id: true,
                userId: true,
                products: true,
                shippingCharge: true,
                paymentMethod: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            orders: {
              select: {
                id: true,
                userId: true,
                products: true,
                shippingCharge: true,
                paymentMethod: true,
                billingAddress: true,
                shippingAddress: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!oneUserProfile) {
      return { data: null, message: "User profile not found" };
    }

    return { data: oneUserProfile, message: "success" };
  } catch (err) {
    console.error("Error fetching user profiles:", err);
    return { data: null, message: "Error fetching user profiles" };
  }
}

export async function getOneUserIfProfileExists({
  id,
}: {
  id: string;
}): Promise<{
  data: {
    profiles: {
      id: string;
    }[];
  } | null;
  message: string;
}> {
  if (!id) return { data: null, message: "Error fetching user profiles" };
  const data = await prisma.user.findUnique({
    where: { id },
    select: {
      profiles: {
        where: {
          status: { not: UserStatus.BLOCKED },
        },
        select: {
          id: true,
        },
      },
    },
  });
  return { data, message: "success" };
}

// ! May not be required
// export async function getUsersWithProfile({
//   skip = 0,
//   take = 10,
//   filter = {},
// }: {
//   skip?: number;
//   take?: number;
//   filter?: Partial<{
//     firstName: string;
//     lastName: string;
//     email: string;
//   }>;
// }) {
//   try {
//     // Construct the WHERE clause for filtering user profiles
//     const where: Prisma.UserProfileWhereInput = {
//       firstName: filter.firstName ? { contains: filter.firstName } : undefined,
//       lastName: filter.lastName ? { contains: filter.lastName } : undefined,
//       user: filter.email
//         ? {
//             email: { contains: filter.email },
//           }
//         : undefined,
//     };

//     // Fetch user profiles with their associated orders
//     const [userProfiles, total] = await Promise.all([
//       prisma.userProfile.findMany({
//         where,
//         skip,
//         take,
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//           phoneNumber: true,
//           address: true,
//           image: true,
//           createdAt: true,
//           updatedAt: true,
//           status: true,
//           user: {
//             select: {
//               email: true,
//             },
//           },
//           orders: {
//             select: {
//               products: true, // Array of product IDs
//               shippingCharge: true, // Shipping charge for the order
//             },
//           },
//         },
//       }),
//       prisma.userProfile.count({ where }),
//     ]);

//     // Process each user profile to calculate additional metrics
//     const enrichedUserProfiles = await Promise.all(
//       userProfiles.map(async profile => {
//         // Flatten all product arrays from orders into a single array
//         const allProducts = profile.orders.flatMap(order => order.products);

//         // Calculate the total number of products purchased
//         const totalProductsPurchased = allProducts.length;

//         // Calculate the total amount spent by the user
//         const totalAmountSpent = profile.orders.reduce(
//           (sum, order) =>
//             sum +
//             order.products.length * 10 + // Assuming $10 per product (replace with actual price logic)
//             order.shippingCharge,
//           0,
//         );

//         // Calculate the average number of expenses per order
//         const totalOrders = profile.orders.length;
//         const averageExpenses =
//           totalOrders > 0 ? totalProductsPurchased / totalOrders : 0;

//         // Return the enriched user profile object
//         return {
//           ...profile,
//           totalProductsPurchased,
//           averageExpenses,
//           totalAmountSpent,
//         };
//       }),
//     );

//     return { users: enrichedUserProfiles, total };
//   } catch (err) {
//     console.error("Error fetching user profiles:", err);
//     throw err;
//   }
// }
// ! May not be required

export async function updateUserWithProfile({
  id,
  userData,
}: {
  id: string;
  userData: Partial<UserProfile>;
}) {
  try {
    console.log(userData);
    const response = await prisma.userProfile.update({
      where: { id },
      data: userData,
    });
    console.log(response);
    return true;
  } catch (err: unknown) {
    const errorData = err as { code: string; message: string };
    if (errorData.code === "P2002") {
      console.log("Duplicate entry");
      return false;
    }
    console.log("Error updating user profile:", errorData.message);
  }
}
