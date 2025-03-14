import {User} from '@app/models/backend/user';
export { User as UserResponse} from '@app/models/backend/user';
export { UserPageResponse as UserPageResponse} from '@app/models/backend/user';


/* export interface EmailPasswordCredentials {
  email: string;
  password: string;
} */

// user.models.ts
export interface UsernamePasswordCredentials {
  username: string;
  password: string;
}


export interface UserRequest extends User {
  password: string;
}

export type UserCreate = Omit<User, 'id' | 'token'>;
