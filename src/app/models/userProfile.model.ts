export interface UserProfile {
    firstName: string;
    lastName: string;
    birthday: string;  // This would typically be a `Date` but using `string` if the API returns it as an ISO format string
    userName: string;
    email: string;
    id: string;
    created: string;  // Could be `Date` as well, if needed
    isLoggedInUser: boolean;
    imageUrl?: string;
    profileImageUrl: string; // Add the property for image URL
    description: string;
    followersCount: number;
    followingCount: number;
    challengesCount: number;
    websiteUrl: string;
  }
  