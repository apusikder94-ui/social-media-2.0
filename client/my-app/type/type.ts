export interface IAuthor {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio: string;
  followers: string[];
  following: string[];
  bookmark: string[];
  post: string[];
}

export interface ApiResponseUser {
  success: boolean;
  user: IAuthor;
}

export interface IPostAuthor {
  _id: string;
  name: string;
  profilePic?: string;
}

export interface IPost {
  _id: string;
  author: IPostAuthor;
  title: string;
  post: string;
  like: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponsePost {
  success: boolean;
  message: string;
  post: IPost[];
}

export interface ILikedPost {
  success: boolean;
  message: string;
  liked: boolean;
}

export interface IComment {
  _id: string;
  author?: IAuthor;
  post: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export interface ApiResponseComment {
  success: boolean;
  message: string;
  comment: IComment[];
}

export interface ISuggestedUser {
  users: IAuthor[];
}

export interface IOtherUser {
  user: IAuthor;
}

export interface IUser {
  user: IAuthor;
}
export interface ICreatePostResposne {
  success: boolean;
  message: string;
  post: {
    author: string;
    title: string;
    post: string;
    like: string[];
    comments: string[];
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number
  }
}

export interface ISearchResposne {
  success: boolean;
  message: string;
  user: IAuthor[]
  post: IPost[]
}

export interface IFollowingPostResposne {
  success: boolean;
  posts: IPost[]
}
export interface IUpdatedPostResposne {
  success: boolean;
  message: string
  post: {
    _id: string
    author: string
    title: string
    post: string
    like: string[]
    comments: string[]
    createdAt: string
    updatedAt: string
    __v: number
  }
}
export interface IDeletePostResposne {
  success: boolean;
  message: string
  post: {
    _id: string
    author: string
    title: string
    post: string
    like: string[]
    comments: string[]
    createdAt: string
    updatedAt: string
    __v: number
  }
}
export interface ISignUp {
  success: boolean;
  message: string;
  user: IAuthor
}
export interface ISignIn {
  success: boolean;
  message: string;
  user: IAuthor
}