import { Response } from './response.model';

export interface Challenge {
    id: number;
    guid: string;
    userName: string;
    created: Date;
    description: string;
    url: string;
    userPic: string;
    responses: Response[];
    responseCount: number;
  }
  