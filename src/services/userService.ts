import userData from "@/data/users.json";

export interface User {
  id: string;
  name: string;
  pronouns: string;
  mySupporters: string[];
  supporties: string[];
  mindTributes: MindTribute[] | null;
}

interface MindTribute {type: MindTributeType, score: number, summary: string};

enum MindTributeType {
  "anxiety",
  "sadness",
  "loneliness",
  "fear",
  "anger"
}

class UserService {
  private users: User[] = userData.users as unknown as User[];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getSupporters(userId: string): User[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    return user.mySupporters
      .map((supporterId) => this.getUserById(supporterId
      ))
      .filter((user): user is User => user !== undefined);
  }

  getSupporties(userId: string): User[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    return user.supporties
      .map((supportyId) => this.getUserById(supportyId))
      .filter((user): user is User => user !== undefined);
  }


  getMindTributes(userId: string): MindTribute[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    return user.mindTributes || [];
  }

  




  // getFriends(userId: string): User[] {
  //   const user = this.getUserById(userId);
  //   if (!user) return [];

  //   return user.friends
  //     .map((friendId) => this.getUserById(friendId))
  //     .filter((user): user is User => user !== undefined);
  // }

  // addFriend(userId: string, friendId: string): boolean {
  //   const user = this.getUserById(userId);
  //   const friend = this.getUserById(friendId);

  //   if (!user || !friend) return false;
  //   if (user.friends.includes(friendId)) return false;

  //   user.friends.push(friendId);
  //   friend.friends.push(userId);
  //   return true;
  // }

  // removeFriend(userId: string, friendId: string): boolean {
  //   const user = this.getUserById(userId);
  //   const friend = this.getUserById(friendId);

  //   if (!user || !friend) return false;

  //   user.friends = user.friends.filter((id) => id !== friendId);
  //   friend.friends = friend.friends.filter((id) => id !== userId);
  //   return true;
  // }

  // updateUserScore(userId: string, newScore: number): boolean {
  //   const user = this.getUserById(userId);
  //   if (!user) return false;

  //   user.score = newScore;
  //   return true;
  // }

  // updateUserSummary(userId: string, newSummary: string): boolean {
  //   const user = this.getUserById(userId);
  //   if (!user) return false;

  //   user.summary = newSummary;
  //   return true;
  // }
}

export const userService = new UserService();
