import userData from "@/data/users.json";

export interface User {
  id: string;
  name: string;
  pronouns: string;
  mySupporters: string[];
  supporting: string[];
  mindTributes: MindTribute[] | null;
}

export interface MindTribute {
  type: MindTributeType, 
  score: number, 
  summary: string
};

export enum MindTributeType {
  anxiety = "anxiety",
  sadness = "sadness",
  loneliness = "loneliness",
  fear = "fear",
  anger = "anger"
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

  getSupporting(userId: string): User[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    return user.supporting
      .map((supportingId) => this.getUserById(supportingId))
      .filter((user): user is User => user !== undefined);
  }

  getMindTributes(userId: string): MindTribute[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    return user.mindTributes || [];
  }
}

export const userService = new UserService();
