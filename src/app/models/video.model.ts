import { Response } from './response.model';

export interface Video {
    id: number;
    userName: string;
    likes: string;
    comments: string;
    url: string;
    userPic: string;
    responses: Response[];
    loadedResponses: Response[];
  }
  