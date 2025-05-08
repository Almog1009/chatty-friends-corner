import userData from "@/data/users.json";

export interface User {
  id: string;
  name: string;
  pronouns: string;
  score: number;
  summary: string;
  friends: string[];
  supporters: Supporter[];
}

export interface Supporter {
  phone: string;
  firstName: string;
  lastName: string;
}

class UserService {
  private users: User[] = userData.users;

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getFriends(userId: string): User[] {
    const user = this.getUserById(userId);
    if (!user) return [];

    return user.friends
      .map((friendId) => this.getUserById(friendId))
      .filter((user): user is User => user !== undefined);
  }

  addFriend(userId: string, friendId: string): boolean {
    const user = this.getUserById(userId);
    const friend = this.getUserById(friendId);

    if (!user || !friend) return false;
    if (user.friends.includes(friendId)) return false;

    user.friends.push(friendId);
    friend.friends.push(userId);
    return true;
  }

  removeFriend(userId: string, friendId: string): boolean {
    const user = this.getUserById(userId);
    const friend = this.getUserById(friendId);

    if (!user || !friend) return false;

    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((id) => id !== userId);
    return true;
  }

  updateUserScore(userId: string, newScore: number): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    user.score = newScore;
    return true;
  }

  updateUserSummary(userId: string, newSummary: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    user.summary = newSummary;
    return true;
  }
}

export const userService = new UserService();
